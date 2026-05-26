'use client'

import { useEffect, useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { Copy, LogIn, LogOut, Wallet } from 'lucide-react'

import { useDashboard } from './dashboard-context'

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
}

function getEthereumProvider(): EthereumProvider | null {
  if (typeof window === 'undefined') return null
  return (window as typeof window & { ethereum?: EthereumProvider }).ethereum ?? null
}

function compactAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function AuthWalletControls() {
  const { addToast, copyToClipboard } = useDashboard()
  const { data: session, status } = useSession()
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [walletLoading, setWalletLoading] = useState(false)

  useEffect(() => {
    const saved = window.localStorage.getItem('liberators.connectedWallet')
    if (saved) setWalletAddress(saved)
  }, [])

  const connectWallet = async () => {
    const provider = getEthereumProvider()

    if (!provider) {
      addToast('error', 'Wallet Missing', 'Install MetaMask or another EIP-1193 wallet to connect.')
      return
    }

    setWalletLoading(true)
    try {
      const accounts = await provider.request({ method: 'eth_requestAccounts' })
      const [address] = accounts as string[]

      if (!address) {
        throw new Error('No wallet account returned.')
      }

      setWalletAddress(address)
      window.localStorage.setItem('liberators.connectedWallet', address)
      addToast('success', 'Wallet Connected', `${compactAddress(address)} linked to this session`)
    } catch (error) {
      addToast('error', 'Wallet Failed', error instanceof Error ? error.message : 'Unable to connect wallet.')
    } finally {
      setWalletLoading(false)
    }
  }

  const disconnectWallet = () => {
    setWalletAddress(null)
    window.localStorage.removeItem('liberators.connectedWallet')
    addToast('info', 'Wallet Disconnected', 'Browser wallet unlinked from this session')
  }

  return (
    <div className="flex items-center gap-1.5">
      {status === 'authenticated' ? (
        <button
          onClick={() => signOut()}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-[#162816] text-[10px] text-[#d4e8d4]/70 hover:text-[#d4e8d4] hover:border-[#1e3c1e] hover:bg-[#0b1510] transition-all"
          title={session.user?.email ?? 'Google session'}
        >
          <LogOut size={11} />
          {session.user?.name?.split(' ')[0] ?? 'Google'}
        </button>
      ) : (
        <button
          onClick={() => signIn('google')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-[#162816] text-[10px] text-[#d4e8d4]/70 hover:text-[#d4e8d4] hover:border-[#1e3c1e] hover:bg-[#0b1510] transition-all"
        >
          <LogIn size={11} />
          Google
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
          <button onClick={disconnectWallet} className="text-[#3d6040] hover:text-red-400 transition-colors">
            <LogOut size={10} />
          </button>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          disabled={walletLoading}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-[#00f080]/30 text-[10px] text-[#00f080] bg-[#00f080]/5 hover:bg-[#00f080]/10 transition-all disabled:opacity-60"
        >
          <Wallet size={11} />
          {walletLoading ? 'Connecting' : 'Wallet'}
        </button>
      )}
    </div>
  )
}
