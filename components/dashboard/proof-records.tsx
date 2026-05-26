'use client'

import { useEffect, useRef, useState } from 'react'
import { Calendar, ChevronDown, ExternalLink, Filter, Trophy } from 'lucide-react'
import { proofRecords } from './proof-data'
import { useDashboard } from './dashboard-context'

const FILTER_TYPES = [
  'All',
  'evolutionProof',
  'skillLiberationProof',
  'guardianIntegrityProof',
  'soulBackupProof',
  'agentImprovementProof',
]
const TIME_RANGES = ['7D', '30D', '90D', 'ALL'] as const

export function ProofRecords() {
  const { activeAgent, addToast, setProofModal, timeRange, setTimeRange } = useDashboard()
  const [filterOpen, setFilterOpen] = useState(false)
  const [timeOpen, setTimeOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState('All')
  const [recordingImprovement, setRecordingImprovement] = useState(false)

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

  const recordImprovementProof = async () => {
    setRecordingImprovement(true)
    try {
      const response = await fetch('/api/arkiv/improvement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          liberatorName: activeAgent.id,
          version: activeAgent.version,
          integrityScore: activeAgent.integrityScore,
          competitionContext: `${activeAgent.name} agent improvement checkpoint for submission readiness.`,
        }),
      })
      const data = await response.json()

      if (!response.ok || !data.ok) {
        throw new Error(data.error ?? 'Improvement proof failed.')
      }

      addToast('success', 'Improvement Proof Written', `${activeAgent.name} checkpoint recorded on data.arkiv`)
    } catch (error) {
      addToast('error', 'Proof Failed', error instanceof Error ? error.message : 'Unable to write improvement proof.')
    } finally {
      setRecordingImprovement(false)
    }
  }

  return (
    <div className="relative border border-[#162816] rounded-lg bg-[#0b1510] overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#00f080]/15 to-transparent" />

      <div className="flex items-center justify-between px-5 py-3 border-b border-[#162816]">
        <h3 className="text-[9px] font-bold tracking-[0.18em] text-[#d4e8d4] uppercase">Proof Records</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={recordImprovementProof}
            disabled={recordingImprovement}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#f97316]/30 text-[9px] font-bold uppercase tracking-widest text-[#f97316] bg-[#f97316]/5 hover:bg-[#f97316]/10 disabled:opacity-50"
          >
            <Trophy size={9} />
            {recordingImprovement ? 'Writing' : 'Improve'}
          </button>
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
                    <span className="w-3 mr-1.5">{activeFilter === f ? '*' : ''}</span>
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>

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
                    <span className="w-3 mr-1">{timeRange === t ? '*' : ''}</span>
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

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
                  {col === 'Time (UTC)' && <span className="ml-1">^</span>}
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
                <tr key={i} className="border-b border-[#162816]/60 hover:bg-[#0d180d] transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <record.icon size={11} className={record.iconColor} />
                      <span className={`text-[11px] font-mono font-semibold ${record.typeColor}`}>
                        {record.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3"><span className="text-[11px] text-[#d4e8d4]">{record.agent}</span></td>
                  <td className="px-5 py-3"><span className="text-[11px] text-[#d4e8d4]">{record.entity}</span></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-mono text-[#d4e8d4]/50">{record.tx}</span>
                      <button
                        onClick={() => window.open(record.txUrl, '_blank', 'noopener,noreferrer')}
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
                        onClick={() => window.open(record.dataUrl, '_blank', 'noopener,noreferrer')}
                      >
                        {record.dataLink}
                      </span>
                      <button
                        onClick={() => window.open(record.dataUrl, '_blank', 'noopener,noreferrer')}
                        className="text-[#3d6040] hover:text-[#00f080] transition-colors"
                      >
                        <ExternalLink size={9} />
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-[11px] text-[#3d6040] whitespace-nowrap font-mono">{record.time}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-5 py-2.5 border-t border-[#162816]/60">
        <div className="flex items-center gap-3">
          <span className="text-[9px] text-[#3d6040]">
            Showing {filteredRecords.length} of {proofRecords.length} records
          </span>
          <div className="flex items-center gap-1">
            <span className="text-[#00f080] text-[9px]">*</span>
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
