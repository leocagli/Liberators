'use client'

import Image from 'next/image'
import { CheckCircle, Copy, ArrowRight, Shield, User, Box, ExternalLink, Layers } from 'lucide-react'

export function GuardianPanel() {
  return (
    <aside className="w-[290px] min-w-[290px] h-full flex flex-col border-l border-[#1a2e1a] bg-[#0a130a] overflow-y-auto">
      {/* Guardian header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-[#1a2e1a]">
        <div className="w-8 h-8 rounded overflow-hidden border border-[#1a2e1a] flex-shrink-0">
          <Image
            src="/hermit.jpg"
            alt="Hermit guardian"
            width={32}
            height={32}
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-sm font-bold tracking-widest text-[#dceadc] uppercase">
          Hermit Guardian
        </h2>
      </div>

      <div className="flex flex-col gap-4 p-4">
        {/* Guardian Integrity Proof */}
        <section className="border border-[#1a2e1a] rounded-lg bg-[#0d160d] p-3.5">
          <h3 className="text-[9px] font-semibold tracking-widest text-[#4e7050] uppercase mb-3">
            Guardian Integrity Proof
          </h3>

          {/* Verified badge */}
          <div className="flex items-center gap-1.5 mb-3 pb-3 border-b border-[#1a2e1a]">
            <CheckCircle size={14} className="text-[#00e87a]" />
            <span className="text-xs font-bold tracking-widest text-[#00e87a] uppercase">
              Verified
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex items-start justify-between gap-2">
              <span className="text-[10px] text-[#4e7050] flex-shrink-0">Proof Hash</span>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-mono text-[#dceadc]/80 text-right">
                  0x7e1b...c2d9f8e3a1b4
                </span>
                <button className="text-[#4e7050] hover:text-[#00e87a] transition-colors flex-shrink-0">
                  <Copy size={9} />
                </button>
              </div>
            </div>
            <div className="flex items-start justify-between gap-2">
              <span className="text-[10px] text-[#4e7050] flex-shrink-0">Verified At</span>
              <span className="text-[10px] font-mono text-[#dceadc]/80 text-right">
                May 24, 2025 14:32:22 UTC
              </span>
            </div>
            <div className="flex items-start justify-between gap-2">
              <span className="text-[10px] text-[#4e7050] flex-shrink-0">Guardian</span>
              <span className="text-[10px] font-mono text-[#dceadc]/80 text-right">
                Hermit v3.1.7
              </span>
            </div>
          </div>
        </section>

        {/* Arkiv Gate Route */}
        <section className="border border-[#1a2e1a] rounded-lg bg-[#0d160d] p-3.5">
          <h3 className="text-[9px] font-semibold tracking-widest text-[#4e7050] uppercase mb-3">
            Arkiv Gate Route
          </h3>

          <div className="flex items-center justify-between gap-1">
            {/* You */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-lg border border-[#1a2e1a] bg-[#0a130a] flex items-center justify-center">
                <User size={16} className="text-[#4e7050]" />
              </div>
              <span className="text-[9px] text-[#4e7050]">You</span>
            </div>

            <ArrowRight size={12} className="text-[#4e7050] flex-shrink-0" />

            {/* Arkiv Gate */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-lg border border-[#00e87a]/30 bg-[#00e87a]/5 flex items-center justify-center">
                <Box size={16} className="text-[#00e87a]" />
              </div>
              <span className="text-[9px] text-[#4e7050] text-center leading-tight">
                Arkiv Gate<br />braga
              </span>
            </div>

            <ArrowRight size={12} className="text-[#4e7050] flex-shrink-0" />

            {/* Storage Shard */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-lg border border-[#00e87a]/30 bg-[#00e87a]/5 flex items-center justify-center">
                <Layers size={16} className="text-[#00e87a]" />
              </div>
              <span className="text-[9px] text-[#4e7050] text-center leading-tight">
                Storage<br />Shard 7
              </span>
            </div>
          </div>
        </section>

        {/* Protection Verdict */}
        <section className="border border-[#00e87a]/30 rounded-lg bg-[#00e87a]/5 p-3.5">
          <h3 className="text-[9px] font-semibold tracking-widest text-[#4e7050] uppercase mb-2">
            Protection Verdict
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <Shield size={16} className="text-[#00e87a]" />
            <span className="text-sm font-bold tracking-widest text-[#00e87a] uppercase">
              Soul Secure
            </span>
          </div>
          <p className="text-[10px] text-[#4e7050] leading-relaxed">
            All integrity checks passed. Guardian monitoring active.
          </p>
        </section>

        {/* View Guardian Proofs button */}
        <button className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded border border-[#1a2e1a] text-xs font-semibold tracking-widest uppercase text-[#dceadc]/70 hover:text-[#dceadc] hover:border-[#2a3e2a] bg-[#0d160d] hover:bg-[#111f11] transition-colors">
          View Guardian Proofs
          <ExternalLink size={11} />
        </button>
      </div>
    </aside>
  )
}
