'use client'

import { useRef, useEffect, useState } from 'react'
import { Filter, Calendar, ExternalLink, ChevronDown, Leaf, Zap, Shield, Database } from 'lucide-react'
import { useDashboard } from './dashboard-context'

const proofRecords = [
  {
    type: 'evolutionProof',
    typeColor: 'text-[#00f080]',
    icon: Leaf,
    iconColor: 'text-[#00f080]',
    agent: 'Valvrave',
    entity: 'Evolution v2.4.1',
    tx: '0x1a2b...7c9d3e',
    dataLink: 'data.arkiv://braga/18742991/evo/1a2b',
    time: 'May 24, 2025 14:32:18',
  },
  {
    type: 'skillLiberationProof',
    typeColor: 'text-[#8b5cf6]',
    icon: Zap,
    iconColor: 'text-[#8b5cf6]',
    agent: 'Valvrave',
    entity: 'Skill Set: Hyperion',
    tx: '0x3f4d...9a8b2c',
    dataLink: 'data.arkiv://braga/18742800/skill/3f4d',
    time: 'May 24, 2025 13:57:41',
  },
  {
    type: 'guardianIntegrityProof',
    typeColor: 'text-[#38bdf8]',
    icon: Shield,
    iconColor: 'text-[#38bdf8]',
    agent: 'Hermit',
    entity: 'Guardian v3.1.7',
    tx: '0x7e1b...a1b4f8',
    dataLink: 'data.arkiv://braga/18742750/guard/7e1b',
    time: 'May 24, 2025 13:55:02',
  },
  {
    type: 'soulBackupProof',
    typeColor: 'text-[#f59e0b]',
    icon: Database,
    iconColor: 'text-[#f59e0b]',
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
  const timeRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (filterOpen && filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false)
      if (timeOpen   && timeRef.current   && !timeRef.current.contains(e.target as Node))   setTimeOpen(false)
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [filterOpen, timeOpen])

  const filteredRecords = activeFilter === 'All'
    ? proofRecords
    : proofRecords.filter((r) => r.type === activeFilter)

  return (
    <div className="relative border border-[#162816] rounded-lg bg-[#0b1510] overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#00f080]/15 to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#162816]">
        <h3 className="text-[9px] font-bold tracking-[0.18em] text-[#d4e8d4] uppercase">
          Proof Records
        </h3>
        <div className="flex items-center gap-2">

          {/* Filter dropdown */}
          <div ref={filterRef} className="relative">
            <button
              onClick={() => { setFilterOpen(!filterOpen); setTimeOpen(false) }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[9px] transition-all ${
                filterOpen || activeFilter !== 'All'
                  ? 'border-[#00f080]/30 text-[#00f080] bg-[#00f080]/5'
                  : 'border-[#162816] text-[#3d6040] hover:text-[#d4e8d4] bg-[#060b06]'
              }`}
            >
              <Filter size={9} />
              {activeFilter === 'All' ? 'Filter' : activeFilter.replace('Proof', '')}
              <ChevronDown size={8} className={`transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
            </button>
            {filterOpen && (
              <div className="absolute right-0 top-7 w-52 border border-[#162816] rounded-lg bg-[#0b1510] shadow-2xl z-20">
                {FILTER_TYPES.map((f) => (
                  <button
                    key={f}
                    onClick={() => { setActiveFilter(f); setFilterOpen(false) }}
                    className={`flex items-center w-full px-3 py-2 text-[10px] transition-colors hover:bg-[#0d180d] ${
                      activeFilter === f ? 'text-[#00f080] font-semibold' : 'text-[#d4e8d4]/60'
                    }`}
                  >
                    <span className="w-3 mr-1.5">{activeFilter === f ? '✓' : ''}</span>
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
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[9px] transition-all ${
                timeOpen
                  ? 'border-[#00f080]/30 text-[#00f080] bg-[#00f080]/5'
                  : 'border-[#162816] text-[#3d6040] hover:text-[#d4e8d4] bg-[#060b06]'
              }`}
            >
              <Calendar size={9} />
              {timeRange}
              <ChevronDown size={8} className={`transition-transform ${timeOpen ? 'rotate-180' : ''}`} />
            </button>
            {timeOpen && (
              <div className="absolute right-0 top-7 w-24 border border-[#162816] rounded-lg bg-[#0b1510] shadow-2xl z-20">
                {TIME_RANGES.map((t) => (
                  <button
                    key={t}
                    onClick={() => { setTimeRange(t); setTimeOpen(false) }}
                    className={`flex items-center w-full px-3 py-2 text-[10px] transition-colors hover:bg-[#0d180d] ${
                      timeRange === t ? 'text-[#00f080] font-semibold' : 'text-[#d4e8d4]/60'
                    }`}
                  >
                    <span className="w-3 mr-1">{timeRange === t ? '✓' : ''}</span>
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
            <tr className="border-b border-[#162816]">
              {['Proof Type', 'Agent', 'Entity', 'TX', 'Data.Arkiv Link', 'Time (UTC)'].map((col) => (
                <th
                  key={col}
                  className="px-5 py-2.5 text-left text-[8px] font-bold tracking-[0.15em] text-[#3d6040] uppercase whitespace-nowrap"
                >
                  {col}
                  {col === 'Time (UTC)' && <span className="ml-1">↑</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-[11px] text-[#3d6040]">
                  No records match the current filter.
                </td>
              </tr>
            ) : (
              filteredRecords.map((record, i) => (
                <tr
                  key={i}
                  className="border-b border-[#162816]/60 hover:bg-[#0d180d] transition-colors"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <record.icon size={11} className={record.iconColor} />
                      <span className={`text-[11px] font-mono font-semibold ${record.typeColor}`}>
                        {record.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-[11px] text-[#d4e8d4]">{record.agent}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-[11px] text-[#d4e8d4]">{record.entity}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-mono text-[#d4e8d4]/50">{record.tx}</span>
                      <button
                        onClick={() => window.open(`https://explorer.arkiv.network/tx/${record.tx}`, '_blank')}
                        className="text-[#3d6040] hover:text-[#00f080] transition-colors"
                      >
                        <ExternalLink size={9} />
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="text-[11px] font-mono text-[#00f080] hover:underline cursor-pointer"
                        onClick={() => window.open(`https://${record.dataLink.replace('data.arkiv://', '')}`, '_blank')}
                      >
                        {record.dataLink}
                      </span>
                      <button
                        onClick={() => window.open(`https://${record.dataLink.replace('data.arkiv://', '')}`, '_blank')}
                        className="text-[#3d6040] hover:text-[#00f080] transition-colors"
                      >
                        <ExternalLink size={9} />
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-[11px] text-[#3d6040] whitespace-nowrap font-mono">
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
      <div className="flex items-center justify-between px-5 py-2.5 border-t border-[#162816]/60">
        <div className="flex items-center gap-3">
          <span className="text-[9px] text-[#3d6040]">
            Showing {filteredRecords.length} of {proofRecords.length} records
          </span>
          <div className="flex items-center gap-1">
            <span className="text-[#00f080] text-[9px]">✓</span>
            <span className="text-[9px] text-[#3d6040]">All proofs verified by Arkiv Braga</span>
          </div>
        </div>
        <button
          onClick={() => setProofModal(true)}
          className="flex items-center gap-1 text-[9px] font-bold text-[#d4e8d4]/50 hover:text-[#d4e8d4] transition-colors uppercase tracking-widest"
        >
          View All Proofs
          <ExternalLink size={9} />
        </button>
      </div>
    </div>
  )
}
