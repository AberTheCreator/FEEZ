'use client';

import { useState } from 'react';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const SUPPORTED_CHAINS = [
  {
    id: 8453,
    name: 'Base',
    symbol: 'ETH',
    color: '#0052FF',
    icon: '⚡',
  },
  {
    id: 1,
    name: 'Ethereum',
    symbol: 'ETH',
    color: '#627EEA',
    icon: 'Ξ',
  },
  {
    id: 137,
    name: 'Polygon',
    symbol: 'MATIC',
    color: '#8247E5',
    icon: '🔷',
  },
  {
    id: 42161,
    name: 'Arbitrum',
    symbol: 'ETH',
    color: '#28A0F0',
    icon: '🔵',
  },
  {
    id: 10,
    name: 'Optimism',
    symbol: 'ETH',
    color: '#FF0420',
    icon: '🔴',
  },
  {
    id: 43114,
    name: 'Avalanche',
    symbol: 'AVAX',
    color: '#E84142',
    icon: '🏔️',
  },
  {
    id: 1301,
    name: 'Unichain',
    symbol: 'ETH',
    color: '#FF007A',
    icon: '🦄',
  },
];

interface ChainSelectorProps {
  onChainChange?: (chainId: number) => void;
}

export default function ChainSelector({ onChainChange }: ChainSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const currentChain = SUPPORTED_CHAINS.find(c => c.id === chain?.id) || SUPPORTED_CHAINS[0];

  const handleChainSelect = (chainId: number) => {
    if (switchNetwork) {
      switchNetwork(chainId);
    }
    onChainChange?.(chainId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="feez-card w-full p-4 flex items-center justify-between hover:bg-white/10 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="text-xl">{currentChain.icon}</div>
          <div className="text-left">
            <div className="text-white font-semibold">{currentChain.name}</div>
            <div className="text-gray-400 text-sm">{currentChain.symbol}</div>
          </div>
        </div>
        <ChevronDownIcon 
          className={`h-5 w-5 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
         
          <div className="absolute top-full left-0 right-0 mt-2 z-20 feez-card max-h-80 overflow-y-auto">
            {SUPPORTED_CHAINS.map((chainOption) => (
              <button
                key={chainOption.id}
                onClick={() => handleChainSelect(chainOption.id)}
                className={`w-full p-4 flex items-center space-x-3 hover:bg-white/10 transition-colors border-l-2 ${
                  chainOption.id === currentChain.id
                    ? 'border-green-400 bg-green-400/10'
                    : 'border-transparent'
                }`}
              >
                <div className="text-xl">{chainOption.icon}</div>
                <div className="text-left">
                  <div className="text-white font-semibold">{chainOption.name}</div>
                  <div className="text-gray-400 text-sm">{chainOption.symbol}</div>
                </div>
                {chainOption.id === currentChain.id && (
                  <div className="ml-auto text-green-400 text-sm">✓</div>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
