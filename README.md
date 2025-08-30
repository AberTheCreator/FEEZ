# Feez - Pay Gas Fees in USDC

A decentralized application that allows users to pay gas fees in USDC across multiple EVM chains using Circle's Paymaster (ERC-4337).

## 🚀 Features

- **🔐 Wallet Integration**: Connect using RainbowKit with support for major wallets
- **⛽ USDC Gas Payments**: Pay gas fees in USDC instead of native tokens
- **🌐 Multi-Chain Support**: Base, Ethereum, Polygon, Arbitrum, Optimism, Avalanche, Unichain
- **📊 Analytics Dashboard**: Track gas spending with charts and insights
- **📜 Transaction History**: Complete record of all USDC gas payments
- **🎨 Modern UI**: Dark theme with Feez green accents
- **🔧 Settings**: Customizable spending limits and preferences

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS
- **Wallet**: RainbowKit, wagmi
- **Charts**: Recharts
- **Database**: Prisma + SQLite
- **Smart Contracts**: Solidity, Hardhat
- **API Integration**: Circle Paymaster API
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask or compatible wallet
- Circle API key
- Alchemy API key

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/feez-dapp.git
   cd feez-dapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install contract dependencies**
   ```bash
   cd contracts
   npm install
   cd ..
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```

5. **Configure environment variables**
   ```env
   # Circle API
   CIRCLE_API_KEY=your_circle_api_key

   # Wallet for contract deployment
   WALLET_PRIVATE_KEY=your_wallet_private_key

   # Alchemy RPC
   NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key

   # Database
   DATABASE_URL="file:./dev.db"
   ```

## 🗄 Database Setup

1. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

2. **Create database tables**
   ```bash
   npx prisma db push
   ```

3. **View database (optional)**
   ```bash
   npx prisma studio
   ```

## 📄 Smart Contract Deployment

1. **Navigate to contracts directory**
   ```bash
   cd contracts
   ```

2. **Compile contracts**
   ```bash
   npx hardhat compile
   ```

3. **Deploy to Base Sepolia**
   ```bash
   npx hardhat run scripts/deploy.js --network baseSepolia
   ```

4. **Update contract address**
   Update the deployed contract address in `lib/constants.ts`:
   ```typescript
   export const NFT_CONTRACT_ADDRESSES: Record<number, string> = {
     84532: '0xYourDeployedContractAddress', // Base Sepolia
   };
   ```

## 🚀 Development

1. **Start development server**
   ```bash
   npm run dev
   ```

2. **Open application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
feez-dapp/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Landing page
├── components/            # React components
│   ├── Sidebar.tsx       # Navigation sidebar
│   ├── WalletInfo.tsx    # Wallet information
│   ├── ChainSelector.tsx # Chain selection
│   └── GasAnalytics.tsx  # Analytics charts
├── lib/                   # Utilities and configurations
│   ├── prisma.ts         # Database client
│   ├── wagmi.ts          # Wallet configuration
│   ├── circle.ts         # Circle API integration
│   └── constants.ts      # App constants
├── pages/api/            # API routes
│   ├── estimate.ts       # Gas estimation
│   ├── execute.ts        # Transaction execution
│   └── analytics.ts      # Analytics data
├── contracts/            # Smart contracts
│   ├── FeezNFT.sol      # ERC-721 NFT contract
│   ├── hardhat.config.js # Hardhat configuration
│   └── scripts/deploy.js # Deployment script
├── prisma/               # Database schema
│   └── schema.prisma     # Prisma schema
└── types/                # TypeScript definitions
    └── index.ts          # Type definitions
```

## 🔗 API Endpoints

### `/api/estimate`
Estimate gas fees for a transaction
```typescript
POST /api/estimate
{
  "chainId": 8453,
  "action": "mint",
  "userAddress": "0x..."
}
```

### `/api/execute`
Execute transaction with Circle Paymaster
```typescript
POST /api/execute
{
  "chainId": 8453,
  "action": "mint",
  "userAddress": "0x...",
  "sponsor": false,
  "gasEstimate": {...}
}
```

### `/api/analytics`
Get gas spending analytics
```typescript
GET /api/analytics?timeframe=7d
```

## 🌐 Supported Chains

| Chain | Chain ID | Native Token | Status |
|-------|----------|--------------|---------|
| Base | 8453 | ETH | ✅ Active |
| Ethereum | 1 | ETH | ✅ Active |
| Polygon | 137 | MATIC | ✅ Active |
| Arbitrum | 42161 | ETH | ✅ Active |
| Optimism | 10 | ETH | ✅ Active |
| Avalanche | 43114 | AVAX | ✅ Active |
| Unichain | 1301 | ETH | 🚧 Testnet |
| Base Sepolia | 84532 | ETH | 🧪 Testing |

## 💡 How It Works

1. **Connect Wallet**: User connects wallet via RainbowKit
2. **Select Chain**: Choose target blockchain for transaction
3. **Choose Action**: Select action (Mint NFT, Send USDC, etc.)
4. **Gas Estimation**: API estimates gas cost in native token and USDC
5. **Payment**: Circle Paymaster handles gas payment in USDC
6. **Tracking**: Transaction recorded for analytics and history

## 🎨 UI Components

All components follow the Feez design system:
- **Dark Theme**: Black background with subtle gradients
- **Feez Green**: `#4ade80` primary accent color
- **Glass Cards**: Semi-transparent cards with blur effects
- **Smooth Animations**: Fade-in and hover transitions

## 🔐 Security

- Private keys stored securely in environment variables
- API endpoints validate user signatures
- Rate limiting on sensitive endpoints
- CORS configured for production domains

## 🚀 Deployment

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect repository to Vercel
   - Configure environment variables
   - Deploy automatically on push

3. **Environment Variables in Vercel**
   ```
   CIRCLE_API_KEY=your_circle_api_key
   WALLET_PRIVATE_KEY=your_wallet_private_key
   NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
   DATABASE_URL=your_production_database_url
   ```

## 📊 Analytics

The analytics dashboard provides insights into:
- Total USDC spent on gas
- Gas spending over time (line chart)
- Chain usage distribution (pie chart)
- Weekly/monthly spending trends
- Largest single gas payments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🐛 Troubleshooting

### Common Issues

**Wallet Connection Issues**
- Ensure RainbowKit is properly configured
- Check if wallet is on supported network

**Gas Estimation Failures**
- Verify Circle API key is valid
- Check if chain is supported by Circle Paymaster

**Transaction Failures**
- Ensure sufficient USDC balance
- Check network congestion

**Database Issues**
- Run `npx prisma db push` to sync schema
- Check database connection string

## 📝 License

MIT License - see LICENSE file for details

## 📞 Support

For support, please:
1. Check the troubleshooting guide
2. Search existing GitHub issues
3. Create a new issue with detailed information

## 🔮 Roadmap

- [ ] Additional chain support
- [ ] DEX integration for token swaps
- [ ] Advanced analytics features
- [ ] Mobile app development
- [ ] Batch transaction support
- [ ] DeFi protocol integrations

---

**Built with ❤️ by the Feez Team**
