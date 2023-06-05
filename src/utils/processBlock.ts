import * as ethers from 'ethers'
import * as mongoDB from 'mongodb'

import { formatBlockData, formatTransactionsData } from './formatData'
import { ITransaction } from '../interfaces'

export const processBlock = async ({
  blockNumber,
  rpcProvider,
  collections,
}: {
  blockNumber: number | string
  rpcProvider: ethers.providers.JsonRpcProvider
  collections: {
    block: mongoDB.Collection<mongoDB.Document>
    transaction: mongoDB.Collection<mongoDB.Document>
  }
}) => {
  const blockWithTransactions = await rpcProvider.getBlockWithTransactions(blockNumber)
  const { transactions, ...block } = blockWithTransactions

  // Format block and transactions in a way that will be useful for us
  const formattedBlock = formatBlockData(block)
  let formattedTransactions = formatTransactionsData(transactions as unknown as ITransaction[])

  // Insert block and transaction data to our db
  const existingBlock = await collections.block.findOne({ number: formattedBlock.number })
  if (!existingBlock) {
    await collections.block.insertOne(formattedBlock)
    if (transactions.length !== 0) {
      formattedTransactions = formattedTransactions.map((tx) => {
        if (tx.to === '0xC3C4262B47F140ddC60B098c21e96b480517E6C0') {
          tx.eventData = ethers.BigNumber.from('0x' + tx.data.slice(74, 138)).toString()
        }
        return tx
      })
      await collections.transaction.insertMany(formattedTransactions)
    }
    console.log(`Processed block ${blockNumber}`)
  } else {
    console.log(`Reprocessed block ${blockNumber}`)
  }
}
