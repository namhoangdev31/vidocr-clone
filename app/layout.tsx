import ClientSessionProvider from '@/app/components/ClientSessionProvider'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ViOCR Clone',
  description: 'OCR application clone built with Next.js and Tailwind CSS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientSessionProvider> 
          {children}
        </ClientSessionProvider>
      </body>
    </html>
  )
}