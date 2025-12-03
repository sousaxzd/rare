'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faReceipt, faArrowUp, faSignOutAlt, faPlug, faChevronDown, faChevronUp, faKey, faExternalLink, faXmark, faBullseye, faChartLine, faArrowDown, faExchange, faGear } from '@fortawesome/free-solid-svg-icons'
import { RippleButton } from './ripple-button'
import { Separator } from '@/components/ui/separator'
import { Logo } from './icons'
import { useAuth } from '@/hooks/useAuth'

interface SidebarDashboardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SidebarDashboard({ open, onOpenChange }: SidebarDashboardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { logout } = useAuth()
  // Abrir categoria Integrações se estiver em /dashboard/credentials
  const [docsExpanded, setDocsExpanded] = useState(pathname === '/dashboard/credentials')
  const [transferenciasExpanded, setTransferenciasExpanded] = useState(true)
  
  // Atualizar docsExpanded quando pathname mudar
  useEffect(() => {
    if (pathname === '/dashboard/credentials') {
      setDocsExpanded(true)
    }
  }, [pathname])

  const menuItems = [
    { id: 'inicio', label: 'Início', icon: faHome, href: '/dashboard' },
    { id: 'resumo', label: 'Resumo', icon: faChartLine, href: '/dashboard/summary' },
    { id: 'extrato', label: 'Extrato', icon: faReceipt, href: '/dashboard/transactions' },
    { id: 'metas', label: 'Metas', icon: faBullseye, href: '/dashboard/goals' },
  ]

  const transferenciasItems = [
    { id: 'transferir', label: 'Transferir', icon: faArrowUp, href: '/dashboard/transfer' },
    { id: 'depositar', label: 'Depositar', icon: faArrowDown, href: '/dashboard/deposit' },
  ]


  const handleLogout = async () => {
    await logout()
  }

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 lg:hidden z-40"
          onClick={() => onOpenChange(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-full lg:w-64 bg-background transition-all duration-300 z-50 flex flex-col ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo & Close Button */}
        <div className="h-14 flex items-center justify-between px-4 lg:px-6 border-b border-foreground/10">
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => router.push('/')}>
            <Logo size={38} width={38} height={38} />
            <div className="flex flex-col leading-[15px]">
              <span className="text-foreground/90 font-normal font-sans text-[13px]">
                Vision
              </span>
              <span className="text-foreground/60 font-normal font-sans text-[12px]">
                Wallet
              </span>
          </div>
        </div>
        
          {/* Close Button - Only visible on mobile */}
          <button
            onClick={() => onOpenChange(false)}
            className="lg:hidden p-2 rounded-md hover:bg-foreground/5 transition-colors"
            aria-label="Fechar menu"
          >
            <FontAwesomeIcon icon={faXmark} className="w-4 h-4 text-foreground" />
          </button>
        </div>

        {/* Menu Items */}
        <nav 
          className="flex-1 overflow-y-auto px-4 pt-2 pb-6 relative border-r border-foreground/10"
        >
          <div className="space-y-1">
            {/* Início */}
            <RippleButton
              onClick={() => router.push('/dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                pathname === '/dashboard'
                  ? 'bg-foreground/5 text-foreground'
                  : 'text-foreground/70 hover:text-foreground'
              }`}
            >
              <FontAwesomeIcon icon={faHome} className="w-4 h-4" />
              <span className="text-sm">Início</span>
            </RippleButton>
          </div>

          {/* Transferências */}
          <div className="space-y-2 mt-1">
            <button
              onClick={() => setTransferenciasExpanded(!transferenciasExpanded)}
              className="w-full flex items-center justify-between gap-2 px-4 py-2 rounded-md hover:bg-foreground/5 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faExchange} className="w-4 h-4 text-foreground/70" />
                <span className="text-foreground/70 font-medium text-sm">Transferências</span>
              </div>
              <FontAwesomeIcon 
                icon={transferenciasExpanded ? faChevronUp : faChevronDown} 
                className="w-3 h-3 text-foreground/40 transition-transform" 
              />
            </button>
            
            {transferenciasExpanded && (
              <div className="space-y-1 pl-4">
                {transferenciasItems.map((item) => {
                  const isActive = pathname === item.href

                  return (
                    <RippleButton
                      key={item.id}
                      onClick={() => router.push(item.href)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                        isActive
                          ? 'bg-foreground/5 text-foreground'
                          : 'text-foreground/70 hover:text-foreground'
                      }`}
                    >
                      <FontAwesomeIcon icon={item.icon} className="w-4 h-4" />
                      <span className="text-sm">{item.label}</span>
                    </RippleButton>
                  )
                })}
              </div>
            )}
          </div>

          {/* Outros itens do menu */}
          <div className="space-y-1 mt-1">
            {menuItems.filter(item => item.id !== 'inicio').map((item) => {
              const isActive = pathname === item.href

              return (
                <RippleButton
                  key={item.id}
                  onClick={() => router.push(item.href)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                    isActive
                      ? 'bg-foreground/5 text-foreground'
                      : 'text-foreground/70 hover:text-foreground'
                  }`}
                >
                  <FontAwesomeIcon icon={item.icon} className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </RippleButton>
              )
            })}
          </div>

          {/* Integrações */}
          <div className="space-y-2 mt-1">
            <button
              onClick={() => setDocsExpanded(!docsExpanded)}
              className="w-full flex items-center justify-between gap-2 px-4 py-2 rounded-md hover:bg-foreground/5 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faPlug} className="w-4 h-4 text-foreground/70" />
                <span className="text-foreground/70 font-medium text-sm">Integrações</span>
              </div>
              <FontAwesomeIcon 
                icon={docsExpanded ? faChevronUp : faChevronDown} 
                className="w-3 h-3 text-foreground/40 transition-transform" 
              />
            </button>
            
            {docsExpanded && (
              <div className="space-y-1 pl-4">
                <RippleButton
                  onClick={() => router.push('/dashboard/credentials')}
                  className={`w-full flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    pathname === '/dashboard/credentials'
                      ? 'bg-foreground/5 text-foreground'
                      : 'text-foreground/70 hover:text-foreground'
                  }`}
                >
                  <FontAwesomeIcon icon={faKey} className="w-4 h-4" />
                  <span className="text-sm">Credenciais</span>
                </RippleButton>
                
                <a
                  href="https://docs.visionwallet.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-2 px-4 py-2 rounded-md hover:bg-foreground/5 transition-colors group"
                >
                  <FontAwesomeIcon icon={faExternalLink} className="w-4 h-4 text-foreground/70" />
                  <span className="text-foreground/70 group-hover:text-foreground text-sm transition-colors">Ver Documentação</span>
                </a>
            </div>
            )}
          </div>

          {/* Configurações */}
          <div className="space-y-1 mt-1">
            <RippleButton
              onClick={() => router.push('/dashboard/settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                pathname === '/dashboard/settings'
                  ? 'bg-foreground/5 text-foreground'
                  : 'text-foreground/70 hover:text-foreground'
              }`}
            >
              <FontAwesomeIcon icon={faGear} className="w-4 h-4" />
              <span className="text-sm">Configurações</span>
            </RippleButton>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-r border-foreground/10">
          <Separator className="bg-foreground/10 mb-4" />
          <RippleButton 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-md text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4" />
            <span className="text-sm font-medium">Encerrar Sessão</span>
          </RippleButton>
        </div>
      </aside>
    </>
  )
}
