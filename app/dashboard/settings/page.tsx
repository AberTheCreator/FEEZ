'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { 
  Shield, 
  DollarSign, 
  Bell, 
  Eye,
  EyeOff,
  Save,
  AlertTriangle,
  Check,
  Settings as SettingsIcon,
  Smartphone,
  Globe,
  Moon,
  Sun,
  Monitor
} from 'lucide-react'

interface UserSettings {
  dailySpendingLimit: number
  weeklySpendingLimit: number
  requireConfirmationOver: number
  enableNotifications: boolean
  enableEmailAlerts: boolean
  passkeyRequired: boolean
  passkeyThreshold: number
  theme: 'light' | 'dark' | 'system'
  defaultChain: string
  slippageTolerance: number
  autoApproveUnder: number
}

const DEFAULT_SETTINGS: UserSettings = {
  dailySpendingLimit: 50,
  weeklySpendingLimit: 200,
  requireConfirmationOver: 10,
  enableNotifications: true,
  enableEmailAlerts: false,
  passkeyRequired: false,
  passkeyThreshold: 25,
  theme: 'system',
  defaultChain: 'base',
  slippageTolerance: 0.5,
  autoApproveUnder: 1
}

export default function SettingsPage() {
  const { address } = useAccount()
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showPasskey, setShowPasskey] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [address])

  const loadSettings = async () => {
    if (!address) return

    try {
      const stored = localStorage.getItem(`feez-settings-${address}`)
      if (stored) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) })
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    if (!address) return

    setSaving(true)
    try {
      localStorage.setItem(`feez-settings-${address}`, JSON.stringify(settings))
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = <K extends keyof UserSettings>(
    key: K, 
    value: UserSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const setupPasskey = async () => {
    try {
      // In a real app, this would interact with WebAuthn API
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: new Uint8Array(32),
          rp: {
            name: "Feez",
            id: "localhost",
          },
          user: {
            id: new TextEncoder().encode(address),
            name: address || 'user',
            displayName: `Feez User (${address?.slice(0, 6)}...${address?.slice(-4)})`,
          },
          pubKeyCredParams: [{alg: -7, type: "public-key"}],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
          },
          timeout: 60000,
          attestation: "direct"
        }
      })

      if (credential) {
        updateSetting('passkeyRequired', true)
        alert('Passkey setup successful!')
      }
    } catch (error) {
      console.error('Passkey setup failed:', error)
      alert('Passkey setup failed. Please try again.')
    }
  }

  if (!address) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center">
          <SettingsIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Connect Your Wallet
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Connect your wallet to access settings
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Customize your Feez experience
          </p>
        </div>
        
        <button
          onClick={saveSettings}
          disabled={saving}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
        >
          {saving ? (
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
          ) : saved ? (
            <Check className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}</span>
        </button>
      </div>

      {/* Spending Limits */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-lg">
            <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Spending Limits
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Set limits to control your gas spending
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Daily Limit (USDC)
            </label>
            <input
              type="number"
              value={settings.dailySpendingLimit}
              onChange={(e) => updateSetting('dailySpendingLimit', Number(e.target.value))}
              min="0"
              step="1"
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Weekly Limit (USDC)
            </label>
            <input
              type="number"
              value={settings.weeklySpendingLimit}
              onChange={(e) => updateSetting('weeklySpendingLimit', Number(e.target.value))}
              min="0"
              step="1"
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Auto-approve under (USDC)
            </label>
            <input
              type="number"
              value={settings.autoApproveUnder}
              onChange={(e) => updateSetting('autoApproveUnder', Number(e.target.value))}
              min="0"
              step="0.1"
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Require confirmation over (USDC)
            </label>
            <input
              type="number"
              value={settings.requireConfirmationOver}
              onChange={(e) => updateSetting('requireConfirmationOver', Number(e.target.value))}
              min="0"
              step="1"
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-red-100 dark:bg-red-900/20 p-2 rounded-lg">
            <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Security
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enhanced security options for your transactions
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Require Passkey Authentication
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Use biometric or device authentication for high-value transactions
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {!settings.passkeyRequired && (
                <button
                  onClick={setupPasskey}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                >
                  Setup Passkey
                </button>
              )}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.passkeyRequired}
                  onChange={(e) => updateSetting('passkeyRequired', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {settings.passkeyRequired && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Require passkey for transactions over (USDC)
              </label>
              <input
                type="number"
                value={settings.passkeyThreshold}
                onChange={(e) => updateSetting('passkeyThreshold', Number(e.target.value))}
                min="0"
                step="1"
                className="w-full max-w-xs px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-yellow-100 dark:bg-yellow-900/20 p-2 rounded-lg">
            <Bell className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Notifications
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Stay informed about your transactions
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Browser Notifications
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get notified about transaction status updates
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableNotifications}
                onChange={(e) => updateSetting('enableNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Email Alerts
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Receive email notifications for high-value transactions
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableEmailAlerts}
                onChange={(e) => updateSetting('enableEmailAlerts', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-lg">
            <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Preferences
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Customize your app experience
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Theme
            </label>
            <select
              value={settings.theme}
              onChange={(e) => updateSetting('theme', e.target.value as 'light' | 'dark' | 'system')}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Default Chain
            </label>
            <select
              value={settings.defaultChain}
              onChange={(e) => updateSetting('defaultChain', e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="base">Base</option>
              <option value="ethereum">Ethereum</option>
              <option value="polygon">Polygon</option>
              <option value="arbitrum">Arbitrum</option>
              <option value="optimism">Optimism</option>
              <option value="avalanche">Avalanche</option>
              <option value="unichain">Unichain</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Slippage Tolerance (%)
            </label>
            <input
              type="number"
              value={settings.slippageTolerance}
              onChange={(e) => updateSetting('slippageTolerance', Number(e.target.value))}
              min="0"
              max="50"
              step="0.1"
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-amber-900 dark:text-amber-400">
              Important Security Notice
            </h3>
            <p className="text-sm text-amber-800 dark:text-amber-300 mt-1">
              Settings are stored locally in your browser. Clear your browser data will reset all preferences. 
              For enhanced security, we recommend enabling passkey authentication for transactions over $25.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
