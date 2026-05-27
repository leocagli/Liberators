'use client'

import { AgentCard } from './agent-card'
import { useDashboard } from './dashboard-context'
import { AgentsPanel, ArkivNetworkPanel, IntegrationsPanel, SettingsPanel } from './nav-panels'
import { ProofRecords } from './proof-records'
import { SoulRecoveryFlow } from './soul-recovery-flow'

export function MainContent() {
  const { activeNavId } = useDashboard()

  if (activeNavId === 'proofs') {
    return <ProofRecords />
  }

  if (activeNavId === 'arkiv') {
    return <ArkivNetworkPanel />
  }

  if (activeNavId === 'agents') {
    return <AgentsPanel />
  }

  if (activeNavId === 'integrations') {
    return <IntegrationsPanel />
  }

  if (activeNavId === 'settings') {
    return <SettingsPanel />
  }

  return (
    <>
      <AgentCard />
      <SoulRecoveryFlow />
      <ProofRecords />
    </>
  )
}
