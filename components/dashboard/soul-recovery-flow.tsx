'use client'

import { Monitor, Box, Terminal, ArrowRight, Info } from 'lucide-react'

const steps = [
  {
    id: 'local',
    icon: Monitor,
    title: 'Local Soul',
    description: 'Agent runtime / local environment',
    status: 'Active',
    statusColor: 'text-[#00e87a]',
  },
  {
    id: 'arkiv',
    icon: Box,
    title: 'Arkiv Soul Backup',
    description: 'Decentralized storage on Arkiv Braga',
    status: 'Backed Up',
    statusColor: 'text-[#00e87a]',
  },
  {
    id: 'revival',
    icon: Terminal,
    title: 'Revival Runtime',
    description: 'Reinstantiated agent in new runtime',
    status: 'Ready',
    statusColor: 'text-[#00e87a]',
  },
]

export function SoulRecoveryFlow() {
  return (
    <div className="border border-[#1a2e1a] rounded-lg bg-[#0d160d] p-5">
      <div className="flex items-center gap-1.5 mb-4">
        <h3 className="text-[10px] font-semibold tracking-widest text-[#dceadc] uppercase">
          Soul Recovery Flow
        </h3>
        <Info size={11} className="text-[#4e7050]" />
      </div>

      <div className="flex items-center gap-2">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-2 flex-1">
            <div className="flex-1 border border-[#1a2e1a] rounded-lg p-3 bg-[#0a130a]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded border border-[#1a2e1a] flex items-center justify-center bg-[#111f11]">
                  <step.icon size={13} className="text-[#4e7050]" />
                </div>
                <span className="text-[10px] font-bold tracking-widest text-[#dceadc] uppercase">
                  {step.title}
                </span>
              </div>
              <p className="text-[10px] text-[#4e7050] leading-relaxed mb-2">
                {step.description}
              </p>
              <p className={`text-[10px] font-semibold ${step.statusColor}`}>
                Status: {step.status}
              </p>
            </div>
            {index < steps.length - 1 && (
              <ArrowRight size={14} className="text-[#4e7050] flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
