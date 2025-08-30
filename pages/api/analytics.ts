import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { address, timeframe = '30d' } = req.query

    if (!address) {
      return res.status(400).json({ error: 'Address is required' })
    }

    // Calculate date range based on timeframe
    const now = new Date()
    const startDate = new Date()
    
    switch (timeframe) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    // Fetch transactions within the timeframe
    const transactions = await prisma.transaction.findMany({
      where: {
        walletAddress: address as string,
        createdAt: {
          gte: startDate.toISOString(),
        },
        status: 'confirmed' // Only count successful transactions
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Calculate daily spending
    const dailySpending = calculateDailySpending(transactions, startDate, now)
    
    // Calculate chain usage
    const chainUsage = calculateChainUsage(transactions)
    
    // Calculate stats
    const stats = calculateStats(transactions, timeframe as string)
    
    // Calculate monthly trends
    const monthlyTrends = calculateMonthlyTrends(transactions)

    const analyticsData = {
      dailySpending,
      chainUsage,
      stats,
      monthlyTrends
    }

    res.status(200).json(analyticsData)
  } catch (error) {
    console.error('Analytics API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

function calculateDailySpending(transactions: any[], startDate: Date, endDate: Date) {
  const dailyMap = new Map<string, number>()
  
  // Initialize all days with 0
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateKey = d.toISOString().split('T')[0]
    dailyMap.set(dateKey, 0)
  }
  
  // Sum transactions by day
  transactions.forEach(tx => {
    const dateKey = new Date(tx.createdAt).toISOString().split('T')[0]
    const currentAmount = dailyMap.get(dateKey) || 0
    dailyMap.set(dateKey, currentAmount + (tx.sponsored ? 0 : tx.gasFeeUSDC))
  })
  
  return Array.from(dailyMap.entries()).map(([date, amount]) => ({
    date,
    amount: Number(amount.toFixed(2))
  }))
}

function calculateChainUsage(transactions: any[]) {
  const chainCounts = new Map<string, number>()
  const chainColors = {
    'Base': '#0052FF',
    'Polygon': '#8247E5',
    'Arbitrum': '#28A0F0',
    'Optimism': '#FF0420',
    'Avalanche': '#E84142',
    'Ethereum': '#627EEA',
    'Unichain': '#FF007A'
  }
  
  transactions.forEach(tx => {
    const chain = tx.chain
    chainCounts.set(chain, (chainCounts.get(chain) || 0) + 1)
  })
  
  return Array.from(chainCounts.entries()).map(([name, value]) => ({
    name,
    value,
    color: chainColors[name as keyof typeof chainColors] || '#6B7280'
  }))
}

function calculateStats(transactions: any[], timeframe: string) {
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  
  // Filter transactions for this week
  const thisWeekTxs = transactions.filter(tx => 
    new Date(tx.createdAt) >= weekAgo && !tx.sponsored
  )
  
  // Calculate total spent this week
  const totalThisWeek = thisWeekTxs.reduce((sum, tx) => sum + tx.gasFeeUSDC, 0)
  
  // Total transactions
  const totalTransactions = transactions.length
  
  // Largest payment
  const paidTransactions = transactions.filter(tx => !tx.sponsored)
  const largestPayment = paidTransactions.length > 0 
    ? Math.max(...paidTransactions.map(tx => tx.gasFeeUSDC))
    : 0
  
  // Average gas fee
  const averageGasFee = paidTransactions.length > 0
    ? paidTransactions.reduce((sum, tx) => sum + tx.gasFeeUSDC, 0) / paidTransactions.length
    : 0
  
  return {
    totalThisWeek: Number(totalThisWeek.toFixed(2)),
    totalTransactions,
    largestPayment: Number(largestPayment.toFixed(2)),
    averageGasFee: Number(averageGasFee.toFixed(2))
  }
}

function calculateMonthlyTrends(transactions: any[]) {
  const monthlyMap = new Map<string, { transactions: number, totalSpent: number }>()
  
  transactions.forEach(tx => {
    const date = new Date(tx.createdAt)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const monthName = date.toLocaleString('default', { month: 'long', year: 'numeric' })
    
    if (!monthlyMap.has(monthName)) {
      monthlyMap.set(monthName, { transactions: 0, totalSpent: 0 })
    }
    
    const current = monthlyMap.get(monthName)!
    current.transactions += 1
    current.totalSpent += tx.sponsored ? 0 : tx.gasFeeUSDC
  })
  
  return Array.from(monthlyMap.entries())
    .map(([month, data]) => ({
      month,
      transactions: data.transactions,
      totalSpent: Number(data.totalSpent.toFixed(2))
    }))
    .slice(-6) // Last 6 months
}
