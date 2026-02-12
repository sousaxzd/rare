'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faChevronUp, 
  faRightFromBracket,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '@/hooks/useAuth'
import { Skeleton } from '@/components/ui/skeleton'
import { RippleButton } from '@/components/ripple-button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function UserMenu() {
  const { user, loading, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (loading) {
    return (
      <Skeleton className="rounded-md">
        <div className="w-8 h-8 rounded-md bg-foreground/10" />
      </Skeleton>
    )
  }

  if (!user) {
    return (
      <Link href="/login">
        <RippleButton className="px-5 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm inline-flex items-center gap-2">
          <FontAwesomeIcon icon={faUser} className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Iniciar sessão</span>
          <span className="sm:hidden">Entrar</span>
        </RippleButton>
      </Link>
    )
  }

  const getDiscordAvatarUrl = () => {
    if (!user.avatar) {
      return `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator) % 5}.png`
    }
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`
  }

  const handleLogout = async () => {
    await logout()
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <Avatar className="h-9 w-9 rounded-full">
            <AvatarImage 
              src={getDiscordAvatarUrl()} 
              alt={user.username}
            />
            <AvatarFallback className="bg-primary/20 text-primary rounded-full text-xs">
              {user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-medium text-foreground leading-tight">
              {user.username}
            </span>
            <span className="text-xs text-foreground/50 leading-tight">
              @{user.username}
            </span>
          </div>
          <FontAwesomeIcon
            icon={faChevronUp}
            className={`hidden md:block text-xs transition-transform duration-200 text-foreground/60 ${
              isOpen ? 'rotate-0' : 'rotate-180'
            }`}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-background border border-foreground/10"
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 rounded-full">
              <AvatarImage 
                src={getDiscordAvatarUrl()} 
                alt={user.username}
              />
              <AvatarFallback className="bg-primary/20 text-primary rounded-full text-xs">
                {user.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-0.5">
              <p className="text-sm font-medium leading-none text-foreground truncate max-w-[150px]">
                {user.username}
              </p>
              <p className="text-xs leading-none text-foreground/50 truncate max-w-[150px]">
                @{user.username}
              </p>
              {user.email && (
                <p className="text-xs leading-none text-foreground/40 truncate max-w-[150px] mt-1">
                  {user.email}
                </p>
              )}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-500/5 hover:bg-red-500/5"
        >
          <FontAwesomeIcon icon={faRightFromBracket} className="w-4 h-4 mr-2 text-red-500" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
