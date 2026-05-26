'use client'

import { Filter, Calendar, ExternalLink, Copy, ChevronDown, Leaf, Zap, Shield, Database } from 'lucide-react'

const proofRecords = [
  {
    type: 'evolutionProof',
    typeColor: 'text-[#00e87a]',
    icon: Leaf,
    iconColor: 'text-[#00e87a]',
    agent: 'Valvrave',
    entity: 'Evolution v2.4.1',
    tx: '0x1a2b...7c9d3e',
    dataLink: 'data.arkiv://braga/18742991/evo/1a2b',
    time: 'May 24, 2025 14:32:18',
  },
  {
    type: 'skillLiberationProof',
    typeColor: 'text-[#7c5cff]',
    icon: Zap,
    iconColor: 'text-[#7c5cff]',
    agent: 'Valvrave',
    entity: 'Skill Set: Hyperion',
    tx: '0x3f4d...9a8b2c',
    dataLink: 'data.arkiv://braga/18742800/skill/3f4d',
    time: 'May 24, 2025 13:57:41',
  },
  {
    type: 'guardianIntegrityProof',
    typeColor: 'text-[#3b9eff]',
    icon: Shield,
    iconColor: 'text-[#3b9eff]',
    agent: 'Hermit',
    entity: 'Guardian v3.1.7',
    tx: '0x7e1b...a1b4f8',
    dataLink: 'data.arkiv://braga/18742750/guard/7e1b',
    time: 'May 24, 2025 13:55:02',
  },
  {
    type: 'soulBackupProof',
    typeColor: 'text-[#ffa940]',
    icon: Database,
    iconColor: 'text-[#ffa940]',
    agent: 'Valvrave',
    entity: 'Soul Backup v2.4.1',
    tx: '0x9c8d...4e7f1a',
    dataLink: 'data.arkiv://braga/18742991/backup/9c8d',
    time: 'May 24, 2025 14:32:18',
  },
]

export function ProofRecords() {
  return (
    <div className="border border-[#1a2e1a] rounded-lg bg-[#0d160d] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1a2e1a]">
        <h3 className="text-[10px] font-semibold tracking-widest text-[#dceadc] uppercase">
          Proof Records
        </h3>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#1a2e1a] text-[10px] text-[#4e7050] hover:text-[#dceadc] transition-colors bg-[#0a130a]">
            <Filter size={10} />
            Filter
          </button>
          <button className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#1a2e1a] text-[10px] text-[#4e7050] hover:text-[#dceadc] transition-colors bg-[#0a130a]">
            <Calendar size={10} />
            7D
            <ChevronDown size={9} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1a2e1a]">
              {['Proof Type', 'Agent', 'Entity', 'TX', 'Data.Arkiv Link', 'Time (UTC)'].map(
                (col) => (
                  <th
                    key={col}
                    className="px-5 py-2.5 text-left text-[9px] font-semibold tracking-widest text-[#4e7050] uppercase whitespace-nowrap"
                  >
                    {col}
                    {col === 'Time (UTC)' && (
                      <span className="ml-1 text-[#4e7050]">↑</span>
                    )}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {proofRecords.map((record, i) => (
              <tr
                key={i}
                className="border-b border-[#1a2e1a] hover:bg-[#0f1a0f] transition-colors"
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5">
                    <record.icon size={12} className={record.iconColor} />
                    <span className={`text-xs font-mono font-semibold ${record.typeColor}`}>
                      {record.type}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className="text-xs text-[#dceadc]">{record.agent}</span>
                </td>
                <td className="px-5 py-3">
                  <span className="text-xs text-[#dceadc]">{record.entity}</span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono text-[#dceadc]/70">{record.tx}</span>
                    <button className="text-[#4e7050] hover:text-[#00e87a] transition-colors">
                      <ExternalLink size={10} />
                    </button>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono text-[#00e87a] hover:underline cursor-pointer">
                      {record.dataLink}
                    </span>
                    <button className="text-[#4e7050] hover:text-[#00e87a] transition-colors">
                      <ExternalLink size={10} />
                    </button>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className="text-xs text-[#4e7050] whitespace-nowrap font-mono">
                    {record.time}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-2.5 border-t border-[#1a2e1a]">
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-[#4e7050]">
            Showing 4 of 4 records
          </span>
          <div className="flex items-center gap-1">
            <span className="text-[#00e87a]">&#10003;</span>
            <span className="text-[10px] text-[#4e7050]">
              All proofs verified by Arkiv Braga
            </span>
          </div>
        </div>
        <button className="flex items-center gap-1 text-[10px] font-semibold text-[#dceadc]/60 hover:text-[#dceadc] transition-colors uppercase tracking-wider">
          View All Proofs
          <ExternalLink size={10} />
        </button>
      </div>
    </div>
  )
}
