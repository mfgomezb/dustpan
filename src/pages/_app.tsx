'use client';

import './globals.css';

import '@rainbow-me/rainbowkit/styles.css';
import {
  ConnectButton,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import {
  mainnet,
  optimism,
  polygon,
  arbitrum,
  goerli,
} from '@wagmi/core/chains';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { Suspense } from 'react';
import Navbar from './navbar';
import type { AppProps } from 'next/app';

const ALCHEMY_ID = 'fNkEKRPCJM4iReeJ6ZrBmrfj18eciu6i';

const { chains, provider } = configureChains(
  [goerli, mainnet, optimism, polygon, arbitrum],
  [alchemyProvider({ apiKey: ALCHEMY_ID }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'dustpan',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default function RootLayout({
  Component,
  pageProps: { ...pageProps },
}: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <main className="flex min-h-screen flex-col items-center p-24">
          <Suspense>
            <Navbar />
          </Suspense>
          <Component {...pageProps} />
        </main>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
