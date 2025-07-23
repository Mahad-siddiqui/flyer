import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/layout/header'
import { Toaster } from 'sonner'
import { SessionProvider } from 'next-auth/react'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import './globals.css'
import ClientLayout from './ClientLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FlyerWeb - Transform Flyers into Interactive Web Pages',
  description: 'Upload your flyers and instantly create mobile-responsive web pages with QR codes. Perfect for events, promotions, and more.',
  keywords: ['flyer', 'web page', 'QR code', 'mobile responsive', 'event', 'promotion'],
  authors: [{ name: 'FlyerWeb Team' }],
  creator: 'FlyerWeb',
  publisher: 'FlyerWeb',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://flyerweb.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://flyerweb.com',
    title: 'FlyerWeb - Transform Flyers into Interactive Web Pages',
    description: 'Upload your flyers and instantly create mobile-responsive web pages with QR codes.',
    siteName: 'FlyerWeb',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FlyerWeb - Transform Flyers into Interactive Web Pages',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlyerWeb - Transform Flyers into Interactive Web Pages',
    description: 'Upload your flyers and instantly create mobile-responsive web pages with QR codes.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientLayout session={session} children={children} />
      </body>
    </html>
  )
}