import { DashboardProvider } from '@/components/dashboard/dashboard-context'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'
import { GuardianPanel } from '@/components/dashboard/guardian-panel'
import { MainContent } from '@/components/dashboard/main-content'
import { ToastContainer } from '@/components/dashboard/toast-container'
import { BackupModal, ReviveModal, ProofModal } from '@/components/dashboard/modals'

export default function DashboardPage() {
  return (
    <DashboardProvider>
      <div className="flex h-screen overflow-hidden bg-[#080d08]">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Main area */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {/* Top Header */}
          <Header />

          {/* Content row */}
          <div className="flex flex-1 min-h-0 overflow-hidden">
            {/* Center scrollable content */}
            <main className="flex-1 overflow-y-auto p-4 min-w-0">
              <div className="flex flex-col gap-4 max-w-full">
                <MainContent />
              </div>
            </main>

            {/* Right panel */}
            <GuardianPanel />
          </div>
        </div>
      </div>

      {/* Global overlays */}
      <BackupModal />
      <ReviveModal />
      <ProofModal />
      <ToastContainer />
    </DashboardProvider>
  )
}
