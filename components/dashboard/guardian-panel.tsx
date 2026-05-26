'use client'

import Image from 'next/image'
import { CheckCircle, Copy, ArrowRight, Shield, User, ExternalLink, Layers, Box } from 'lucide-react'
import { useDashboard } from './dashboard-context'

export function GuardianPanel() {
  const { copyToClipboard, setProofModal } = useDashboard()

  return (
    <aside className="w-[284px] min-w-[284px] h-full flex flex-col border-l border-[#162816] bg-[#07100a] overflow-y-auto">

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#162816]">
        <div className="w-8 h-8 rounded-md overflow-hidden border border-[#162816] flex-shrink-0 relative">
          <Image
            src="/hermit.jpg"
            alt="Hermit guardian"
            width={32}
            height={32}
            className="w-full h-full object-cover"
          />
          {/* Guardian glow */}
          <div className="absolute inset-0 rounded-md ring-1 ring-inset ring-[#38bdf8]/20" />
        </div>
        <div>
          <h2 className="text-[11px] font-bold tracking-[0.12em] text-[#d4e8d4] uppercase">
            Hermit Guardian
          </h2>
          <p className="text-[9px] text-[#38bdf8]">Active &bull; v3.1.7</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-3.5">

        {/* Guardian Integrity Proof */}
        <section className="border border-[#162816] rounded-lg bg-[#0b1510] p-3.5">
          <h3 className="text-[9px] font-bold tracking-[0.15em] text-[#3d6040] uppercase mb-3">
            Guardian Integrity Proof
          </h3>

          {/* Verified badge */}
          <div className="flex items-center gap-1.5 mb-3 pb-3 border-b border-[#162816]">
            <CheckCircle size={13} className="text-[#00f080]" />
            <span className="text-[11px] font-bold tracking-[0.1em] text-[#00f080] uppercase">
              Verified
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <span className="text-[9px] text-[#3d6040] flex-shrink-0">Proof Hash</span>
              <div className="flex items-center gap-1">
                <span className="text-[9px] font-mono text-[#d4e8d4]/70 text-right">
                  0x7e1b...c2d9f8e3a1b4
                </span>
                <button
                  onClick={() => copyToClipboard('0x7e1bc2d9f8e3a1b4', 'Proof hash')}
                  className="text-[#3d6040] hover:text-[#00f080] transition-colors flex-shrink-0"
                >
                  <Copy size={9} />
                </button>
              </div>
            </div>
            <div className="flex items-start justify-between gap-2">
              <span className="text-[9px] text-[#3d6040] flex-shrink-0">Verified At</span>
              <span className="text-[9px] font-mono text-[#d4e8d4]/70 text-right">
                May 24, 2025 14:32:22 UTC
              </span>
            </div>
            <div className="flex items-start justify-between gap-2">
              <span className="text-[9px] text-[#3d6040] flex-shrink-0">Guardian</span>
              <span className="text-[9px] font-mono text-[#d4e8d4]/70 text-right">
                Hermit v3.1.7
              </span>
            </div>
          </div>
        </section>

        {/* Arkiv Gate Route */}
        <section className="border border-[#162816] rounded-lg bg-[#0b1510] p-3.5">
          <h3 className="text-[9px] font-bold tracking-[0.15em] text-[#3d6040] uppercase mb-3">
            Arkiv Gate Route
          </h3>

          <div className="flex items-center justify-between gap-1">
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-lg border border-[#162816] bg-[#060b06] flex items-center justify-center">
                <User size={15} className="text-[#3d6040]" />
              </div>
              <span className="text-[9px] text-[#3d6040]">You</span>
            </div>

            <ArrowRight size={11} className="text-[#3d6040] flex-shrink-0" />

            <div className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-lg border border-[#00f080]/20 bg-[#00f080]/5 flex items-center justify-center">
                <Box size={15} className="text-[#00f080]" />
              </div>
              <span className="text-[9px] text-[#3d6040] text-center leading-tight">
                Arkiv Gate<br />braga
              </span>
            </div>

            <ArrowRight size={11} className="text-[#3d6040] flex-shrink-0" />

            <div className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-lg border border-[#00f080]/20 bg-[#00f080]/5 flex items-center justify-center">
                <Layers size={15} className="text-[#00f080]" />
              </div>
              <span className="text-[9px] text-[#3d6040] text-center leading-tight">
                Storage<br />Shard 7
              </span>
            </div>
          </div>
        </section>

        {/* Protection Verdict */}
        <section className="relative border border-[#00f080]/25 rounded-lg bg-[#00f080]/5 p-3.5 overflow-hidden">
          {/* Glow */}
          <div className="absolute inset-0 bg-[#00f080]/3 rounded-lg" />
          <div className="relative">
            <h3 className="text-[9px] font-bold tracking-[0.15em] text-[#3d6040] uppercase mb-2">
              Protection Verdict
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <Shield size={15} className="text-[#00f080]" />
              <span className="text-[13px] font-bold tracking-[0.1em] text-[#00f080] uppercase neon-glow-text">
                Soul Secure
              </span>
            </div>
            <p className="text-[10px] text-[#3d6040] leading-relaxed">
              All integrity checks passed. Guardian monitoring active.
            </p>
          </div>
        </section>

        {/* View Guardian Proofs */}
        <button
          onClick={() => setProofModal(true)}
          className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-md border border-[#162816] text-[10px] font-bold tracking-[0.12em] uppercase text-[#d4e8d4]/60 hover:text-[#d4e8d4] hover:border-[#1e3c1e] bg-[#0b1510] hover:bg-[#0d180d] active:scale-[0.98] transition-all duration-150"
        >
          View Guardian Proofs
          <ExternalLink size={10} />
        </button>
      </div>
    </aside>
  )
}
