import { NextResponse } from 'next/server'

import { getConfiguredArkivAccount } from '@/src/arkiv/wallet'

export async function GET() {
  try {
    const account = getConfiguredArkivAccount()

    return NextResponse.json({
      address: account.address,
      network: 'Arkiv Braga',
      faucet: 'https://braga.hoodi.arkiv.network/faucet/',
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Wallet is not configured.' },
      { status: 500 },
    )
  }
}
