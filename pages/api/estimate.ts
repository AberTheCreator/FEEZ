import { NextApiRequest, NextApiResponse } from 'next'
import { circlePaymaster, CirclePaymaster } from '@/lib/circle'
import { getChainConfig, isPaymasterSupported } from '@/lib/chains'

interface EstimateRequest {
  chainId: number
  action: string
  sender: string
  recipient?: string
  amount?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { chainId, action, sender, recipient, amount }: EstimateRequest = req.body

    if (!chainId || !action || !sender) {
      return res.status(400).json({ 
        error: 'Missing required fields: chainId, action, sender' 
      })
    }


    if (!isPaymasterSupported(chainId)) {
      return res.status(400).json({ 
        error: `Chain ${chainId} is not supported by Circle Paymaster` 
      })
    }

    const chainConfig = getChainConfig(chainId)

  
    let userOperation
    try {
      userOperation = createUserOperationForAction({
        action,
        sender,
        recipient,
        amount,
        chainId,
      })
    } catch (error) {
      return res.status(400).json({ 
        error: `Invalid parameters for action ${action}: ${error instanceof Error ? error.message : error}` 
      })
    }

  
    const estimate = await circlePaymaster.estimateGas({
      chainId,
      userOperation,
    })

    res.status(200).json({
      gasFeeNative: estimate.gasFeeNative,
      gasFeeUSDC: estimate.gasFeeUSDC,
      nativeToken: chainConfig.nativeToken,
      paymasterAndData: estimate.paymasterAndData,
    })
  } catch (error) {
    console.error('Gas estimation error:', error)
    res.status(500).json({ 
      error: 'Failed to estimate gas fees',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

function createUserOperationForAction({
  action,
  sender,
  recipient,
  amount,
  chainId,
}: {
  action: string
  sender: string
  recipient?: string
  amount?: string
  chainId: number
}) {
  const baseUserOp = {
    sender,
    nonce: '0x' + Math.floor(Date.now() / 1000).toString(16), // Mock nonce
    initCode: '0x',
    callGasLimit: '100000',
    verificationGasLimit: '100000',
    preVerificationGas: '21000',
    maxFeePerGas: '20000000000', // 20 gwei
    maxPriorityFeePerGas: '1000000000', // 1 gwei
    signature: '0x',
  }

  switch (action) {
    case 'mint_nft':
      return {
        ...baseUserOp,
        callData: createMintNFTCallData(sender),
      }
    
    case 'send_usdc':
      if (!recipient || !amount) {
        throw new Error('Recipient and amount required for USDC transfer')
      }
      return {
        ...baseUserOp,
        callData: createUSDCTransferCallData(recipient, amount),
        callGasLimit: '65000', // Lower gas for simple transfer
      }
    
    case 'swap':
      if (!recipient || !amount) {
        throw new Error('Recipient and amount required for swap')
      }
      return {
        ...baseUserOp,
        callData: createSwapCallData(sender, recipient, amount),
        callGasLimit: '200000', // Higher gas for swap
      }
    
    default:
      throw new Error(`Unsupported action: ${action}`)
  }
}

function createMintNFTCallData(to: string): string {
  const contractAddress = process.env.NEXT_PUBLIC_FEEZ_NFT_CONTRACT_ADDRESS
  if (!contractAddress) {
    throw new Error('NFT contract address not configured')
  }

 
  const tokenURI = `https://api.feez.app/metadata/${Date.now()}`
  
 
  const functionSelector = 'a1448194'
  
 
  const addressParam = to.slice(2).padStart(64, '0')
  
 
  const stringOffset = '0000000000000000000000000000000000000000000000000000000000000040'
  
 
  const stringLength = tokenURI.length.toString(16).padStart(64, '0')
  
  
  const stringData = Buffer.from(tokenURI).toString('hex')
  const paddedStringData = stringData.padEnd(Math.ceil(stringData.length / 64) * 64, '0')
  
  return `0x${functionSelector}${addressParam}${stringOffset}${stringLength}${paddedStringData}`
}

function createUSDCTransferCallData(to: string, amount: string): string {
 
  const functionSelector = 'a9059cbb'
  const addressParam = to.slice(2).padStart(64, '0')
  const amountParam = Math.floor(parseFloat(amount) * 1e6).toString(16).padStart(64, '0')
  
  return `0x${functionSelector}${addressParam}${amountParam}`
}

function createSwapCallData(from: string, to: string, amount: string): string {

  const functionSelector = '38ed1739' 
  const amountParam = Math.floor(parseFloat(amount) * 1e18).toString(16).padStart(64, '0')
  const addressParam1 = from.slice(2).padStart(64, '0')
  const addressParam2 = to.slice(2).padStart(64, '0')
  
  return `0x${functionSelector}${amountParam}${addressParam1}${addressParam2}`
}
