'use client';

import { useAccount, useBalance } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';

const USDC_ADDRESSES = {
  1: '0xA0b86a33E6411c0e8dd57302A0e3C0a7C0e86d37', 
  137: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', 
  42161: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
  10: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607', 
  43114: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', 
  8453: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', 
  84532: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', 
};

export default function WalletInfo() {
  const { address, isConnected, chain } = useAccount();
  const [usdcBalance, setUsdcBalance] = useState<string>('0.00');

  const { data: nativeBalance } = useBalance({
    address: address,
  });

  const { data: usdcBalanceData } = useBalance({
    address: address,
    token: USDC_ADDRESSES[chain?.id as keyof typeof USDC_ADDRESSES],
    enabled: isConnected && !!chain?.id && !!USDC_ADDRESSES[chain.id as keyof typeof USDC_ADDRESSES],
  });

  useEffect(() => {
    if (usdcBalanceData) {
      setUsdcBalance(parseFloat(usdcBalanceData.formatted).toFixed(2));
    }
  }, [usdcBalanceData]);

  if (!isConnected) {
    return (
      <div className="feez-card p-6">
        <div className="text-center">
          <div className="text-lg font-semibold text-white mb-4">
            Connect Your Wallet
          </div>
          <p className="text-gray-400 mb-6">
            Connect your wallet to start paying gas fees in USDC
          </p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="feez-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Wallet Info</h3>
        <ConnectButton showBalance={false} />
      </div>
      
      <div className="space-y-4">
        
        <div>
          <label className="text-sm text-gray-400 block mb-1">Address</label>
          <div className="flex items-center space-x-2">
            <span className="text-white font-mono text-sm">
              {address ? truncateAddress(address) : ''}
            </span>
            <button
              onClick={() => navigator.clipboard.writeText(address || '')}
              className="text-green-400 hover:text-green-300 text-xs p-1 rounded"
              title="Copy address"
            >
              📋
            </button>
          </div>
        </div>

        
        <div>
          <label className="text-sm text-gray-400 block mb-1">Network</label>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span className="text-white text-sm">{chain?.name}</span>
          </div>
        </div>

       
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">USDC Balance</div>
            <div className="text-xl font-bold text-green-400">
              ${usdcBalance}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">
              {nativeBalance?.symbol} Balance
            </div>
            <div className="text-xl font-bold text-white">
              {nativeBalance ? parseFloat(nativeBalance.formatted).toFixed(4) : '0.0000'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
