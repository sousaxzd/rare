/**
 * Funções de autenticação Discord
 */

export interface DiscordUser {
  id: string
  username: string
  discriminator: string
  avatar: string | null
  email?: string
}

/**
 * Obter usuário Discord do localStorage
 */
export function getDiscordUser(): DiscordUser | null {
  if (typeof window === 'undefined') return null
  
  try {
    const userStr = localStorage.getItem('discord_user')
    if (!userStr) return null
    return JSON.parse(userStr)
  } catch (error) {
    console.error('Erro ao carregar usuário Discord:', error)
    return null
  }
}

/**
 * Verificar se está autenticado
 */
export function isAuthenticated(): boolean {
  return !!getDiscordUser()
}

/**
 * Fazer logout
 */
export async function logout(): Promise<void> {
  try {
    await fetch('/api/auth/logout', { method: 'POST' })
  } catch (error) {
    console.error('Erro ao fazer logout:', error)
  } finally {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('discord_user')
    }
  }
}

/**
 * Construir URL do avatar Discord
 */
export function getDiscordAvatarUrl(user: DiscordUser): string {
  if (!user.avatar) {
    return `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator) % 5}.png`
  }
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`
}
