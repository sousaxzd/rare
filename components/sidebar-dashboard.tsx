'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faReceipt, faArrowUp, faSignOutAlt, faPlug, faKey, faExternalLink, faXmark, faBullseye, faChartLine, faArrowDown, faExchangeAlt, faGear, faLayerGroup, faWrench } from '@fortawesome/free-solid-svg-icons'
import { faDiscord } from '@fortawesome/free-brands-svg-icons'
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

  const categories = [
    {
      title: 'Plataforma',
      icon: faLayerGroup,
      items: [
        { id: 'inicio', label: 'Início', icon: faHome, href: '/dashboard' },
        { id: 'resumo', label: 'Resumo', icon: faChartLine, href: '/dashboard/summary' },
        { id: 'extrato', label: 'Extrato', icon: faReceipt, href: '/dashboard/transactions' },
        { id: 'metas', label: 'Metas', icon: faBullseye, href: '/dashboard/goals' },
      ]
    },
    {
      title: 'Transações',
      icon: faExchangeAlt,
      items: [
        { id: 'transferir', label: 'Transferir', icon: faArrowUp, href: '/dashboard/transfer' },
        { id: 'depositar', label: 'Depositar', icon: faArrowDown, href: '/dashboard/deposit' },
      ]
    },
    {
      title: 'Integrações',
      icon: faPlug,
      items: [
        { id: 'credenciais', label: 'Credenciais', icon: faKey, href: '/dashboard/credentials' },
        { id: 'docs', label: 'Ver Documentação', icon: faExternalLink, href: 'https://docs.visionwallet.com.br', external: true },
      ]
    },
    {
      title: 'Ajustes',
      icon: faWrench,
      items: [
        { id: 'config', label: 'Configurações', icon: faGear, href: '/dashboard/settings' },
      ]
    }
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
        className={`fixed lg:static inset-y-0 left-0 w-full lg:w-64 bg-background transition-all duration-300 z-50 flex flex-col ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
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
          className="flex-1 overflow-y-auto px-4 pt-4 pb-6 relative border-r border-foreground/10 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {categories.map((category) => (
            <div key={category.title} className="space-y-1">
              <div className="px-4 mb-2 flex items-center gap-2 text-xs font-semibold text-foreground/50 uppercase tracking-wider">
                <FontAwesomeIcon icon={category.icon} className="w-3 h-3" />
                <span>{category.title}</span>
              </div>

              {category.items.map((item) => {
                const isActive = pathname === item.href

                if (item.external) {
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-foreground/5 transition-colors group text-foreground/70 hover:text-foreground rounded-xl"
                    >
                      <FontAwesomeIcon icon={item.icon} className="w-4 h-4" />
                      <span>{item.label}</span>
                    </a>
                  )
                }

                return (
                  <RippleButton
                    key={item.id}
                    onClick={() => router.push(item.href)}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-all relative group rounded-xl ${isActive
                      ? 'text-primary font-medium'
                      : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5'
                      }`}
                  >
                    {isActive && (
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 h-5 w-1 border-2 border-primary border-r-0 rounded-l-full bg-transparent" />
                    )}
                    <FontAwesomeIcon icon={item.icon} className="w-4 h-4" />
                    <span>{item.label}</span>
                  </RippleButton>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-r border-foreground/10 space-y-2">
          <Separator className="bg-foreground/10 mb-2" />

          <a
            href="https://discord.gg/SQCM6GXC27"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-foreground/70 hover:text-[#5865F2] hover:bg-[#5865F2]/10 transition-colors"
          >
            <FontAwesomeIcon icon={faDiscord} className="w-4 h-4" />
            <span className="text-sm font-medium">Entrar no Discord</span>
          </a>

          <RippleButton
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4" />
            <span className="text-sm font-medium">Encerrar Sessão</span>
          </RippleButton>
        </div>
      </aside>
    </>
  )
}
