import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAddress(address: string, length = 6): string {
  if (!address) return ''
  return `${address.slice(0, length)}...${address.slice(-4)}`
}

export function formatUSDC(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(num)
}

export function formatNativeToken(amount: number | string, symbol = 'ETH'): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return `${num.toFixed(8)} ${symbol}`
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  
  return formatDate(d)
}

export function getExplorerUrl(chainId: number, txHash: string): string {
  const explorers: Record<number, string> = {
    1: 'https://etherscan.io',
    137: 'https://polygonscan.com',
    42161: 'https://arbiscan.io',
    10: 'https://optimistic.etherscan.io',
    43114: 'https://snowtrace.io',
    8453: 'https://basescan.org',
    84532: 'https://sepolia.basescan.org',
    1301: 'https://sepolia.uniscan.xyz',
  }

  const baseUrl = explorers[chainId] || `https://etherscan.io`
  return `${baseUrl}/tx/${txHash}`
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function generateRandomTokenURI(tokenId: number): string {
  const traits = [
    'Cosmic', 'Digital', 'Neon', 'Crystal', 'Ethereal', 'Quantum', 
    'Cyber', 'Holographic', 'Prismatic', 'Luminous'
  ]
  const types = [
    'Artifact', 'Gem', 'Orb', 'Shard', 'Token', 'Essence', 
    'Core', 'Fragment', 'Catalyst', 'Matrix'
  ]
  
  const trait = traits[Math.floor(Math.random() * traits.length)]
  const type = types[Math.floor(Math.random() * types.length)]
  
  return JSON.stringify({
    name: `${trait} ${type} #${tokenId}`,
    description: `A unique ${trait.toLowerCase()} ${type.toLowerCase()} minted through Feez`,
    image: `https://api.feez.app/images/${tokenId}.png`,
    attributes: [
      { trait_type: "Type", value: type },
      { trait_type: "Rarity", value: trait },
      { trait_type: "Minted Via", value: "Feez" }
    ]
  })
}
