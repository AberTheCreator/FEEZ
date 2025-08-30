export interface Chain {
  id: number;
  name: string;
  symbol: string;
  rpcUrl: string;
  blockExplorer: string;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  txHash: string;
  chain: string;
  chainId: number;
  action: string;
  gasFeeUSDC: number;
  gasFeeNative: number;
  nativeSymbol: string;
  timestamp: Date;
  status: 'pending' | 'confirmed' | 'failed';
  userAddress: string;
}

export interface GasEstimate {
  nativeGas: string;
  nativeSymbol: string;
  usdcEquivalent: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  gasLimit: string;
}

export interface UserOperation {
  sender: string;
  nonce: string;
  initCode: string;
  callData: string;
  callGasLimit: string;
  verificationGasLimit: string;
  preVerificationGas: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  paymasterAndData: string;
  signature: string;
}

export interface CirclePaymasterRequest {
  userOperation: UserOperation;
  chainId: number;
  sponsor?: boolean;
}

export interface CirclePaymasterResponse {
  userOperationHash: string;
  paymasterAndData: string;
  preVerificationGas: string;
  verificationGasLimit: string;
  callGasLimit: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
}

export interface WalletInfo {
  address: string;
  usdcBalance: string;
  nativeBalance: string;
  chainId: number;
}

export interface AnalyticsData {
  totalSpentUSDC: number;
  totalTransactions: number;
  largestGasPayment: number;
  thisWeekSpent: number;
  chartData: {
    date: string;
    amount: number;
  }[];
  chainUsage: {
    chain: string;
    count: number;
    percentage: number;
  }[];
}

export interface EstimateRequest {
  chainId: number;
  action: 'mint' | 'send' | 'swap';
  recipient?: string;
  amount?: string;
  userAddress: string;
}

export interface ExecuteRequest extends EstimateRequest {
  sponsor: boolean;
  gasEstimate: GasEstimate;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export type ActionType = 'mint' | 'send' | 'swap';

export interface Settings {
  spendingLimit: number;
  requirePasskeyAmount: number;
  autoSponsor: boolean;
  defaultChain: number;
}

export interface NFTContractInfo {
  address: string;
  chainId: number;
  name: string;
  symbol: string;
}
