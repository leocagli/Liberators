'use client'

import Image from 'next/image'
import { Shield, Database, Globe, Clock, Copy, ExternalLink, RefreshCw, Upload, Info } from 'lucide-react'

const INTEGRITY_SCORE = 98.76
const TOTAL_SEGMENTS = 30
const FILLED_SEGMENTS = Math.round((INTEGRITY_SCORE / 100) * TOTAL_SEGMENTS)

export function AgentCard() {
  return (
    <div className="border border-[#1a2e1a] rounded-lg bg-[#0d160d] p-5">
      {/* Top row: avatar + name + meta */}
      <div className="flex gap-5 mb-5">
        {/* Avatar */}
        <div className="w-[140px] h-[140px] flex-shrink-0 rounded-lg overflow-hidden border border-[#1a2e1a] bg-[#0a130a]">
          <Image
            src="/valvrave.jpg"
            alt="Valvrave agent avatar"
            width={140}
            height={140}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Name + badges + integrity */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-2xl font-bold text-[#dceadc] tracking-wide uppercase">
              Valvrave
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase bg-[#00e87a]/10 text-[#00e87a] border border-[#00e87a]/30">
              Active
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-[#4e7050] border border-[#1a2e1a] bg-[#0a130a]">
              v2.4.1
            </span>
          </div>

          {/* Integrity score */}
          <div className="mb-2">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-semibold tracking-widest text-[#4e7050] uppercase">
                Integrity Score
              </span>
              <Info size={10} className="text-[#4e7050]" />
            </div>
            <div className="text-[2.2rem] font-bold text-[#00e87a] leading-none mb-2 neon-glow-text">
              {INTEGRITY_SCORE}%
            </div>
            {/* Segmented bar */}
            <div className="flex gap-[3px] mb-1">
              {Array.from({ length: TOTAL_SEGMENTS }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-3.5 rounded-[1px] ${
                    i < FILLED_SEGMENTS
                      ? 'bg-[#00e87a]'
                      : 'bg-[#111f11] border border-[#1a2e1a]'
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-[#4e7050]">Threshold: 90%</span>
              <Info size={9} className="text-[#4e7050]" />
            </div>
          </div>
        </div>

        {/* Right meta column */}
        <div className="flex flex-col gap-4 min-w-[220px]">
          {/* Protected by */}
          <div className="flex items-start gap-2.5">
            <Shield size={16} className="text-[#4e7050] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[9px] font-semibold tracking-widest text-[#4e7050] uppercase mb-0.5">
                Protected By
              </p>
              <p className="text-xs font-bold text-[#00e87a]">Hermit</p>
            </div>
          </div>

          {/* Last backup */}
          <div className="flex items-start gap-2.5">
            <Clock size={16} className="text-[#4e7050] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[9px] font-semibold tracking-widest text-[#4e7050] uppercase mb-0.5">
                Last Decentralized Backup
              </p>
              <p className="text-xs font-semibold text-[#dceadc]">
                May 24, 2025 14:32:18 UTC
              </p>
              <p className="text-[10px] text-[#4e7050] font-mono mt-0.5">
                Block 18,742,991
              </p>
            </div>
          </div>

          {/* Soul ID */}
          <div className="flex items-start gap-2.5">
            <Database size={16} className="text-[#4e7050] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[9px] font-semibold tracking-widest text-[#4e7050] uppercase mb-0.5">
                Soul ID
              </p>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono text-[#dceadc]">
                  0xValv...7aC9eF
                </span>
                <button className="text-[#4e7050] hover:text-[#00e87a] transition-colors">
                  <Copy size={10} />
                </button>
              </div>
            </div>
          </div>

          {/* Arkiv gate */}
          <div className="flex items-start gap-2.5">
            <Globe size={16} className="text-[#4e7050] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[9px] font-semibold tracking-widest text-[#4e7050] uppercase mb-0.5">
                Arkiv Gate
              </p>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-[#dceadc]">
                  braga.arkiv.network
                </span>
                <ExternalLink size={10} className="text-[#4e7050]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded border border-[#00e87a] text-sm font-bold tracking-widest uppercase text-[#00e87a] bg-[#00e87a]/5 hover:bg-[#00e87a]/10 transition-colors">
          <Upload size={14} />
          Backup Soul
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded border border-[#1a2e1a] text-sm font-bold tracking-widest uppercase text-[#dceadc]/70 bg-[#0a130a] hover:bg-[#0f1a0f] hover:border-[#2a3e2a] transition-colors">
          <RefreshCw size={14} />
          Revive From Arkiv
        </button>
      </div>
    </div>
  )
}
