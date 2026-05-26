'use client'

import { Monitor, Box, Terminal, ChevronRight, Info } from 'lucide-react'
import { useDashboard } from './dashboard-context'

export function SoulRecoveryFlow() {
  const { activeAgent, addToast } = useDashboard()

  const steps = [
    {
      id: 'local',
      Icon: Monitor,
      title: 'Local Soul',
      description: 'Agent runtime / local environment',
      status: activeAgent.status === 'IDLE' ? 'Idle' : 'Active',
      active: activeAgent.status !== 'IDLE',
    },
    {
      id: 'arkiv',
      Icon: Box,
      title: 'Arkiv Soul Backup',
      description: 'Decentralized storage on Arkiv Braga',
      status: 'Backed Up',
      active: true,
    },
    {
      id: 'revival',
      Icon: Terminal,
      title: 'Revival Runtime',
      description: 'Reinstantiated agent in new runtime',
      status: 'Ready',
      active: true,
    },
  ]

  return (
    <div className="relative border border-[#162816] rounded-lg bg-[#0b1510] overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#00f080]/20 to-transparent" />

      <div className="p-5">
        <div className="flex items-center gap-1.5 mb-4">
          <h3 className="text-[9px] font-bold tracking-[0.15em] text-[#d4e8d4] uppercase">
            Soul Recovery Flow
          </h3>
          <button
            onClick={() => addToast('info', 'Soul Recovery Flow', 'Pipeline: Local Soul state → Arkiv decentralized backup → Revival in a new runtime.')}
            className="text-[#3d6040] hover:text-[#00f080] transition-colors"
          >
            <Info size={10} />
          </button>
        </div>

        <div className="flex items-stretch gap-0">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1 gap-0">
              <div className={`flex-1 border rounded-lg p-3.5 transition-colors ${
                step.active
                  ? 'border-[#162816] bg-[#060b06] hover:border-[#1e3c1e]'
                  : 'border-[#162816] bg-[#060b06] opacity-60'
              }`}>
                <div className="flex items-center gap-2 mb-2.5">
                  <div className={`w-6 h-6 rounded border flex items-center justify-center flex-shrink-0 ${
                    step.active ? 'border-[#00f080]/20 bg-[#00f080]/5' : 'border-[#162816] bg-[#101d10]'
                  }`}>
                    <step.Icon size={12} className={step.active ? 'text-[#00f080]' : 'text-[#3d6040]'} />
                  </div>
                  <span className="text-[9px] font-bold tracking-[0.12em] text-[#d4e8d4] uppercase leading-tight">
                    {step.title}
                  </span>
                </div>
                <p className="text-[10px] text-[#3d6040] leading-relaxed mb-2">
                  {step.description}
                </p>
                <div className="flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${step.active ? 'bg-[#00f080]' : 'bg-[#3d6040]'}`} />
                  <p className={`text-[10px] font-semibold ${step.active ? 'text-[#00f080]' : 'text-[#3d6040]'}`}>
                    Status: {step.status}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <ChevronRight size={14} className="text-[#3d6040] flex-shrink-0 mx-1.5" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
