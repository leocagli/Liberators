'use client'

import { useEffect, useState } from 'react'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { Copy, LogIn, LogOut, Wallet } from 'lucide-react'

import { useDashboard } from './dashboard-context'

function compactAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function AuthWalletControls() {
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID

  if (!privyAppId) {
    return <PrivySetupMissing />
  }

  return <PrivyAuthWalletControls />
}

function PrivySetupMissing() {
  const { addToast, copyToClipboard } = useDashboard()
  const fallbackAddress = '0xab5bdE0d39EC4C2Ca1dd74d1811e22Fd6a98B59b'

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() =>
          addToast(
            'error',
            'Privy Setup Required',
            'Set NEXT_PUBLIC_PRIVY_APP_ID in Vercel to enable Google and wallet login.',
          )
        }
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-[#162816] text-[10px] text-[#d4e8d4]/70 hover:text-[#d4e8d4] hover:border-[#1e3c1e] hover:bg-[#0b1510] transition-all"
      >
        <LogIn size={11} />
        Privy Setup
      </button>
      <button
        onClick={() => copyToClipboard(fallbackAddress, 'Backend Arkiv wallet')}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-[#00f080]/30 text-[10px] text-[#00f080] bg-[#00f080]/5 hover:bg-[#00f080]/10 transition-all"
        title="Copy backend Arkiv wallet"
      >
        <Wallet size={11} />
        Backend Wallet
      </button>
    </div>
  )
}

function getPrivyUserLabel(user: unknown) {
  const data = user as {
    google?: { email?: string; name?: string }
    email?: { address?: string }
    wallet?: { address?: string }
  } | null

  return (
    data?.google?.name?.split(' ')[0] ??
    data?.google?.email ??
    data?.email?.address ??
    (data?.wallet?.address ? compactAddress(data.wallet.address) : 'Privy')
  )
}

function PrivyAuthWalletControls() {
  const { addToast, copyToClipboard } = useDashboard()
  const { ready, authenticated, user, login, logout } = usePrivy()
  const { wallets } = useWallets()
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  useEffect(() => {
    const address = wallets[0]?.address ?? null
    setWalletAddress(address)

    if (address) {
      window.localStorage.setItem('liberators.connectedWallet', address)
      return
    }

    window.localStorage.removeItem('liberators.connectedWallet')
  }, [wallets])

  const loginWithPrivy = () => {
    void login()
  }

  const logoutFromPrivy = async () => {
    await logout()
    setWalletAddress(null)
    window.localStorage.removeItem('liberators.connectedWallet')
    addToast('info', 'Session Disconnected', 'Privy session and connected wallet cleared.')
  }

  return (
    <div className="flex items-center gap-1.5">
      {authenticated ? (
        <button
          onClick={logoutFromPrivy}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-[#162816] text-[10px] text-[#d4e8d4]/70 hover:text-[#d4e8d4] hover:border-[#1e3c1e] hover:bg-[#0b1510] transition-all"
          title="Disconnect Privy session"
        >
          <LogOut size={11} />
          {getPrivyUserLabel(user)}
        </button>
      ) : (
        <button
          onClick={loginWithPrivy}
          disabled={!ready}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-[#162816] text-[10px] text-[#d4e8d4]/70 hover:text-[#d4e8d4] hover:border-[#1e3c1e] hover:bg-[#0b1510] transition-all"
        >
          <LogIn size={11} />
          {ready ? 'Login' : 'Loading'}
        </button>
      )}

      {walletAddress ? (
        <div className="flex items-center gap-1 rounded border border-[#00f080]/25 bg-[#00f080]/5 px-2 py-1.5">
          <button
            onClick={() => copyToClipboard(walletAddress, 'Connected wallet')}
            className="flex items-center gap-1.5 text-[10px] font-mono text-[#00f080]"
            title="Copy connected wallet"
          >
            <Wallet size={11} />
            {compactAddress(walletAddress)}
            <Copy size={9} className="text-[#3d6040]" />
          </button>
          <button onClick={logoutFromPrivy} className="text-[#3d6040] hover:text-red-400 transition-colors">
            <LogOut size={10} />
          </button>
        </div>
      ) : (
        <button
          onClick={loginWithPrivy}
          disabled={!ready}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-[#00f080]/30 text-[10px] text-[#00f080] bg-[#00f080]/5 hover:bg-[#00f080]/10 transition-all disabled:opacity-60"
        >
          <Wallet size={11} />
          Wallet
        </button>
      )}
    </div>
  )
}
