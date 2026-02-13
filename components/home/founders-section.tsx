'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface DiscordUser {
  id: string
  username: string
  discriminator: string
  globalName: string | null
  avatar: string | null
  banner: string | null
  accentColor: number | null
  badges: string[]
  status: string
  activities: Array<{
    name: string
    type: number
    details: string | null
    state: string | null
  }>
  spotify: {
    song: string
    artist: string
    albumArtUrl: string
  } | null
}

const FOUNDERS = [
  '274968360306081794',
  '605916743675805696',
  '924123297334046730',
  '808757023029985301',
  '1033809425946919093',
  '1136451036404523041',
  '1441813507585871892',
  '1423705287956758703',
  '1189313766731554876'
]

const BADGE_ICONS: Record<string, string> = {
  'Staff': 'https://cdn.discordapp.com/badge-icons/5e74e9b61934fc1f67c65515d1f7e60d.png',
  'Partner': 'https://cdn.discordapp.com/badge-icons/3f9748e53446a137a052f3454e2de41e.png',
  'HypeSquad Events': 'https://cdn.discordapp.com/badge-icons/bf01d1073931f921909045f3a39fd264.png',
  'HypeSquad Bravery': 'https://cdn.discordapp.com/badge-icons/8a88d63823d8a71cd5e390baa45efa02.png',
  'HypeSquad Brilliance': 'https://cdn.discordapp.com/badge-icons/011940fd013da3f7fb926e4a1cd2e618.png',
  'HypeSquad Balance': 'https://cdn.discordapp.com/badge-icons/3aa41de486fa12454c3761e8e223442e.png',
  'Early Supporter': 'https://cdn.discordapp.com/badge-icons/7060786766c9c840eb3019e725d2b358.png',
  'Verified Bot Developer': 'https://cdn.discordapp.com/badge-icons/6df5892e0f35b051f8b61eace34f4967.png',
  'Active Developer': 'https://cdn.discordapp.com/badge-icons/6bdc42827a38498929a4920da12695d9.png',
  'Bug Hunter Level 1': 'https://cdn.discordapp.com/badge-icons/2717692c7dca7289b35297368a940dd0.png',
  'Bug Hunter Level 2': 'https://cdn.discordapp.com/badge-icons/848f79194d4be5ff5f81505cbd0ce1e6.png',
  'Nitro': 'https://cdn.discordapp.com/badge-icons/2ba85e8026a8614b640c2837bcdfe21b.png',
  'Server Boosting': 'https://cdn.discordapp.com/badge-icons/ec92202290b48d0879b7413d2dde3bab.png',
}

export function FoundersSection() {
  const [users, setUsers] = useState<Record<string, DiscordUser>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFounders()
  }, [])

  const loadFounders = async () => {
    setLoading(true)
    try {
      const userData: Record<string, DiscordUser> = {}
      
      for (const userId of FOUNDERS) {
        try {
          const response = await fetch(`/api/discord/user/${userId}`)
          if (response.ok) {
            const data = await response.json()
            userData[userId] = data
          }
        } catch (error) {
          console.error(`Erro ao carregar usuário ${userId}:`, error)
        }
      }
      
      setUsers(userData)
    } finally {
      setLoading(false)
    }
  }

  const getAvatarUrl = (user: DiscordUser) => {
    if (!user.avatar) return 'https://cdn.discordapp.com/embed/avatars/0.png'
    const extension = user.avatar.startsWith('a_') ? 'gif' : 'png'
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${extension}?size=256`
  }

  const getBannerUrl = (user: DiscordUser) => {
    if (!user.banner) return null
    const extension = user.banner.startsWith('a_') ? 'gif' : 'png'
    return `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.${extension}?size=600`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'idle': return 'bg-yellow-500'
      case 'dnd': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">Os Fundadores</h2>
          <p className="text-foreground/60 text-lg">
            Os visionários por trás do império
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD700]"></div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          >
            {FOUNDERS.map(userId => {
              const user = users[userId]
              if (!user) return null
              
              const bannerUrl = getBannerUrl(user)
              const displayName = user.globalName || user.username
              const defaultBanner = 'https://cdn.discordapp.com/attachments/1469478776206393345/1471283645716107526/New-Project_2__1_.png?ex=698e5f2c&is=698d0dac&hm=556127ec08971cc94abfeb7a4e6f82a997d9c49ca662bd3b9d9791bbffb1140a&'
              
              return (
                <div key={userId} className="group relative overflow-hidden rounded-2xl bg-background border border-foreground/10 hover:border-[#FFD700]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#FFD700]/10">
                  {/* Banner */}
                  <div className="relative h-24 overflow-hidden bg-gradient-to-br from-[#FFD700]/20 to-[#FFD700]/5">
                    {bannerUrl ? (
                      <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                    ) : user.accentColor ? (
                      <div 
                        className="w-full h-full" 
                        style={{ backgroundColor: `#${user.accentColor.toString(16).padStart(6, '0')}` }}
                      />
                    ) : (
                      <img src={defaultBanner} alt="Banner" className="w-full h-full object-cover" />
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="absolute top-16 left-1/2 -translate-x-1/2">
                    <div className="relative w-20 h-20 rounded-full border-4 border-background overflow-hidden shadow-xl">
                      <img src={getAvatarUrl(user)} alt={displayName} className="w-full h-full object-cover" />
                      {/* Status Indicator */}
                      <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-[3px] border-background ${getStatusColor(user.status)}`} />
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30 backdrop-blur-sm">
                      FUNDADOR
                    </span>
                  </div>

                  {/* Content */}
                  <div className="pt-14 pb-4 px-4 text-center">
                    <h4 className="text-foreground font-bold text-base mb-1 truncate">
                      {displayName}
                    </h4>
                    <p className="text-foreground/60 text-xs mb-3 truncate">
                      @{user.username}
                    </p>
                    
                    {/* Custom Status */}
                    {user.activities.find(a => a.type === 4) && (
                      <div className="mb-2 p-2 rounded-lg bg-foreground/5 border border-foreground/10">
                        <p className="text-xs text-foreground/80 truncate">
                          {user.activities.find(a => a.type === 4)?.state}
                        </p>
                      </div>
                    )}
                    
                    {/* Playing */}
                    {user.activities.filter(a => a.type === 0).length > 0 && (
                      <div className="mb-2 p-2 rounded-lg bg-foreground/5 border border-foreground/10">
                        <p className="text-[10px] text-foreground/50 mb-0.5">Jogando</p>
                        <p className="text-xs text-foreground font-medium truncate">{user.activities.filter(a => a.type === 0)[0].name}</p>
                      </div>
                    )}

                    {/* Spotify */}
                    {user.spotify && (
                      <div className="mb-2 p-2 rounded-lg bg-[#1DB954]/10 border border-[#1DB954]/20">
                        <p className="text-[10px] text-[#1DB954] mb-0.5">Spotify</p>
                        <p className="text-xs text-foreground font-medium truncate">{user.spotify.song}</p>
                      </div>
                    )}
                    
                    {/* Badges */}
                    {user.badges.length > 0 && (
                      <div className="flex flex-wrap gap-1 justify-center mt-2">
                        {user.badges.slice(0, 4).map((badge, index) => {
                          const iconUrl = BADGE_ICONS[badge]
                          return iconUrl ? (
                            <div key={index} className="relative group/badge">
                              <img 
                                src={iconUrl} 
                                alt={badge}
                                className="w-5 h-5 hover:scale-110 transition-transform"
                                title={badge}
                              />
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-background/95 border border-foreground/10 rounded text-[10px] text-foreground whitespace-nowrap opacity-0 group-hover/badge:opacity-100 transition-opacity pointer-events-none z-10">
                                {badge}
                              </div>
                            </div>
                          ) : null
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </motion.div>
        )}
      </div>
    </section>
  )
}
