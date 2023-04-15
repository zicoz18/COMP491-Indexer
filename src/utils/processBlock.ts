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
  const formattedTransactions = formatTransactionsData(transactions as unknown as ITransaction[])

  // Insert block and transaction data to our db
  const existingBlock = await collections.block.findOne({ number: formattedBlock.number })
  if (!existingBlock) {
    await collections.block.insertOne(formattedBlock)
    if (transactions.length !== 0) {
      await collections.transaction.insertMany(formattedTransactions)
    }
    console.log(`Processed block ${blockNumber}`)
    // console.log(blockWithTransactions)
  } else {
    console.log(`Reprocessed block ${blockNumber}`)
  }
}
