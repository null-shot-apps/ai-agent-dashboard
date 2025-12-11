'use client';

import { useState } from 'react';

interface Holding {
  id: string;
  coinId: string;
  name: string;
  symbol: string;
  amount: number;
  currentPrice: number;
  image: string;
}

interface Recommendation {
  id: string;
  protocol: string;
  type: 'staking' | 'yield-farming' | 'liquidity';
  apy: number;
  risk: 'Low' | 'Medium' | 'High';
  tvl: number;
  description: string;
  icon: string;
}

export default function CryptoPortfolio() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [dismissedRecommendations, setDismissedRecommendations] = useState<string[]>([]);

  // Mock AI recommendations (in production, this would come from an API)
  const recommendations: Recommendation[] = [
    {
      id: '1',
      protocol: 'Aave',
      type: 'staking',
      apy: 8.5,
      risk: 'Low',
      tvl: 5200000000,
      description: 'Stake USDC for stable returns with minimal risk',
      icon: '🏦'
    },
    {
      id: '2',
      protocol: 'Uniswap V3',
      type: 'liquidity',
      apy: 24.3,
      risk: 'Medium',
      tvl: 3800000000,
      description: 'Provide liquidity to ETH/USDC pool',
      icon: '🦄'
    },
    {
      id: '3',
      protocol: 'Compound',
      type: 'yield-farming',
      apy: 12.7,
      risk: 'Low',
      tvl: 2900000000,
      description: 'Earn COMP rewards by supplying DAI',
      icon: '🌾'
    },
    {
      id: '4',
      protocol: 'Curve Finance',
      type: 'liquidity',
      apy: 18.9,
      risk: 'Medium',
      tvl: 4100000000,
      description: 'Optimize stablecoin yields with low slippage',
      icon: '📈'
    },
    {
      id: '5',
      protocol: 'Lido',
      type: 'staking',
      apy: 4.2,
      risk: 'Low',
      tvl: 9500000000,
      description: 'Liquid staking for Ethereum 2.0',
      icon: '⚡'
    },
    {
      id: '6',
      protocol: 'Yearn Finance',
      type: 'yield-farming',
      apy: 32.1,
      risk: 'High',
      tvl: 1200000000,
      description: 'Automated yield optimization strategies',
      icon: '🎯'
    }
  ].filter(rec => !dismissedRecommendations.includes(rec.id));

  // Search cryptocurrencies
  const searchCrypto = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/search?query=${query}`);
      const data = await response.json();
      setSearchResults(data.coins.slice(0, 10));
    } catch (error) {
      console.error('Search error:', error);
    }
    setIsSearching(false);
  };

  // Add holding
  const addHolding = async () => {
    if (!selectedCoin || !amount || parseFloat(amount) <= 0) return;

    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${selectedCoin.id}&vs_currencies=usd`);
      const priceData = await response.json();
      const currentPrice = priceData[selectedCoin.id]?.usd || 0;

      const newHolding: Holding = {
        id: Date.now().toString(),
        coinId: selectedCoin.id,
        name: selectedCoin.name,
        symbol: selectedCoin.symbol.toUpperCase(),
        amount: parseFloat(amount),
        currentPrice,
        image: selectedCoin.large || selectedCoin.thumb,
      };

      setHoldings([...holdings, newHolding]);
      setShowAddModal(false);
      setSelectedCoin(null);
      setAmount('');
      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      console.error('Error adding holding:', error);
    }
  };

  // Remove holding
  const removeHolding = (id: string) => {
    setHoldings(holdings.filter(h => h.id !== id));
  };

  // Calculate total portfolio value
  const totalValue = holdings.reduce((sum, h) => sum + (h.amount * h.currentPrice), 0);

  // Dismiss recommendation
  const dismissRecommendation = (id: string) => {
    setDismissedRecommendations([...dismissedRecommendations, id]);
  };

  // Get risk color
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-400 bg-green-400/10';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'High': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  // Get type badge
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'staking': return '🔒 Staking';
      case 'yield-farming': return '🌾 Yield Farming';
      case 'liquidity': return '💧 Liquidity';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Crypto Portfolio</h1>
          <p className="text-gray-300">Track your cryptocurrency holdings</p>
        </div>

        {/* Total Value Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <p className="text-gray-300 text-sm mb-2">Total Portfolio Value</p>
          <p className="text-5xl font-bold">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>

        {/* Add Token Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-6 py-3 rounded-xl font-semibold transition-all"
        >
          + Add Token
        </button>

        {/* Holdings List */}
        <div className="space-y-4 mb-12">
          {holdings.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-12 text-center border border-white/10">
              <p className="text-gray-400 text-lg">No holdings yet. Add your first token to get started!</p>
            </div>
          ) : (
            holdings.map((holding) => (
              <div key={holding.id} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={holding.image} alt={holding.name} className="w-12 h-12 rounded-full" />
                  <div>
                    <h3 className="text-xl font-semibold">{holding.name}</h3>
                    <p className="text-gray-400">{holding.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">${(holding.amount * holding.currentPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <p className="text-gray-400">{holding.amount} {holding.symbol} @ ${holding.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</p>
                </div>
                <button
                  onClick={() => removeHolding(holding.id)}
                  className="ml-4 text-red-400 hover:text-red-300 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        {/* AI Recommendations Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-3xl">🤖</div>
            <div>
              <h2 className="text-3xl font-bold">AI Investment Recommendations</h2>
              <p className="text-gray-300">Personalized DeFi opportunities based on market conditions</p>
            </div>
          </div>

          {recommendations.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-12 text-center border border-white/10">
              <p className="text-gray-400 text-lg">No recommendations available at the moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations.map((rec) => (
                <div key={rec.id} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-purple-500/50 transition-all">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{rec.icon}</div>
                      <div>
                        <h3 className="text-xl font-bold">{rec.protocol}</h3>
                        <p className="text-sm text-gray-400">{getTypeBadge(rec.type)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => dismissRecommendation(rec.id)}
                      className="text-gray-400 hover:text-gray-300 transition-colors"
                      title="Dismiss"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 mb-4">{rec.description}</p>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-white/5 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1">APY</p>
                      <p className="text-2xl font-bold text-green-400">{rec.apy}%</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1">Risk</p>
                      <span className={`inline-block px-2 py-1 rounded-lg text-sm font-semibold ${getRiskColor(rec.risk)}`}>
                        {rec.risk}
                      </span>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1">TVL</p>
                      <p className="text-lg font-bold">${(rec.tvl / 1000000000).toFixed(1)}B</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-4 py-2 rounded-xl font-semibold transition-all">
                      Invest Now
                    </button>
                    <button className="flex-1 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl font-semibold transition-colors">
                      Learn More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Token Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-white/20">
              <h2 className="text-2xl font-bold mb-4">Add Token</h2>
              
              {/* Search Input */}
              <input
                type="text"
                placeholder="Search cryptocurrency..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  searchCrypto(e.target.value);
                }}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 mb-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              {/* Search Results */}
              {isSearching && <p className="text-gray-400 mb-4">Searching...</p>}
              {searchResults.length > 0 && !selectedCoin && (
                <div className="max-h-60 overflow-y-auto mb-4 space-y-2">
                  {searchResults.map((coin) => (
                    <button
                      key={coin.id}
                      onClick={() => {
                        setSelectedCoin(coin);
                        setSearchResults([]);
                      }}
                      className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                    >
                      <img src={coin.thumb} alt={coin.name} className="w-8 h-8 rounded-full" />
                      <div className="text-left">
                        <p className="font-semibold">{coin.name}</p>
                        <p className="text-sm text-gray-400">{coin.symbol.toUpperCase()}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Selected Coin & Amount Input */}
              {selectedCoin && (
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-4 p-3 bg-white/5 rounded-xl">
                    <img src={selectedCoin.large || selectedCoin.thumb} alt={selectedCoin.name} className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="font-semibold">{selectedCoin.name}</p>
                      <p className="text-sm text-gray-400">{selectedCoin.symbol.toUpperCase()}</p>
                    </div>
                  </div>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    step="any"
                    min="0"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedCoin(null);
                    setAmount('');
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  className="flex-1 bg-white/10 hover:bg-white/20 px-4 py-3 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addHolding}
                  disabled={!selectedCoin || !amount || parseFloat(amount) <= 0}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 rounded-xl font-semibold transition-all"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}





