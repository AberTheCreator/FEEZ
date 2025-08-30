'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { ArrowRight, Zap, Globe, Shield, TrendingUp } from 'lucide-react'

export default function LandingPage() {
  const { isConnected } = useAccount()
  const router = useRouter()

  useEffect(() => {
    if (isConnected) {
      router.push('/dashboard')
    }
  }, [isConnected, router])

  if (isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white text-lg">Redirecting to dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold gradient-text">FEEZ</span>
        </div>
        <div className="flex items-center space-x-6">
          <a href="#features" className="text-gray-300 hover:text-white transition-colors">
            Features
          </a>
          <a href="#docs" className="text-gray-300 hover:text-white transition-colors">
            Docs
          </a>
          <a 
            href="https://github.com/feez-app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white transition-colors"
          >
            GitHub
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="flex items-center justify-between">
          {/* Left Content */}
          <div className="flex-1 max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Pay{' '}
              <span className="gradient-text animate-pulse">Gas fees</span>
              {' '}in
            </h1>
            <div className="relative inline-block mb-8">
              <div className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent border-4 border-primary-500 rounded-full px-8 py-4 animate-pulse-green">
                USDC
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-300 mb-8">
              Across <span className="text-primary-400">any</span> chain
            </h2>
            <p className="text-xl text-gray-400 mb-12 leading-relaxed max-w-xl">
              Skip native tokens. Use USDC to pay for gas fees across multiple EVM chains using Circle Paymaster and ERC-4337.
            </p>
            
            <div className="flex items-center space-x-4">
              <div className="transform hover:scale-105 transition-transform">
                <ConnectButton.Custom>
                  {({ account, chain, openConnectModal, mounted }) => {
                    const ready = mounted
                    const connected = ready && account && chain

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
                                className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                              >
                                <span>Connect Wallet :)</span>
                                <ArrowRight className="w-5 h-5" />
                              </button>
                            )
                          }
                          return null
                        })()}
                      </div>
                    )
                  }}
                </ConnectButton.Custom>
              </div>
              <a
                href="#features"
                className="text-gray-300 hover:text-white font-medium text-lg transition-colors flex items-center space-x-2"
              >
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Phone Mockup */}
          <div className="flex-1 flex justify-center items-center relative">
            <div className="relative animate-float">
              {/* Phone Frame */}
              <div className="w-80 h-[600px] bg-gray-800 rounded-[3rem] p-2 shadow-2xl border border-gray-600">
                <div className="w-full h-full bg-black rounded-[2.5rem] overflow-hidden relative">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-lg"></div>
                  
                  {/* App Screenshot */}
                  <div className="h-full w-full bg-gradient-to-br from-gray-900 to-gray-800 p-6">
                    {/* App Header */}
                    <div className="flex items-center justify-between mb-8 pt-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-primary-500 rounded-lg"></div>
                        <span className="text-white font-semibold">Feez</span>
                      </div>
                      <div className="w-8 h-8 bg-primary-500 rounded-full"></div>
                    </div>

                    {/* Balance Card */}
                    <div className="bg-gray-700 rounded-2xl p-4 mb-6">
                      <div className="text-gray-400 text-sm mb-1">USDC Balance</div>
                      <div className="text-white text-2xl font-bold">$1,247.50</div>
                      <div className="text-primary-400 text-sm">Base Sepolia</div>
                    </div>

                    {/* Gas Estimator */}
                    <div className="bg-gray-700 rounded-2xl p-4 mb-6">
                      <div className="text-white text-lg font-semibold mb-3">Mint NFT</div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">Gas Cost:</span>
                        <span className="text-white">0.00032 ETH</span>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-400">USDC Cost:</span>
                        <span className="text-primary-400 font-semibold">$0.95</span>
                      </div>
                      <button className="w-full bg-primary-500 text-white py-3 rounded-lg font-semibold">
                        Confirm & Pay
                      </button>
                    </div>

                    {/* Bottom Navigation */}
                    <div className="flex justify-around mt-auto">
                      <div className="w-6 h-6 bg-primary-500 rounded"></div>
                      <div className="w-6 h-6 bg-gray-600 rounded"></div>
                      <div className="w-6 h-6 bg-gray-600 rounded"></div>
                      <div className="w-6 h-6 bg-gray-600 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-10 -left-10 w-20 h-20 bg-primary-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why Choose <span className="gradient-text">Feez</span>?
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Simplify your Web3 experience with gasless transactions powered by Circle Paymaster
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Zap className="w-8 h-8" />}
            title="Instant Payments"
            description="Pay gas fees instantly in USDC without holding native tokens"
          />
          <FeatureCard
            icon={<Globe className="w-8 h-8" />}
            title="Multi-Chain"
            description="Works across Base, Ethereum, Polygon, Arbitrum, Optimism, and more"
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8" />}
            title="Secure & Trusted"
            description="Built on Circle's enterprise-grade infrastructure with ERC-4337"
          />
          <FeatureCard
            icon={<TrendingUp className="w-8 h-8" />}
            title="Cost Efficient"
            description="Transparent pricing with real-time gas estimates in USDC"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">FEEZ</span>
            </div>
            <div className="text-gray-400">
              © 2025 Feez. Built with Circle Paymaster & ERC-4337
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="glass rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2">
      <div className="text-primary-500 mb-4 flex justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}
