import initMongoDB from './init/db'
import { initRPCProvider } from './init/provider'
import { getCollections } from './utils/getCollections'
import { config } from 'dotenv'
import { processBlock } from './utils/processBlock'
import { findMissingBlocks } from './utils/findMissingBlocks'
config()

const main = async () => {
  // Init rpc provider
  if (!process.env.RPC_URL) {
    throw Error('.env should inlcude RPC_URL')
  }
  const rpcProvider = initRPCProvider(process.env.RPC_URL)
  // Connect to db
  const db = await initMongoDB()
  // Get collections: block and transaction
  const collections = getCollections(db)

  const blockCount = await collections.block.countDocuments()
  const recentBlock = await rpcProvider.getBlockNumber()

  // If there is no block data inside the collection it means that we are indexing for the first time
  // Therefore, process block from index 0 to current blockNumber
  if (blockCount === 0) {
    const startBlock = 0
    for (let i = startBlock; i < recentBlock; i++) {
      processBlock({ blockNumber: i, rpcProvider, collections })
    }
    // If there is blocks missing
  } else if (blockCount !== recentBlock + 1) {
    // Find missing block numbers and process them
    const missingBlockNumbers = await findMissingBlocks({ collections })
    for (let i = 0; i < missingBlockNumbers.length; i++) {
      processBlock({ blockNumber: missingBlockNumbers[i], rpcProvider, collections })
    }
  }

  // Subscribe to new blocks
  rpcProvider.on('block', async (blockNumber) => {
    processBlock({ blockNumber, rpcProvider, collections })
  })
}
main()
