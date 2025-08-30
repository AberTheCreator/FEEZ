'use client'

import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { 
  LayoutDashboard, 
  History, 
  TrendingUp, 
  Settings,
  Zap,
  LogOut
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isConnected } = useAccount()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isConnected) {
      router.push('/')
    }
  }, [isConnected, router])

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Please connect your wallet</div>
          <ConnectButton />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <Link href="/dashboard" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">FEEZ</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6">
          <div className="space-y-2">
            <NavItem
              href="/dashboard"
              icon={<LayoutDashboard className="w-5 h-5" />}
              label="Dashboard"
              active={pathname === '/dashboard'}
            />
            <NavItem
              href="/dashboard/history"
              icon={<History className="w-5 h-5" />}
              label="History"
              active={pathname === '/dashboard/history'}
            />
            <NavItem
              href="/dashboard/analytics"
              icon={<TrendingUp className="w-5 h-5" />}
              label="Analytics"
              active={pathname === '/dashboard/analytics'}
            />
            <NavItem
              href="/dashboard/settings"
              icon={<Settings className="w-5 h-5" />}
              label="Settings"
              active={pathname === '/dashboard/settings'}
            />
          </div>
        </nav>

        {/* User Info & Disconnect */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <ConnectButton 
              showBalance={false} 
              chainStatus="icon"
              accountStatus="address"
            />
            <button
              onClick={() => router.push('/')}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Home"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  )
}

function NavItem({ 
  href, 
  icon, 
  label, 
  active 
}: { 
  href: string
  icon: React.ReactNode
  label: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
        active
          ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
          : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700"
      )}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  )
}
