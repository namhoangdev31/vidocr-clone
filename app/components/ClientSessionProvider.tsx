"use client"

import ClientAuthGuard from './ClientAuthGuard'
import FirebaseAuthWrapper from './FirebaseAuthWrapper'

type ClientSessionProviderProps = {
  children: React.ReactNode
}

export default function ClientSessionProvider({ children }: ClientSessionProviderProps) {
  return (
    <FirebaseAuthWrapper>
      <ClientAuthGuard>
        {children}
      </ClientAuthGuard>
    </FirebaseAuthWrapper>
  )
}
