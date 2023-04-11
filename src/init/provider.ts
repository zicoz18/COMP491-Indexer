import * as ethers from 'ethers'

export const initRPCProvider = (rpcUrl: string): ethers.providers.JsonRpcProvider => {
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
  return provider
}

export const initWSProvider = (wsUrl: string): ethers.providers.WebSocketProvider => {
  const provider = new ethers.providers.WebSocketProvider(wsUrl)
  return provider
}
