import { createConfig, http } from 'wagmi';
import { metaMask, walletConnect } from 'wagmi/connectors';

// Monad Testnet configuration
export const monadTestnet = {
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'MON',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.monad.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Monad Explorer',
      url: 'https://testnet-explorer.monad.xyz',
    },
  },
  testnet: true,
} as const;

export const config = createConfig({
  chains: [monadTestnet],
  connectors: [
    metaMask(),
    walletConnect({
      projectId: 'your-project-id', // You'll need to get this from WalletConnect
    }),
  ],
  transports: {
    [monadTestnet.id]: http(),
  },
});