'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown, faTrophy, faUsers } from '@fortawesome/free-solid-svg-icons'

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
  '1033809425946919093'
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

export default function HistoriaPage() {
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online'
      case 'idle': return 'Ausente'
      case 'dnd': return 'Não Perturbe'
      default: return 'Offline'
    }
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20 mb-6">
            <FontAwesomeIcon icon={faCrown} className="text-[#FFD700] text-xl" />
            <span className="text-[#FFD700] font-semibold">As Raridades do MushMC</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-6">
            Nossa História
          </h1>
          
          <p className="text-xl text-foreground/60 max-w-3xl mx-auto leading-relaxed">
            A jornada de jovens visionários que decidiram conquistar o impossível
          </p>
        </motion.div>

        {/* Story Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-invert prose-lg max-w-none mb-20"
        >
          {/* Chapter 1 */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#FFD700]/20 flex items-center justify-center">
                <span className="text-[#FFD700] font-bold text-xl">I</span>
              </div>
              <h2 className="text-3xl font-bold text-foreground m-0">O Início de Tudo</h2>
            </div>
            
            <div className="space-y-6 text-foreground/80 leading-relaxed">
              <p className="text-lg">
                Era uma vez, no vasto universo do <span className="text-[#FFD700] font-semibold">MushMC</span>, jovens que compartilhavam mais do que apenas a paixão por jogos. Eles compartilhavam um sonho audacioso: <span className="text-foreground font-semibold">dominar o cenário competitivo e criar um legado que seria lembrado por gerações</span>.
              </p>
              
              <p className="text-lg">
                Não eram apenas jogadores comuns. Eram estrategistas, visionários, líderes natos. Enquanto outros se contentavam em participar, eles queriam <span className="text-[#FFD700] font-semibold">conquistar</span>. Enquanto outros sonhavam pequeno, eles enxergavam o topo da montanha.
              </p>
              
              <p className="text-lg">
                A ideia surgiu em uma noite comum, durante uma sessão épica de BedWars. Entre risadas, estratégias e vitórias consecutivas, nasceu uma pergunta que mudaria tudo: <span className="text-foreground italic">"E se nós não apenas jogássemos... mas possuíssemos os clãs mais prestigiados do servidor?"</span>
              </p>
            </div>
          </div>

          {/* Chapter 2 */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#FFD700]/20 flex items-center justify-center">
                <span className="text-[#FFD700] font-bold text-xl">II</span>
              </div>
              <h2 className="text-3xl font-bold text-foreground m-0">A Primeira Conquista</h2>
            </div>
            
            <div className="space-y-6 text-foreground/80 leading-relaxed">
              <p className="text-lg">
                O que parecia impossível para muitos, para eles era apenas o primeiro passo. Com determinação inabalável e recursos combinados, adquiriram seu primeiro <span className="text-[#FFD700] font-semibold">clã dourado</span>. Não era apenas um símbolo de status — era a prova de que sonhos grandes exigem ações grandes.
              </p>
              
              <p className="text-lg">
                Mas um clã não era suficiente. A ambição crescia a cada vitória, a cada membro que se juntava à causa, a cada torneio conquistado. <span className="text-foreground font-semibold">Eles não queriam ser apenas parte da elite. Queriam SER a elite</span>.
              </p>
              
              <div className="bg-[#FFD700]/5 border-l-4 border-[#FFD700] p-6 rounded-r-lg my-8">
                <p className="text-foreground/90 italic text-xl m-0">
                  "Não jogamos para participar. Jogamos para dominar. E quando dominamos, conquistamos."
                </p>
              </div>
            </div>
          </div>

          {/* Chapter 3 */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#FFD700]/20 flex items-center justify-center">
                <span className="text-[#FFD700] font-bold text-xl">III</span>
              </div>
              <h2 className="text-3xl font-bold text-foreground m-0">O Império Cresce</h2>
            </div>
            
            <div className="space-y-6 text-foreground/80 leading-relaxed">
              <p className="text-lg">
                Um clã se tornou dois. Dois se tornaram três. E quando todos achavam que já era suficiente, eles adquiriram o quarto. <span className="text-[#FFD700] font-semibold">Quatro clãs dourados</span> sob o comando de três visionários. Algo nunca visto antes no MushMC.
              </p>
              
              <p className="text-lg">
                Cada clã tinha sua identidade, sua força, sua comunidade. A <span className="text-foreground font-semibold">LIGHT</span>, com sua tradição e excelência. A <span className="text-foreground font-semibold">CHK</span>, com sua moral de campeões. A <span className="text-foreground font-semibold">HAIL</span>, com sua tecnologia e inovação. A <span className="text-foreground font-semibold">JEME</span>, com seu histórico de elite.
              </p>
              
              <p className="text-lg">
                Mas não eram clãs separados. Eram <span className="text-[#FFD700] font-semibold">um império unificado</span>, uma rede de excelência onde os melhores jogadores se reuniam, treinavam e conquistavam juntos.
              </p>
            </div>
          </div>

          {/* Chapter 4 */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#FFD700]/20 flex items-center justify-center">
                <span className="text-[#FFD700] font-bold text-xl">IV</span>
              </div>
              <h2 className="text-3xl font-bold text-foreground m-0">O Legado Continua</h2>
            </div>
            
            <div className="space-y-6 text-foreground/80 leading-relaxed">
              <p className="text-lg">
                Hoje, quando novos jogadores entram no MushMC e perguntam sobre os clãs mais prestigiados, um nome ressoa: <span className="text-[#FFD700] font-bold text-2xl">Rare - As Raridades do Mush</span>. Não é apenas um grupo. É um movimento. Uma filosofia. Um padrão de excelência.
              </p>
              
              <p className="text-lg">
                Mais de <span className="text-[#FFD700] font-semibold">800 membros</span> fazem parte desta família. Torneios conquistados. Recordes quebrados. Lendas criadas. E o mais importante: <span className="text-foreground font-semibold">a jornada está apenas começando</span>.
              </p>
              
              <p className="text-lg">
                Porque para esses visionários, quatro clãs dourados não é o fim. É apenas o começo de algo muito maior. O objetivo? <span className="text-[#FFD700] font-semibold">Todos os clãs dourados do MushMC</span>. E quando você conhece a história deles, você sabe que não é questão de "se", mas de "quando".
              </p>
              
              <div className="bg-gradient-to-r from-[#FFD700]/10 to-transparent border border-[#FFD700]/20 p-8 rounded-lg my-8">
                <p className="text-foreground text-2xl font-bold m-0 mb-4">
                  Rare não é sobre ser o melhor.
                </p>
                <p className="text-foreground/80 text-xl m-0">
                  É sobre redefinir o que "melhor" significa.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
        >
          <div className="bg-background border border-foreground/10 rounded-2xl p-8 text-center">
            <FontAwesomeIcon icon={faCrown} className="text-[#FFD700] text-4xl mb-4" />
            <div className="text-5xl font-bold text-foreground mb-2">4</div>
            <div className="text-foreground/60">Clãs Dourados</div>
          </div>
          
          <div className="bg-background border border-foreground/10 rounded-2xl p-8 text-center">
            <FontAwesomeIcon icon={faUsers} className="text-[#FFD700] text-4xl mb-4" />
            <div className="text-5xl font-bold text-foreground mb-2">800+</div>
            <div className="text-foreground/60">Membros Ativos</div>
          </div>
          
          <div className="bg-background border border-foreground/10 rounded-2xl p-8 text-center">
            <FontAwesomeIcon icon={faTrophy} className="text-[#FFD700] text-4xl mb-4" />
            <div className="text-5xl font-bold text-foreground mb-2">∞</div>
            <div className="text-foreground/60">Vitórias Conquistadas</div>
          </div>
        </motion.div>

        {/* Founders Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Os Fundadores</h2>
            <p className="text-foreground/60 text-lg">
              Os visionários por trás do império
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD700]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
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
                        {/* Status Indicator - Discord Style */}
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
                      
                      {/* Badges - Horizontal */}
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
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
