'use client'

import { useRef, useEffect, useState } from 'react'
import { Filter, Calendar, ExternalLink, ChevronDown, Leaf, Zap, Shield, Database } from 'lucide-react'
import { useDashboard } from './dashboard-context'

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

const FILTER_TYPES = ['All', 'evolutionProof', 'skillLiberationProof', 'guardianIntegrityProof', 'soulBackupProof']
const TIME_RANGES = ['7D', '30D', '90D', 'ALL'] as const

export function ProofRecords() {
  const { setProofModal, timeRange, setTimeRange } = useDashboard()
  const [filterOpen, setFilterOpen] = useState(false)
  const [timeOpen, setTimeOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState('All')

  const filterRef = useRef<HTMLDivElement>(null)
  const timeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (filterOpen && filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false)
      if (timeOpen && timeRef.current && !timeRef.current.contains(e.target as Node)) setTimeOpen(false)
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [filterOpen, timeOpen])

  const filteredRecords = activeFilter === 'All'
    ? proofRecords
    : proofRecords.filter((r) => r.type === activeFilter)

  return (
    <div className="border border-[#1a2e1a] rounded-lg bg-[#0d160d] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1a2e1a]">
        <h3 className="text-[10px] font-semibold tracking-widest text-[#dceadc] uppercase">
          Proof Records
        </h3>
        <div className="flex items-center gap-2">
          {/* Filter dropdown */}
          <div ref={filterRef} className="relative">
            <button
              onClick={() => { setFilterOpen(!filterOpen); setTimeOpen(false) }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[10px] transition-colors bg-[#0a130a] ${
                filterOpen || activeFilter !== 'All'
                  ? 'border-[#00e87a]/40 text-[#00e87a]'
                  : 'border-[#1a2e1a] text-[#4e7050] hover:text-[#dceadc]'
              }`}
            >
              <Filter size={10} />
              {activeFilter === 'All' ? 'Filter' : activeFilter.replace('Proof', '')}
              <ChevronDown size={9} className={`transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
            </button>
            {filterOpen && (
              <div className="absolute right-0 top-7 w-52 border border-[#1a2e1a] rounded-lg bg-[#0d160d] shadow-xl z-20">
                {FILTER_TYPES.map((f) => (
                  <button
                    key={f}
                    onClick={() => { setActiveFilter(f); setFilterOpen(false) }}
                    className={`flex items-center w-full px-3 py-2 text-[11px] transition-colors hover:bg-[#0f1a0f] ${
                      activeFilter === f ? 'text-[#00e87a] font-semibold' : 'text-[#dceadc]/70'
                    }`}
                  >
                    {activeFilter === f && <span className="mr-1.5">&#10003;</span>}
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Time range dropdown */}
          <div ref={timeRef} className="relative">
            <button
              onClick={() => { setTimeOpen(!timeOpen); setFilterOpen(false) }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[10px] transition-colors bg-[#0a130a] ${
                timeOpen ? 'border-[#00e87a]/40 text-[#00e87a]' : 'border-[#1a2e1a] text-[#4e7050] hover:text-[#dceadc]'
              }`}
            >
              <Calendar size={10} />
              {timeRange}
              <ChevronDown size={9} className={`transition-transform ${timeOpen ? 'rotate-180' : ''}`} />
            </button>
            {timeOpen && (
              <div className="absolute right-0 top-7 w-24 border border-[#1a2e1a] rounded-lg bg-[#0d160d] shadow-xl z-20">
                {TIME_RANGES.map((t) => (
                  <button
                    key={t}
                    onClick={() => { setTimeRange(t); setTimeOpen(false) }}
                    className={`flex items-center w-full px-3 py-2 text-[11px] transition-colors hover:bg-[#0f1a0f] ${
                      timeRange === t ? 'text-[#00e87a] font-semibold' : 'text-[#dceadc]/70'
                    }`}
                  >
                    {timeRange === t && <span className="mr-1">&#10003;</span>}
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1a2e1a]">
              {['Proof Type', 'Agent', 'Entity', 'TX', 'Data.Arkiv Link', 'Time (UTC)'].map((col) => (
                <th
                  key={col}
                  className="px-5 py-2.5 text-left text-[9px] font-semibold tracking-widest text-[#4e7050] uppercase whitespace-nowrap"
                >
                  {col}
                  {col === 'Time (UTC)' && <span className="ml-1 text-[#4e7050]">&#8593;</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-xs text-[#4e7050]">
                  No proof records match the current filter.
                </td>
              </tr>
            ) : (
              filteredRecords.map((record, i) => (
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
                      <button
                        onClick={() => window.open(`https://explorer.arkiv.network/tx/${record.tx}`, '_blank')}
                        className="text-[#4e7050] hover:text-[#00e87a] transition-colors"
                        title="View transaction"
                      >
                        <ExternalLink size={10} />
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="text-xs font-mono text-[#00e87a] hover:underline cursor-pointer"
                        onClick={() => window.open(`https://${record.dataLink.replace('data.arkiv://', '')}`, '_blank')}
                      >
                        {record.dataLink}
                      </span>
                      <button
                        onClick={() => window.open(`https://${record.dataLink.replace('data.arkiv://', '')}`, '_blank')}
                        className="text-[#4e7050] hover:text-[#00e87a] transition-colors"
                        title="Open data link"
                      >
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-2.5 border-t border-[#1a2e1a]">
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-[#4e7050]">
            Showing {filteredRecords.length} of {proofRecords.length} records
          </span>
          <div className="flex items-center gap-1">
            <span className="text-[#00e87a]">&#10003;</span>
            <span className="text-[10px] text-[#4e7050]">All proofs verified by Arkiv Braga</span>
          </div>
        </div>
        <button
          onClick={() => setProofModal(true)}
          className="flex items-center gap-1 text-[10px] font-semibold text-[#dceadc]/60 hover:text-[#dceadc] transition-colors uppercase tracking-wider"
        >
          View All Proofs
          <ExternalLink size={10} />
        </button>
      </div>
    </div>
  )
}
