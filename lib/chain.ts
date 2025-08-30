import { base, baseSepolia, mainnet, polygon, arbitrum, optimism, avalanche } from 'wagmi/chains'

export const unichain = {
  id: 1301,
  name: 'Unichain Sepolia',
  network: 'unichain-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['https://sepolia.unichain.org'] },
    public: { http: ['https://sepolia.unichain.org'] },
  },
  blockExplorers: {
    default: {
      name: 'Unichain Sepolia Explorer',
      url: 'https://sepolia.uniscan.xyz',
    },
  },
  testnet: true,
} as const

export const SUPPORTED_CHAINS = [
  baseSepolia, // Primary testnet for development
  base,
  mainnet,
  polygon,
  arbitrum,
  optimism,
  avalanche,
  unichain,
]

export const CHAIN_CONFIG = {
  [baseSepolia.id]: {
    name: 'Base Sepolia',
    shortName: 'Base',
    nativeToken: 'ETH',
    color: '#0052FF',
    logo: '/chains/base.svg',
    isTestnet: true,
  },
  [base.id]: {
    name: 'Base',
    shortName: 'Base',
    nativeToken: 'ETH',
    color: '#0052FF',
    logo: '/chains/base.svg',
    isTestnet: false,
  },
  [mainnet.id]: {
    name: 'Ethereum',
    shortName: 'Ethereum',
    nativeToken: 'ETH',
    color: '#627EEA',
    logo: '/chains/ethereum.svg',
    isTestnet: false,
  },
  [polygon.id]: {
    name: 'Polygon',
    shortName: 'Polygon',
    nativeToken: 'MATIC',
    color: '#8247E5',
    logo: '/chains/polygon.svg',
    isTestnet: false,
  },
  [arbitrum.id]: {
    name: 'Arbitrum One',
    shortName: 'Arbitrum',
    nativeToken: 'ETH',
    color: '#28A0F0',
    logo: '/chains/arbitrum.svg',
    isTestnet: false,
  },
  [optimism.id]: {
    name: 'Optimism',
    shortName: 'Optimism',
    nativeToken: 'ETH',
    color: '#FF0420',
    logo: '/chains/optimism.svg',
    isTestnet: false,
  },
  [avalanche.id]: {
    name: 'Avalanche',
    shortName: 'Avalanche',
    nativeToken: 'AVAX',
    color: '#E84142',
    logo: '/chains/avalanche.svg',
    isTestnet: false,
  },
  [unichain.id]: {
    name: 'Unichain Sepolia',
    shortName: 'Unichain',
    nativeToken: 'ETH',
    color: '#FF007A',
    logo: '/chains/unichain.svg',
    isTestnet: true,
  },
}

export const PAYMASTER_SUPPORTED_CHAINS = [
  baseSepolia.id,
  base.id,
  mainnet.id,
  polygon.id,
  arbitrum.id,
  optimism.id,
  avalanche.id,
]

export function getChainConfig(chainId: number) {
  return CHAIN_CONFIG[chainId] || {
    name: `Chain ${chainId}`,
    shortName: `Chain ${chainId}`,
    nativeToken: 'ETH',
    color: '#666666',
    logo: '/chains/unknown.svg',
    isTestnet: false,
  }
}

export function isPaymasterSupported(chainId: number): boolean {
  return PAYMASTER_SUPPORTED_CHAINS.includes(chainId)
}
