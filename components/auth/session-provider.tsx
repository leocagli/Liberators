'use client'

import { PrivyProvider } from '@privy-io/react-auth'

export function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID

  if (!privyAppId) {
    return <>{children}</>
  }

  return (
    <PrivyProvider
      appId={privyAppId}
      config={{
        loginMethods: ['google', 'wallet'],
        appearance: {
          theme: 'dark',
          accentColor: '#00f080',
          logo: '/liberators-mark.svg',
        },
      }}
    >
      {children}
    </PrivyProvider>
  )
}
