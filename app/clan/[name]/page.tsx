'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown, faShield, faUsers, faExternalLink, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

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
    applicationId: string | null
    timestamps: any
    assets: any
  }>
  spotify: {
    trackId: string
    song: string
    artist: string
    album: string
    albumArtUrl: string
    timestamps: any
  } | null
  kv: Record<string, any>
}

interface MushPlayer {
  nick: string
  rank: string
  tag: string
  medal: string
  accountType: string
  online: boolean
  clan: string
  skinUrl: string
}

const OWNERS = ['274968360306081794']
const SUBS = ['605916743675805696', '924123297334046730', '808757023029985301']

const CHK_OWNER = ['1033809425946919093']
const HAIL_OWNER = ['924123297334046730']

// Conteúdo específico de cada clã
const CLAN_CONTENT: Record<string, {
  title: string
  subtitle: string
  description: JSX.Element
  quote: string
  quoteAuthor: string
}> = {
  'light': {
    title: 'Construído para durar',
    subtitle: 'História',
    description: (
      <>
        <p className="text-lg text-foreground/80 leading-relaxed">
          A <span className="text-foreground font-semibold">LIGHT</span> não foi criada para ser mais um clã. Foi criada para ser o clã.
        </p>
        <p className="text-lg text-foreground/60 leading-relaxed">
          Antes de existirmos, a SPY dominou. Seus membros aprenderam que seletividade não é elitismo — é sobrevivência. Quando ela acabou, a visão permaneceu.
        </p>
        <p className="text-lg text-foreground/60 leading-relaxed">
          Seis jogadores. Um objetivo: provar que qualidade supera quantidade. Hoje, com requisitos de <span className="text-[#FFD700] font-medium">15 FKDR</span> e <span className="text-[#FFD700] font-medium">nível 30</span>, continuamos filtrando. Continuamos vencendo.
        </p>
      </>
    ),
    quote: 'Não jogamos para participar. Jogamos para vencer.',
    quoteAuthor: 'Light Clan'
  },
  'chk': {
    title: 'Forjados na vitória',
    subtitle: 'História',
    description: (
      <>
        <p className="text-lg text-foreground/80 leading-relaxed">
          A <span className="text-foreground font-semibold">CHK</span> não foi criada para ser mais um clã. Foi criada para <span className="text-[#FFD700] font-bold">DOMINAR</span>.
        </p>
        <p className="text-lg text-foreground/60 leading-relaxed">
          Nascida no coração do <span className="text-foreground font-semibold">MushMC</span>, a CHK carrega a moral de quem conquistou o <span className="text-[#FFD700] font-medium">7º Torneio</span>. Não somos apenas jogadores — somos campeões que provaram que determinação e união superam qualquer adversário.
        </p>
        <p className="text-lg text-foreground/60 leading-relaxed">
          Mais de <span className="text-[#FFD700] font-medium">800 membros</span> conectados pela mesma paixão. Uma comunidade onde os laços são forjados na vitória e o jogo é levado a sério. Aqui, você não entra apenas em um servidor — você entra em uma <span className="text-foreground font-semibold">família</span>.
        </p>
      </>
    ),
    quote: 'Não jogamos para participar. Jogamos para dominar.',
    quoteAuthor: 'CHK'
  },
  'hail': {
    title: 'Dominando o competitivo',
    subtitle: 'História',
    description: (
      <>
        <p className="text-lg text-foreground/80 leading-relaxed">
          A <span className="text-foreground font-semibold">HAIL</span> é campeã do <span className="text-[#FFD700] font-bold">CLAN CLASH — Bed Wars (8ª Edição)</span> do <span className="text-foreground font-semibold">MushMC</span>. Criada com o objetivo de dominar a área competitiva, somos mais que um clã — somos uma máquina de vitórias.
        </p>
        <p className="text-lg text-foreground/60 leading-relaxed">
          Com <span className="text-[#FFD700] font-medium">ambiente 100% focado</span> em performance e evolução constante, desenvolvemos tecnologia exclusiva: bot próprio de X-Treino e estatísticas integradas ao MushMC. Nosso sistema de progressão oferece cargos exclusivos baseados em WINSTREAK e habilidade.
        </p>
        <p className="text-lg text-foreground/60 leading-relaxed">
          Comunidade ativa com sorteios mensais, parcerias estratégicas e chats totalmente interativos. Modalidades competitivas incluem <span className="text-[#FFD700] font-medium">X-Treinos Apostados</span> e <span className="text-[#FFD700] font-medium">Clan x Clan (CXC)</span>, onde estratégia e força do grupo se encontram.
        </p>
      </>
    ),
    quote: 'Onde a estratégia e a força do grupo se encontram.',
    quoteAuthor: 'HAIL'
  },
  'jeme': {
    title: 'História de peso',
    subtitle: 'História',
    description: (
      <>
        <p className="text-lg text-foreground/80 leading-relaxed">
          A <span className="text-foreground font-semibold">JEME</span> foi o <span className="text-[#FFD700] font-bold">2º clã a vencer a 2ª edição do torneio de HG</span> do <span className="text-foreground font-semibold">MushMC</span>, e nossa história está apenas começando.
        </p>
        <p className="text-lg text-foreground/60 leading-relaxed">
          Hoje, expandimos nossos horizontes e estamos atuando em diversas áreas além do HG, criando um ecossistema focado em <span className="text-[#FFD700] font-medium">integração e diversão</span>. Com organização impecável, servidor estruturado com canais claros e moderação ativa.
        </p>
        <p className="text-lg text-foreground/60 leading-relaxed">
          Sorteios frequentes de itens e vips, ambiente perfeito para encontrar seu próximo duo ou squad. Venha jogar com quem entende de competição e fazer parte desta família que não para de crescer.
        </p>
      </>
    ),
    quote: 'Venha jogar com quem entende de competição.',
    quoteAuthor: 'JEME'
  }
}

// Mapeamento de badges para ícones do Discord
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

const CLAN_INFO: Record<string, { fullName: string; invite: string; icon: string; banner: string | null }> = {
  'light': {
    fullName: 'Light',
    invite: 'https://discord.gg/rGVzQ5KQYj',
    icon: 'https://cdn.discordapp.com/icons/1464288982627127358/a_a0a71f52f17a972bb922120e788e8270.gif?size=2048',
    banner: 'https://cdn.discordapp.com/splashes/1464288982627127358/ee9b44b15955c1d7ec0823a8c6f3a85b.png?size=2048',
  },
  'chk': {
    fullName: 'CHK',
    invite: 'https://discord.gg/GkDdp9TqYJ',
    icon: 'https://cdn.discordapp.com/icons/1395499598830764062/4e20e96a794e43049e4d5b2efdf14a1d.png?size=2048',
    banner: 'https://cdn.discordapp.com/attachments/1443008207638364170/1450299303389171903/content.png?ex=698d2d7b&is=698bdbfb&hm=b59de4c5341aac02f888fd5deb8d36acd688ea59daff9fc827f59e03f8afcb3b&',
  },
  'hail': {
    fullName: 'HAIL',
    invite: 'https://discord.gg/vt3Y64fT',
    icon: 'https://cdn.discordapp.com/icons/1458571578899173661/88bd398ad03380370505e48cf9652544.png?size=2048',
    banner: 'https://cdn.discordapp.com/attachments/1469478776206393345/1471267066383434064/New-Project_3_.png?ex=698e4fbb&is=698cfe3b&hm=6e1f62ae131d688962e4c277684df4160831242467f79e0852786adf642817b1&',
  },
  'jeme': {
    fullName: 'JEME',
    invite: 'https://discord.gg/ydCZWt4TRS',
    icon: 'https://cdn.discordapp.com/icons/1070492659795361882/bec2b3219c3aba8655fb3f29fc2f9d11.png?size=2048',
    banner: 'https://media.discordapp.net/attachments/1427016766223024255/1457228022930215013/bem_vindo.png?ex=698d55da&is=698c045a&hm=a4c39daa6bc4b661d33f1506fc0739ae39dc26f1fb126e9d6c91bec5f8249c04&=&format=webp&quality=lossless&width=1448&height=568',
  },
}

export default function ClanPage() {
  const params = useParams()
  const clanName = (params.name as string).toLowerCase()
  const clanInfo = CLAN_INFO[clanName]

  const [discordUsers, setDiscordUsers] = useState<Record<string, DiscordUser>>({})
  const [mushPlayers, setMushPlayers] = useState<MushPlayer[]>([])
  const [loading, setLoading] = useState(true)

  const clanContent = CLAN_CONTENT[clanName] || CLAN_CONTENT['light']
  const ownerIds = clanName === 'chk' ? CHK_OWNER : clanName === 'hail' ? HAIL_OWNER : OWNERS
  const subIds = clanName === 'light' ? SUBS : clanName === 'jeme' ? SUBS : []

  useEffect(() => {
    loadMembers()
    console.log('Clan name:', clanName)
    console.log('Owner IDs:', ownerIds)
    console.log('Sub IDs:', subIds)
  }, [clanName])

  const loadMembers = async () => {
    setLoading(true)
    try {
      // Carregar dados do Discord via nossa API
      const allDiscordIds = [...ownerIds, ...subIds]
      console.log('Loading members for IDs:', allDiscordIds)
      const discordData: Record<string, DiscordUser> = {}
      
      for (const userId of allDiscordIds) {
        try {
          console.log('Fetching user:', userId)
          const response = await fetch(`/api/discord/user/${userId}`)
          console.log('Response status:', response.status)
          if (response.ok) {
            const data = await response.json()
            console.log('User data:', data)
            discordData[userId] = data
          } else {
            console.error(`Failed to fetch user ${userId}:`, await response.text())
          }
        } catch (error) {
          console.error(`Erro ao carregar usuário Discord ${userId}:`, error)
        }
      }
      
      console.log('All discord data:', discordData)
      setDiscordUsers(discordData)

      // Carregar membros do Mush API
      if (clanName === 'light') {
        try {
          // TODO: Implementar busca de membros do clã via API do Mush
          const mushData: MushPlayer[] = []
          setMushPlayers(mushData)
        } catch (error) {
          console.error('Erro ao carregar membros do Mush:', error)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const parseBadges = (flags: number): string[] => {
    // Não é mais necessário, a API já processa
    return []
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

  if (!clanInfo) {
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">Clã não encontrado</h1>
        <Link href="/">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Voltar para Home
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header com Banner */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-[#FFD700]/20 to-[#FFD700]/5">
        {clanInfo.banner ? (
          <img src={clanInfo.banner} alt={`${clanInfo.fullName} banner`} className="w-full h-full object-cover opacity-50" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10" />
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-7xl mx-auto flex items-end gap-6">
            {/* Icon */}
            <div className="w-32 h-32 rounded-2xl border-4 border-background overflow-hidden shadow-2xl flex-shrink-0">
              <img src={clanInfo.icon} alt={clanInfo.fullName} className="w-full h-full object-cover" />
            </div>
            
            {/* Info */}
            <div className="flex-1 pb-2">
              <h1 className="text-4xl font-bold text-foreground mb-2">{clanInfo.fullName}</h1>
              <div className="flex gap-3">
                <Link href="/">
                  <Button className="bg-foreground/10 hover:bg-foreground/20 text-foreground border-none">
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                    Voltar
                  </Button>
                </Link>
                <Button
                  className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90 border-none font-semibold"
                  onClick={() => window.open(clanInfo.invite, '_blank')}
                >
                  Entrar no Servidor
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Members Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD700]"></div>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Descrição do Clã - Clean */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-5xl mx-auto"
            >
              {/* Header */}
              <div className="mb-12">
                <span className="text-xs uppercase tracking-widest text-[#FFD700]/60 font-medium mb-3 block">{clanContent.subtitle}</span>
                <h1 className="text-5xl md:text-6xl font-bold text-foreground">{clanContent.title}</h1>
              </div>

              {/* Content Grid */}
              <div className="grid md:grid-cols-5 gap-12">
                {/* Text Content */}
                <div className="md:col-span-3 space-y-6">
                  {clanContent.description}
                </div>

                {/* Quote */}
                <div className="md:col-span-2 flex items-center">
                  <div className="relative">
                    <div className="text-6xl text-[#FFD700]/10 font-serif absolute -top-4 -left-2">"</div>
                    <blockquote className="relative pl-8 border-l-2 border-[#FFD700]/30">
                      <p className="text-2xl font-semibold text-foreground leading-tight mb-4">
                        {clanContent.quote}
                      </p>
                      <cite className="text-sm text-foreground/40 not-italic uppercase tracking-wider">
                        {clanContent.quoteAuthor}
                      </cite>
                    </blockquote>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card do Owner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="w-full max-w-md">
                {ownerIds.map(userId => {
                  const user = discordUsers[userId]
                  if (!user) return null
                  return (
                    <DiscordUserCard 
                      key={userId} 
                      user={user} 
                      getAvatarUrl={getAvatarUrl} 
                      getBannerUrl={getBannerUrl} 
                      getStatusColor={getStatusColor}
                      getStatusText={getStatusText}
                      role="OWNER" 
                    />
                  )
                })}
              </div>
            </motion.div>

            {/* Members from Mush */}
            {mushPlayers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <FontAwesomeIcon icon={faUsers} className="text-[#FFD700] text-2xl" />
                  <h2 className="text-2xl font-bold text-foreground">MEMBER'S</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {mushPlayers.map((player, index) => (
                    <MushPlayerCard key={index} player={player} />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function DiscordUserCard({ user, getAvatarUrl, getBannerUrl, getStatusColor, getStatusText, role }: { 
  user: DiscordUser
  getAvatarUrl: (user: DiscordUser) => string
  getBannerUrl: (user: DiscordUser) => string | null
  getStatusColor: (status: string) => string
  getStatusText: (status: string) => string
  role: string
}) {
  const bannerUrl = getBannerUrl(user)
  const displayName = user.globalName || user.username
  
  // Banner padrão para owners
  const defaultBanner = 'https://cdn.discordapp.com/attachments/1469478776206393345/1471283645716107526/New-Project_2__1_.png?ex=698e5f2c&is=698d0dac&hm=556127ec08971cc94abfeb7a4e6f82a997d9c49ca662bd3b9d9791bbffb1140a&'
  
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-background border border-foreground/10 hover:border-[#FFD700]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#FFD700]/10">
      {/* Banner */}
      <div className="relative h-32 overflow-hidden bg-gradient-to-br from-[#FFD700]/20 to-[#FFD700]/5">
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

      {/* Avatar com Status */}
      <div className="absolute top-20 left-6">
        <div className="relative w-24 h-24 rounded-full border-4 border-background overflow-hidden shadow-xl">
          <img src={getAvatarUrl(user)} alt={displayName} className="w-full h-full object-cover" />
          {/* Status Indicator - Discord Style */}
          <div className={`absolute bottom-0 right-0 w-7 h-7 rounded-full border-[3px] border-background ${getStatusColor(user.status)}`} />
        </div>
      </div>

      {/* Role Badge */}
      <div className="absolute top-4 right-4">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30 backdrop-blur-sm">
          {role}
        </span>
      </div>

      {/* Content */}
      <div className="pt-16 pb-6 px-6">
        <h4 className="text-foreground font-bold text-xl mb-1">
          {displayName}
        </h4>
        <p className="text-foreground/60 text-sm mb-1">
          @{user.username}
        </p>
        <p className="text-foreground/40 text-xs mb-4">
          {getStatusText(user.status)}
        </p>
        
        {/* Custom Status */}
        {user.activities.find(a => a.type === 4) && (
          <div className="mb-4 p-3 rounded-lg bg-foreground/5 border border-foreground/10">
            <p className="text-sm text-foreground/80 flex items-center gap-2">
              {user.activities.find(a => a.type === 4)?.state && (
                <>
                  {user.activities.find(a => a.type === 4)?.state}
                </>
              )}
            </p>
          </div>
        )}
        
        {/* Atividade Atual (Jogos) */}
        {user.activities.filter(a => a.type === 0).length > 0 && (
          <div className="mb-4 p-3 rounded-lg bg-foreground/5 border border-foreground/10">
            <p className="text-xs text-foreground/50 mb-1">Jogando</p>
            <p className="text-sm text-foreground font-medium">{user.activities.filter(a => a.type === 0)[0].name}</p>
            {user.activities.filter(a => a.type === 0)[0].details && (
              <p className="text-xs text-foreground/60 mt-1">{user.activities.filter(a => a.type === 0)[0].details}</p>
            )}
          </div>
        )}

        {/* Spotify */}
        {user.spotify && (
          <div className="mb-4 p-3 rounded-lg bg-[#1DB954]/10 border border-[#1DB954]/20">
            <p className="text-xs text-[#1DB954] mb-1">Ouvindo no Spotify</p>
            <p className="text-sm text-foreground font-medium truncate">{user.spotify.song}</p>
            <p className="text-xs text-foreground/60 truncate">{user.spotify.artist}</p>
          </div>
        )}
        
        {/* Badges com ícones */}
        {user.badges.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {user.badges.map((badge, index) => {
              const iconUrl = BADGE_ICONS[badge]
              return iconUrl ? (
                <div key={index} className="relative group/badge">
                  <img 
                    src={iconUrl} 
                    alt={badge}
                    className="w-6 h-6 hover:scale-110 transition-transform"
                    title={badge}
                  />
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-background/95 border border-foreground/10 rounded text-xs text-foreground whitespace-nowrap opacity-0 group-hover/badge:opacity-100 transition-opacity pointer-events-none z-10">
                    {badge}
                  </div>
                </div>
              ) : (
                <span key={index} className="text-xs px-2 py-1 rounded-full bg-[#FFD700]/10 text-[#FFD700]">
                  {badge}
                </span>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function MushPlayerCard({ player }: { player: MushPlayer }) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-background border border-foreground/10 hover:border-[#FFD700]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#FFD700]/5 p-4">
      <h4 className="text-foreground font-bold text-base mb-3">{player.nick}</h4>
      
      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span className="text-foreground/60">Rank:</span>
          <span className="text-foreground">{player.rank}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground/60">Tag de Perfil:</span>
          <span className="text-foreground">{player.tag}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground/60">Medalha:</span>
          <span className="text-foreground">{player.medal}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground/60">Conta:</span>
          <span className="text-foreground">{player.accountType}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground/60">Online:</span>
          <span className={player.online ? "text-green-500" : "text-foreground/60"}>
            {player.online ? 'Sim' : 'Não'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground/60">Clan:</span>
          <span className="text-foreground">{player.clan || 'Não possui'}</span>
        </div>
      </div>

      <a
        href={player.skinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex items-center justify-center gap-2 text-[#FFD700] hover:text-[#FFD700]/80 text-sm font-medium transition-colors"
      >
        <span>Ver Skin</span>
        <FontAwesomeIcon icon={faExternalLink} className="text-xs" />
      </a>
    </div>
  )
}
