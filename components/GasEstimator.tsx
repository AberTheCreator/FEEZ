'use client'

import { useState, useEffect } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { Loader2, Zap, CheckCircle, AlertCircle } from 'lucide-react'
import { getChainConfig, isPaymasterSupported } from '@/lib/chains'
import { formatUSDC, formatNativeToken, generateRandomTokenURI } from '@/lib/utils'

interface GasEstimate {
  gasFeeNative: string
  gasFeeUSDC: string
  nativeToken: string
}

export function GasEstimator() {
  const { address } = useAccount()
  const chainId = useChainId()
  const [action, setAction] = useState('mint_nft')
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [sponsored, setSponsored] = useState(false)
  const [loading, setLoading] = useState(false)
  const [executing, setExecuting] = useState(false)
  const [estimate, setEstimate] = useState<GasEstimate | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const chainConfig = getChainConfig(chainId)
  const isSupported = isPaymasterSupported(chainId)

  useEffect(() => {
    // Reset recipient for mint NFT
    if (action === 'mint_nft') {
      setRecipient(address || '')
    }
  }, [action, address])

  const estimateGas = async () => {
    if (!address) return

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/estimate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chainId,
          action,
          sender: address,
          recipient: action === 'mint_nft' ? address : recipient,
          amount: amount || '0',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to estimate gas')
      }

      setEstimate({
        gasFeeNative: data.gasFeeNative,
        gasFeeUSDC: data.gasFeeUSDC,
        nativeToken: chainConfig.nativeToken,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to estimate gas')
    } finally {
      setLoading(false)
    }
  }

  const executeTransaction = async () => {
    if (!address || !estimate) return

    setExecuting(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chainId,
          action,
          sender: address,
          recipient: action === 'mint_nft' ? address : recipient,
          amount: amount || '0',
          sponsored,
          estimate,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to execute transaction')
      }

      setSuccess(`Transaction successful! Hash: ${data.txHash}`)
      setEstimate(null)
      
      // Reset form
      if (action === 'mint_nft') {
        setRecipient(address)
      } else {
        setRecipient('')
      }
      setAmount('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed')
    } finally {
      setExecuting(false)
    }
  }

  if (!isSupported) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Chain Not Supported
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Circle Paymaster is not available on {chainConfig.name}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Please switch to a supported chain to use gas payments in USDC
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Action Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Action
        </label>
        <select
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="mint_nft">Mint NFT</option>
          <option value="send_usdc">Send USDC</option>
          <option value="swap">Swap Tokens</option>
        </select>
      </div>

      {/* Conditional Fields */}
      {action !== 'mint_nft' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Recipient Address
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      )}

      {(action === 'send_usdc' || action === 'swap') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Amount {action === 'send_usdc' ? '(USDC)' : ''}
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Estimate Button */}
      <button
        onClick={estimateGas}
        disabled={loading || !address || (action !== 'mint_nft' && !recipient)}
        className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Estimating...</span>
          </>
        ) : (
          <>
            <Zap className="w-4 h-4" />
            <span>Estimate Gas</span>
          </>
        )}
      </button>

      {/* Gas Estimate Display */}
      {estimate && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Gas Cost:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatNativeToken(estimate.gasFeeNative, estimate.nativeToken)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">USDC Cost:</span>
            <span className="font-bold text-primary-600 dark:text-primary-400 text-lg">
              {formatUSDC(estimate.gasFeeUSDC)}
            </span>
          </div>
          
          {/* Sponsor Toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Sponsor gas with dApp
            </span>
            <button
              onClick={() => setSponsored(!sponsored)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                sponsored ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  sponsored ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          
          {sponsored && (
            <div className="text-xs text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 p-2 rounded">
              ✨ Gas will be sponsored by Feez - you pay nothing!
            </div>
          )}
        </div>
      )}

      {/* Execute Button */}
      {estimate && (
        <button
          onClick={executeTransaction}
          disabled={executing}
          className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {executing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Executing...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>
                Confirm & Pay {sponsored ? '(Sponsored)' : formatUSDC(estimate.gasFeeUSDC)}
              </span>
            </>
          )}
        </button>
      )}

      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700 dark:text-red-400">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-700 dark:text-green-400">{success}</span>
          </div>
        </div>
      )}
    </div>
  )
}
