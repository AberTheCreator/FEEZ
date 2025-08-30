import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Feez - Pay Gas Fees in USDC',
  description: 'Skip native tokens. Use USDC to pay for gas across any chain.',
  keywords: ['Web3', 'DeFi', 'Gas Fees', 'USDC', 'ERC-4337', 'Account Abstraction'],
  authors: [{ name: 'Feez Team' }],
  openGraph: {
    title: 'Feez - Pay Gas Fees in USDC',
    description: 'Skip native tokens. Use USDC to pay for gas across any chain.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
