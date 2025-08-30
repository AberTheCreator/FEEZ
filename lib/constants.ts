import { Chain } from '@/types';

export const SUPPORTED_CHAINS: Chain[] = [
  {
    id: 8453,
    name: 'Base',
    symbol: 'ETH',
    rpcUrl: 'https://mainnet.base.org',
    blockExplorer: 'https://basescan.org',
    icon: '⚡',
    color: '#0052FF',
  },
  {
    id: 1,
    name: 'Ethereum',
    symbol: 'ETH',
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/',
    blockExplorer: 'https://etherscan.io',
    icon: 'Ξ',
    color: '#627EEA',
  },
  {
    id: 137,
    name: 'Polygon',
    symbol: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
    icon: '🔷',
    color: '#8247E5',
  },
  {
    id: 42161,
    name: 'Arbitrum',
    symbol: 'ETH',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    blockExplorer: 'https://arbiscan.io',
    icon: '🔵',
    color: '#28A0F0',
  },
  {
    id: 10,
    name: 'Optimism',
    symbol: 'ETH',
    rpcUrl: 'https://mainnet.optimism.io',
    blockExplorer: 'https://optimistic.etherscan.io',
    icon: '🔴',
    color: '#FF0420',
  },
  {
    id: 43114,
    name: 'Avalanche',
    symbol: 'AVAX',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    blockExplorer: 'https://snowtrace.io',
    icon: '🏔️',
    color: '#E84142',
  },
  {
    id: 1301,
    name: 'Unichain',
    symbol: 'ETH',
    rpcUrl: 'https://sepolia.unichain.org',
    blockExplorer: 'https://sepolia-explorer.unichain.org',
    icon: '🦄',
    color: '#FF007A',
  },
  {
    id: 84532,
    name: 'Base Sepolia',
    symbol: 'ETH',
    rpcUrl: 'https://sepolia.base.org',
    blockExplorer: 'https://sepolia.basescan.org',
    icon: '⚡',
    color: '#0052FF',
  },
];

export const USDC_ADDRESSES: Record<number, string> = {
  1: '0xA0b86a33E6411c0e8dd57302A0e3C0a7C0e86d37', 
  137: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', 
  42161: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', 
  10: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607', 
  43114: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', 
  8453: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', 
  84532: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', 
  1301: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
};

export const NFT_CONTRACT_ADDRESSES: Record<number, string> = {
  84532: '0x...', // Base Sepolia - Replace with actual deployed address
  8453: '0x...', // Base Mainnet - Replace with actual deployed address
};

export const CIRCLE_PAYMASTER_URL = 'https://api.circle.com/v1/paymaster';

export const DEFAULT_SETTINGS = {
  spendingLimit: 5, // $5 daily limit
  requirePasskeyAmount: 5, // Require passkey if gas > $5
  autoSponsor: false,
  defaultChain: 8453, // Base
};

export const ACTION_TYPES = [
  { value: 'mint', label: 'Mint NFT', description: 'Mint a Feez NFT' },
  { value: 'send', label: 'Send USDC', description: 'Transfer USDC to another address' },
  { value: 'swap', label: 'Swap Tokens', description: 'Exchange tokens via DEX' },
] as const;

export const GAS_ESTIMATION_BUFFER = 1.2;
export const TRANSACTION_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  FAILED: 'failed',
} as const;

export const CHART_COLORS = [
  '#4ade80',
  '#22c55e',
  '#16a34a', 
  '#15803d', 
  '#166534', 
  '#14532d', 
  '#86efac', 
  '#bbf7d0', 
];

export const FEATURE_FLAGS = {
  ENABLE_ANALYTICS: true,
  ENABLE_SETTINGS: true,
  ENABLE_SWAP: false, 
  ENABLE_MULTI_CHAIN: true,
};

export const API_ENDPOINTS = {
  ESTIMATE: '/api/estimate',
  EXECUTE: '/api/execute',
  TRANSACTIONS: '/api/transactions',
  ANALYTICS: '/api/analytics',
};

export const STORAGE_KEYS = {
  SETTINGS: 'feez_settings',
  TRANSACTIONS: 'feez_transactions',
  WALLET_CONNECTED: 'feez_wallet_connected',
};
