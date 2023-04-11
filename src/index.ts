import initMongoDB from './init/db'
import { initWSProvider } from './init/provider'
import { ITransaction } from './interfaces'
import { formatTransactionsData, formatBlockData } from './utils/formatData'
import { getCollections } from './utils/getCollections'

const wsProvider = initWSProvider('wss://api.avax-test.network/ext/bc/C/ws')

const main = async () => {
  // Connect to db
  const db = await initMongoDB()
  // Get collections: block and transaction
  const collections = getCollections(db)

  // Subscribe to new blocks
  wsProvider.on('block', async (newBlockNumber) => {
    // Get block with transactions, given block number
    const blockWithTransactions = await wsProvider.getBlockWithTransactions(newBlockNumber)
    const { transactions, ...block } = blockWithTransactions

    // Format block and transactions in a way that will be useful for us
    const formattedBlock = formatBlockData(block)
    const formattedTransactions = formatTransactionsData(transactions as unknown as ITransaction[])

    // Insert block and transaction data to our db
    await collections.block.insertOne(formattedBlock)
    await collections.transaction.insertMany(formattedTransactions)
    console.log(`Processed block ${newBlockNumber}`)
  })
}
main()
