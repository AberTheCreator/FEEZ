import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { CHAIN_CONFIG } from '@/lib/chains'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req

  switch (method) {
    case 'GET':
      return handleGetTransactions(req, res)
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).json({ error: `Method ${method} Not Allowed` })
  }
}

async function handleGetTransactions(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { address, limit = '10', offset = '0', chainId, status } = req.query

    if (!address || typeof address !== 'string') {
      return res.status(400).json({ error: 'Address parameter is required' })
    }

    const limitNum = parseInt(limit as string, 10)
    const offsetNum = parseInt(offset as string, 10)

    if (isNaN(limitNum) || isNaN(offsetNum) || limitNum > 100) {
      return res.status(400).json({ 
        error: 'Invalid limit or offset. Limit must be ≤ 100' 
      })
    }

    // Build where clause
    const where: any = {
      walletAddress: address.toLowerCase(),
    }

    if (chainId && typeof chainId === 'string') {
      const chainName = CHAIN_CONFIG[parseInt(chainId)]?.name
      if (chainName) {
        where.chain = chainName
      }
    }

    if (status && typeof status === 'string') {
      where.status = status
    }

    // Fetch transactions
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limitNum,
        skip: offsetNum,
      }),
      prisma.transaction.count({ where })
    ])

    // Add chainId to each transaction for frontend use
    const transactionsWithChainId = transactions.map(tx => {
      const chainEntry = Object.entries(CHAIN_CONFIG).find(
        ([_, config]) => config.name === tx.chain
      )
      
      return {
        ...tx,
        chainId: chainEntry ? parseInt(chainEntry[0]) : 1,
      }
    })

    res.status(200).json({
      transactions: transactionsWithChainId,
      pagination: {
        total,
        limit: limitNum,
        offset: offsetNum,
        hasMore: offsetNum + limitNum < total,
      }
    })
  } catch (error) {
    console.error('Get transactions error:', error)
    res.status(500).json({ 
      error: 'Failed to fetch transactions',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
