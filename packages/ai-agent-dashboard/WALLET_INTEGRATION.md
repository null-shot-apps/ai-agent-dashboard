# 🦊 MetaMask Wallet Integration

## Overview
Your crypto portfolio dashboard now supports **MetaMask wallet connection** for automatic portfolio import!

## Features Added

### 1. **MetaMask Connection**
- One-click wallet connection via MetaMask browser extension
- Automatic detection of installed MetaMask
- Support for multiple blockchain networks:
  - Ethereum Mainnet
  - Polygon
  - Binance Smart Chain (BSC)
  - Arbitrum

### 2. **Automatic Portfolio Import**
- When you connect your wallet, the dashboard automatically:
  - Detects your wallet address
  - Fetches your ETH balance
  - Imports top cryptocurrency holdings (demo mode)
  - Displays your connected wallet info

### 3. **Wallet Display**
- Shows shortened wallet address (e.g., 0x1234...5678)
- Displays your ETH balance
- Shows which network you're connected to
- Easy disconnect button

## How to Use

### Step 1: Install MetaMask
If you don't have MetaMask installed:
1. Visit https://metamask.io/download/
2. Install the browser extension
3. Create or import a wallet

### Step 2: Connect Your Wallet
1. Open the crypto portfolio dashboard
2. Look for the "Connect Your Wallet" section at the top
3. Click the "🦊 Connect MetaMask" button
4. Approve the connection in the MetaMask popup

### Step 3: View Your Portfolio
- Your wallet address and balance will appear
- Your holdings will be automatically imported
- All prices update in real-time

### Step 4: Disconnect (Optional)
- Click the "Disconnect" button to remove wallet connection
- You can reconnect anytime

## Technical Details

### Libraries Used
- **ethers.js v6** - For blockchain interactions
- **wagmi** - React hooks for Ethereum
- **viem** - TypeScript Ethereum library
- **@rainbow-me/rainbowkit** - Wallet connection UI (optional)
- **connectkit** - Alternative wallet connection (optional)

### Supported Networks
```typescript
- Ethereum (Chain ID: 1)
- Polygon (Chain ID: 137)
- BSC (Chain ID: 56)
- Arbitrum (Chain ID: 42161)
```

### API Integration
Currently using **CoinGecko API** for:
- Real-time cryptocurrency prices
- Token metadata (names, symbols, images)
- Market data

### Future Enhancements
In production, you would integrate:
- **Moralis API** - For real wallet token balances
- **Alchemy API** - For blockchain data
- **The Graph** - For DeFi protocol data
- **Multi-wallet support** - WalletConnect, Coinbase Wallet, etc.

## Security Notes

⚠️ **Important Security Information:**
- The dashboard **NEVER** asks for your private keys or seed phrase
- Wallet connection is read-only (view balances only)
- No transactions can be initiated without your explicit approval
- Always verify you're on the correct website before connecting

## Demo Mode

Currently, the wallet integration runs in **demo mode**:
- Simulates token holdings for testing
- Uses mock data for portfolio values
- Real wallet connection works, but token detection is simplified

To enable **production mode**, you need to:
1. Sign up for Moralis or Alchemy API
2. Add API keys to environment variables
3. Update the `fetchWalletTokens` function to use real APIs

## Troubleshooting

### "MetaMask is not installed"
- Install MetaMask from https://metamask.io/download/
- Refresh the page after installation

### "Connection failed"
- Make sure MetaMask is unlocked
- Check that you approved the connection request
- Try refreshing the page and reconnecting

### "Wrong network"
- Switch to a supported network in MetaMask
- Supported: Ethereum, Polygon, BSC, Arbitrum

### "No tokens showing"
- Demo mode shows simulated holdings
- For real balances, production API integration is needed

## Code Structure

```
src/
├── components/
│   ├── WalletConnect.tsx      # Main wallet connection component
│   └── WalletProvider.tsx     # Wagmi provider wrapper (optional)
└── app/
    └── page.tsx               # Main dashboard with wallet integration
```

## Environment Variables (Optional)

For production, add to `.env.local`:
```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_MORALIS_API_KEY=your_moralis_key
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
```

## Support

Need help? Check:
- MetaMask Documentation: https://docs.metamask.io/
- Ethers.js Docs: https://docs.ethers.org/
- Wagmi Docs: https://wagmi.sh/

---

**Built with ❤️ for easy crypto portfolio tracking!**

