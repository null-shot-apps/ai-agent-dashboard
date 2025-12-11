'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface WalletConnectProps {
  onWalletConnected?: (address: string) => void;
  onBalancesFetched?: (tokens: any[]) => void;
}

export function WalletConnect({ onWalletConnected, onBalancesFetched }: WalletConnectProps) {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    checkIfWalletIsConnected();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const accounts = await provider.listAccounts();
        
        if (accounts.length > 0) {
          const signer = await provider.getSigner();
          const userAddress = await signer.getAddress();
          setAddress(userAddress);
          
          const balance = await provider.getBalance(userAddress);
          setBalance(ethers.formatEther(balance));
          
          const network = await provider.getNetwork();
          setChainId(Number(network.chainId));
          
          if (onWalletConnected) {
            onWalletConnected(userAddress);
          }
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const connectMetaMask = async () => {
    try {
      setIsConnecting(true);
      
      if (typeof window === 'undefined' || !(window as any).ethereum) {
        alert('MetaMask is not installed. Please install MetaMask to continue.');
        window.open('https://metamask.io/download/', '_blank');
        return;
      }

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      await provider.send('eth_requestAccounts', []);
      
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      setAddress(userAddress);
      
      const balance = await provider.getBalance(userAddress);
      setBalance(ethers.formatEther(balance));
      
      const network = await provider.getNetwork();
      setChainId(Number(network.chainId));
      
      if (onWalletConnected) {
        onWalletConnected(userAddress);
      }
      
      // Fetch token balances
      await fetchWalletTokens(userAddress);
      
    } catch (error: any) {
      console.error('Error connecting to MetaMask:', error);
      alert('Failed to connect wallet: ' + error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const fetchWalletTokens = async (_walletAddress: string) => {
    try {
      // In production, you would use Moralis, Alchemy, or similar service
      // For now, we'll fetch top tokens and simulate holdings
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false`
      );
      const data = await response.json() as any[];
      
      if (onBalancesFetched) {
        // Simulate some holdings for demo purposes
        const simulatedHoldings = data.slice(0, 5).map((coin: any) => ({
          ...coin,
          amount: Math.random() * 10, // Random amount for demo
        }));
        onBalancesFetched(simulatedHoldings);
      }
    } catch (error) {
      console.error('Error fetching wallet tokens:', error);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setBalance(null);
    setChainId(null);
  };

  const getChainName = (chainId: number) => {
    const chains: { [key: number]: string } = {
      1: 'Ethereum',
      137: 'Polygon',
      56: 'BSC',
      42161: 'Arbitrum',
    };
    return chains[chainId] || `Chain ${chainId}`;
  };

  if (address) {
    return (
      <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-sm border border-green-500/20 rounded-xl p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm text-gray-400">Connected Wallet</p>
            <p className="text-white font-mono text-sm">
              {address.slice(0, 6)}...{address.slice(-4)}
            </p>
            {balance && (
              <p className="text-green-400 text-sm mt-1">
                {parseFloat(balance).toFixed(4)} ETH
              </p>
            )}
            {chainId && (
              <p className="text-blue-400 text-xs mt-1">
                {getChainName(chainId)}
              </p>
            )}
          </div>
          <button
            onClick={disconnect}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all"
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-white mb-2">🦊 Connect Your Wallet</h3>
        <p className="text-gray-400 text-sm">
          Connect MetaMask to automatically import your crypto holdings
        </p>
      </div>
      
      <button
        onClick={connectMetaMask}
        disabled={isConnecting}
        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white rounded-lg transition-all transform hover:scale-105 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isConnecting ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Connecting...
          </>
        ) : (
          <>
            <span className="text-2xl">🦊</span>
            Connect MetaMask
          </>
        )}
      </button>

      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-xs text-blue-300">
          💡 <strong>Supported Networks:</strong> Ethereum, Polygon, BSC, Arbitrum
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Don&apos;t have MetaMask? <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">Install it here</a>
        </p>
      </div>
    </div>
  );
}

