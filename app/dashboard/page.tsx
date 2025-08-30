'use client'

import { useState, useEffect } from 'react'
import { useAccount, useBalance, useChainId, useSwitchChain } from 'wagmi'
import { formatEther } from 'viem'
import { ChevronDown, Zap, Wallet, ArrowUpRight, Loader2 } from 'lucide-react'
import { CHAIN_CONFIG, getChainConfig, isPaymasterSupported } from '@/lib/chains'
import { formatAddress, formatUSDC, formatNativeToken } from '@/lib/utils'
import { GasEstimator } from '@/components/GasEstimator'
import { RecentTransactions } from '@/components/RecentTransactions'

export default function DashboardPage() {
  const { address } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const [showChainSelect, setShowChainSelect] = useState(false)

  // Get native balance
  const { data: nativeBalance } = useBalance({
    address,
  })

  // Mock USDC balance (in production, you'd fetch this from USDC contract)
  const [usdcBalance] = useState(1247.50)

  const currentChain = getChainConfig(chainId)
  const isSupported = isPaymasterSupported(chainId)

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Pay gas fees in USDC across any chain
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400">Connected</div>
            <div className="font-medium text-gray-900 dark:text-white">
              {address ? formatAddress(address) : 'Not connected'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Wallet & Chain */}
        <div className="lg:col-span-1 space-y-6">
          {/* Wallet Info Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Wallet Balance
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {address ? formatAddress(address) : 'Not connected'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* USDC Balance */}
              <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                      USDC Balance
                    </div>
                    <div className="text-2xl font-bold text-primary-700 dark:text-primary-300">
                      {formatUSDC(usdcBalance)}
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">$</span>
                  </div>
                </div>
              </div>

              {/* Native Balance */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {currentChain.nativeToken} Balance
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {nativeBalance 
                        ? formatNativeToken(formatEther(nativeBalance.value), currentChain.nativeToken)
                        : '0.00000000 ' + currentChain.nativeToken
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chain Selector */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Current Chain
            </h3>
            
            <div className="relative">
              <button
                onClick={() => setShowChainSelect(!showChainSelect)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: currentChain.color }}
                  />
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {currentChain.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {isSupported ? 'Paymaster Supported' : 'Not Supported'}
                    </div>
                  </div>
                </div>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>

              {/* Chain Dropdown */}
              {showChainSelect && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-10 max-h-64 overflow-y-auto">
                  {Object.entries(CHAIN_CONFIG).map(([id, config]) => (
                    <button
                      key={id}
                      onClick={() => {
                        switchChain({ chainId: parseInt(id) })
                        setShowChainSelect(false)
                      }}
                      className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-xl last:rounded-b-xl"
                    >
                      <div 
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: config.color }}
                      />
                      <div className="text-left flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {config.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {isPaymasterSupported(parseInt(id)) ? 'Supported' : 'Not Supported'}
                        </div>
                      </div>
                      {parseInt(id) === chainId && (
                        <div className="w-2 h-2 bg-primary-500 rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {!isSupported && (
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full" />
                  <span className="text-sm text-yellow-700 dark:text-yellow-300">
                    Circle Paymaster not available on this chain
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Gas Estimator & Recent Transactions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gas Estimator */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-xl">
                  Gas Fee Calculator
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Estimate and pay gas fees in USDC
                </p>
              </div>
            </div>

            <GasEstimator />
          </div>

          {/* Recent Transactions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-xl">
                    Recent Activity
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your latest transactions
                  </p>
                </div>
              </div>
              <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                View All
              </button>
            </div>

            <RecentTransactions limit={5} />
          </div>
        </div>
      </div>
    </div>
  )
}
