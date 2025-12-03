'use client'

import { useState } from 'react'
import { SidebarDashboard } from '@/components/sidebar-dashboard'
import { DashboardTopbar } from '@/components/dashboard-topbar'
import { DashboardHeader } from '@/components/dashboard-header'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGift, faEnvelope, faCode, faRocket } from '@fortawesome/free-solid-svg-icons'
import { RippleButton } from '@/components/ripple-button'

const rewards = [
  { value: 10000, label: 'R$ 10.000', formatted: 'Pulseira Vision' },
  { value: 30000, label: 'R$ 30.000', formatted: 'Placa 30 Mil' },
  { value: 50000, label: 'R$ 50.000', formatted: 'Placa 50 Mil' },
  { value: 100000, label: 'R$ 100.000', formatted: 'Placa 100 Mil' },
  { value: 500000, label: 'R$ 500.000', formatted: 'Placa 500 Mil' },
  { value: 1000000, label: 'R$ 1.000.000', formatted: 'Placa 1 Milhão' },
  { value: 5000000, label: 'R$ 5.000.000', formatted: 'Placa 5 Milhões' },
  { value: 10000000, label: 'R$ 10.000.000', formatted: 'Placa 10 Milhões' },
]

export default function GoalsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-background">
      <SidebarDashboard open={sidebarOpen} onOpenChange={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardTopbar onOpenSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main data-dashboard className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8">
            <DashboardHeader />

            {/* Banner de Desenvolvimento */}
            <div className="mt-6 border border-primary/30 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 p-8 backdrop-blur-sm">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center">
                  <FontAwesomeIcon icon={faCode} className="text-primary w-10 h-10" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Página em Desenvolvimento
                  </h2>
                  <p className="text-foreground/70 max-w-2xl">
                    Estamos trabalhando para trazer um sistema completo de metas e premiações. 
                    Em breve você poderá acompanhar seu progresso e conquistar recompensas incríveis!
                  </p>
                </div>
              </div>
            </div>

            {/* Lista de Premiações */}
            <div className="mt-6">
              <div className="flex items-center gap-3 mb-6">
                <FontAwesomeIcon icon={faGift} className="text-primary w-6 h-6" />
                <h2 className="text-xl font-bold text-foreground">Premiações Disponíveis</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {rewards.map((reward, index) => (
                  <div
                    key={reward.value}
                    className="border border-foreground/10 rounded-lg p-6 bg-foreground/5 hover:bg-foreground/10 transition-colors"
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground mb-1">
                          {reward.formatted}
                        </p>
                        <p className="text-sm text-foreground/60">
                          {reward.label}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Aviso de Contato */}
            <div className="mt-6 border border-foreground/10 rounded-xl bg-foreground/2 backdrop-blur-sm p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                  <FontAwesomeIcon icon={faRocket} className="text-primary w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Alcançou uma meta antes do lançamento?
                  </h3>
                  <p className="text-foreground/70 mb-4">
                    Se você já alcançou alguma dessas metas antes do lançamento oficial desta página, 
                    entre em contato com nosso suporte para garantir que sua premiação seja registrada corretamente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
