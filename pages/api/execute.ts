import { NextApiRequest, NextApiResponse } from 'next'
import { circlePaymaster } from '@/lib/circle'
import { prisma } from '@/lib/prisma'
import { getChainConfig, isPaymasterSupported } from '@/lib/chains'

interface ExecuteRequest {
  chainId: number
  action: string
  sender: string
  recipient?: string
  amount?: string
  sponsored: boolean
  estimate: {
    gasFeeNative: string
    gasFeeUSDC: string
    nativeToken: string
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { 
      chainId, 
      action, 
      sender, 
      recipient, 
      amount, 
      sponsored, 
      estimate 
    }: ExecuteRequest = req.body

    if (!chainId || !action || !sender || !estimate) {
      return res.status(400).json({ 
        error: 'Missing required fields' 
      })
    }

    if (!isPaymasterSupported(chainId)) {
      return res.status(400).json({ 
        error: `Chain ${chainId} is not supported by Circle Paymaster` 
      })
    }

    const chainConfig = getChainConfig(chainId)

    const userOperation = createUserOperationForAction({
      action,
      sender,
      recipient,
      amount,
      chainId,
    })

    
    const result = await circlePaymaster.sponsorUserOperation({
      chainId,
      userOperation,
      sponsor: sponsored,
    })

   
    const transaction = await prisma.transaction.create({
      data: {
        txHash: result.userOpHash,
        chain: chainConfig.name,
        walletAddress: sender,
        action,
        gasFeeUSDC: parseFloat(sponsored ? '0' : estimate.gasFeeUSDC),
        gasFeeNative: parseFloat(estimate.gasFeeNative),
        nativeToken: estimate.nativeToken,
        sponsored,
        status: 'pending',
      },
    })

    
    setTimeout(async () => {
      try {
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: { 
            status: Math.random() > 0.1 ? 'confirmed' : 'failed' // 90% success rate
          },
        })
      } catch (error) {
        console.error('Failed to update transaction status:', error)
      }
    }, 5000 + Math.random() * 10000) // Random delay 5-15 seconds

    res.status(200).json({
      txHash: result.userOpHash,
      gasFeeUSDC: result.gasFeeUSDC,
      paymasterAndData: result.paymasterAndData,
      transactionId: transaction.id,
      sponsored,
    })
  } catch (error) {
    console.error('Transaction execution error:', error)
    res.status(500).json({ 
      error: 'Failed to execute transaction',
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
    nonce: '0x' + Math.floor(Date.now() / 1000).toString(16),
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
        callGasLimit: '65000',
      }
    
    case 'swap':
      if (!recipient || !amount) {
        throw new Error('Recipient and amount required for swap')
      }
      return {
        ...baseUserOp,
        callData: createSwapCallData(sender, recipient, amount),
        callGasLimit: '200000',
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
  const functionSelector = 'a9059cbb' // transfer function selector
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
