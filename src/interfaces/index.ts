import { BigNumber } from 'ethers'

export interface IBlock {
  hash: string
  parentHash: string
  number: number
  timestamp: number
  nonce: string
  difficulty: number
  _difficulty: BigNumber
  gasLimit: BigNumber
  gasUsed: BigNumber
  miner: string
  extraData: string
  baseFeePerGas?: null | BigNumber
}

export interface IFormattedBlock {
  hash: string
  parentHash: string
  number: number
  timestamp: number
  nonce: string
  difficulty: number
  gasLimit: string
  gasUsed: string
  miner: string
  extraData: string
  baseFeePerGas?: null | string
}

export interface ITransaction {
  hash: string
  type: number
  blockHash: string
  blockNumber: number
  transactionIndex: number
  confirmations: number
  from: string
  gasPrice: BigNumber
  maxPriorityFeePerGas: BigNumber
  maxFeePerGas: BigNumber
  gasLimit: BigNumber
  to: string
  value: BigNumber
  nonde: number
  data: string
}

export interface IFormattedTransaction {
  hash: string
  type: number
  blockHash: string
  blockNumber: number
  transactionIndex: number
  confirmations: number
  from: string
  gasPrice: string
  maxPriorityFeePerGas: string
  maxFeePerGas: string
  gasLimit: string
  to: string
  value: string
  nonde: number
  data: string
  eventData?: string
}
