'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useBalance } from 'wagmi'
import { formatAddress, formatUSDC } from '@/lib/utils'
import { 
  Wallet, 
  Copy, 
  ExternalLink, 
  ChevronDown,
  Check,
  Loader2
} from 'lucide-react'
import { useState } from 'react'
import { getChainConfig } from '@/lib/chains'

export default function WalletConnector() {
  const { address, chain } = useAccount()
  const [copied, setCopied] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  // Get USDC balance on current chain
  const usdcAddress = chain ? getChainConfig(chain.id)?.usdcAddress : undefined
  const { data: usdcBalance, isLoading: usdcLoading } = useBalance({
    address,
    token: usdcAddress as `0x${string}`,
  })

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const openExplorer = () => {
    if (address && chain) {
      const config = getChainConfig(chain.id)
      if (config) {
        window.open(`${config.explorerUrl}/address/${address}`, '_blank')
      }
    }
  }

  return (
    <div className="relative">
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          const ready = mounted && authenticationStatus !== 'loading'
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus ||
              authenticationStatus === 'authenticated')

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                'style': {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <button
                      onClick={openConnectModal}
                      type="button"
                      className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <Wallet className="w-5 h-5" />
                      <span>Connect Wallet</span>
                    </button>
                  )
                }

                if (chain.unsupported) {
                  return (
                    <button
                      onClick={openChainModal}
                      type="button"
                      className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
                    >
                      <span>Wrong network</span>
                    </button>
                  )
                }

                return (
                  <div className="flex items-center space-x-3">
                    {/* Chain Selector */}
                    <button
                      onClick={openChainModal}
                      type="button"
                      className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 20,
                            height: 20,
                            borderRadius: 999,
                            overflow: 'hidden',
                          }}
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                              style={{ width: 20, height: 20 }}
                            />
                          )}
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {chain.name}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>

                    {/* Account Info */}
                    <div className="relative">
                      <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        type="button"
                        className="flex items-center space-x-3 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                            <Wallet className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="text-left">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {account.displayName}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                              {usdcLoading ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <span>
                                  {usdcBalance ? formatUSDC(Number(usdcBalance.formatted)) : '0.00'} USDC
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      </button>

                      {/* Dropdown */}
                      {showDropdown && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowDropdown(false)}
                          />
                          <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-20">
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {account.displayName}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatAddress(account.address)}
                                  </p>
                                </div>
                                <button
                                  onClick={copyAddress}
                                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                  {copied ? (
                                    <Check className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <Copy className="w-4 h-4 text-gray-400" />
                                  )}
                                </button>
                              </div>
                            </div>
                            
                            <div className="p-2">
                              <button
                                onClick={openExplorer}
                                className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                              >
                                <ExternalLink className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                  View on Explorer
                                </span>
                              </button>
                              
                              <button
                                onClick={() => {
                                  openAccountModal()
                                  setShowDropdown(false)
                                }}
                                className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                              >
                                <Wallet className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                  Account Settings
                                </span>
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )
              })()}
            </div>
          )
        }}
      </ConnectButton.Custom>
    </div>
  )
}
