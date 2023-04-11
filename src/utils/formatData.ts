import { IBlock, IFormattedBlock, IFormattedTransaction, ITransaction } from '../interfaces'

export const formatBlockData = (block: IBlock): IFormattedBlock => {
  const tempBlock = {} as IFormattedBlock
  const { gasLimit, gasUsed, baseFeePerGas, ...remainingBlock } = block
  tempBlock.gasLimit = gasLimit?.toString()
  tempBlock.gasUsed = gasUsed?.toString()
  tempBlock.baseFeePerGas = baseFeePerGas?.toString()
  const formattedBlock = { ...tempBlock, ...remainingBlock } as IFormattedBlock
  return formattedBlock
}

export const formatTransactionData = (transaction: ITransaction): IFormattedTransaction => {
  const tempTransaction = {} as IFormattedTransaction
  const { gasPrice, gasLimit, maxPriorityFeePerGas, maxFeePerGas, value, ...remainingTransaction } =
    transaction
  tempTransaction.gasPrice = gasPrice?.toString()
  tempTransaction.gasLimit = gasLimit?.toString()
  tempTransaction.maxPriorityFeePerGas = maxPriorityFeePerGas?.toString()
  tempTransaction.maxFeePerGas = maxFeePerGas?.toString()
  tempTransaction.value = value?.toString()
  delete (remainingTransaction as any).accessList
  delete (remainingTransaction as any).r
  delete (remainingTransaction as any).s
  delete (remainingTransaction as any).v
  delete (remainingTransaction as any).creates
  delete (remainingTransaction as any).chainId
  const formattedTransaction = {
    ...tempTransaction,
    ...remainingTransaction,
  } as IFormattedTransaction
  return formattedTransaction
}

export const formatTransactionsData = (transactions: ITransaction[]): IFormattedTransaction[] => {
  const formattedTransactions: IFormattedTransaction[] = []
  const len = transactions.length
  for (let i = 0; i < len; i++) {
    formattedTransactions.push(formatTransactionData(transactions[i]))
  }
  return formattedTransactions
}
