'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { ExternalLink, Clock, CheckCircle, XCircle } from 'lucide-react'
import { formatUSDC, formatRelativeTime, getExplorerUrl, formatAddress } from '@/lib/utils'
import { getChainConfig } from '@/lib/chains'

interface Transaction {
  id: string
  txHash: string
  chain: string
  chainId: number
  walletAddress: string
  action: string
  gasFeeUSDC: number
  gasFeeNative: number
  nativeToken: string
  sponsored: boolean
  status: 'pending' | 'confirmed' | 'failed'
  createdAt: string
}

interface RecentTransactionsProps {
  limit?: number
}

export function RecentTransactions({ limit = 10 }: RecentTransactionsProps) {
  const { address } = useAccount()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (address) {
      fetchTransactions()
    }
  }, [address])

  const fetchTransactions = async () => {
    if (!address) return

    setLoading(true)
    try {
      const response = await fetch(`/api/transactions?address=${address}&limit=${limit}`)
      const data = await response.json()
      
      if (response.ok) {
        setTransactions(data.transactions || [])
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActionLabel = (action: string): string => {
    switch (action) {
      case 'mint_nft':
        return 'Mint NFT'
      case 'send_usdc':
        return 'Send USDC'
      case 'swap':
        return 'Swap Tokens'
      default:
        return action
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-yellow-500 animate-pulse" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 dark:text-green-400'
      case 'failed':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-yellow-600 dark:text-yellow-400'
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-lg"></div>
              <div className="space-y-1">
                <div className="w-24 h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
                <div className="w-16 h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
              </div>
            </div>
            <div className="w-16 h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No transactions yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Your transaction history will appear here
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {transactions.map((tx) => {
        const chainConfig = getChainConfig(tx.chainId)
        
        return (
          <div
            key={tx.id}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: chainConfig.color }}
              >
                <span className="text-white text-xs font-bold">
                  {chainConfig.shortName.charAt(0)}
                </span>
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {getActionLabel(tx.action)}
                  </span>
                  {getStatusIcon(tx.status)}
                  {tx.sponsored && (
                    <span className="text-xs bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 px-2 py-0.5 rounded-full">
                      Sponsored
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>{chainConfig.shortName}</span>
                  <span>•</span>
                  <span>{formatRelativeTime(tx.createdAt)}</span>
                  <span>•</span>
                  <button
                    onClick={() => window.open(getExplorerUrl(tx.chainId, tx.txHash), '_blank')}
                    className="flex items-center space-x-1 hover:text-primary-500 transition-colors"
                  >
                    <span>{formatAddress(tx.txHash)}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="font-medium text-gray-900 dark:text-white">
                {tx.sponsored ? 'Free' : formatUSDC(tx.gasFeeUSDC)}
              </div>
              <div className={`text-sm font-medium ${getStatusColor(tx.status)}`}>
                {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
