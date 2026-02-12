import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: userId } = await params

  try {
    // Tentar buscar via Lanyard primeiro
    let response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`)
    
    if (response.ok) {
      const data = await response.json()

      if (data.success) {
        const userData = data.data
        const discordUser = userData.discord_user

        // Processar badges
        const badges = parseBadges(discordUser.public_flags || 0)

        // Processar status
        const status = userData.discord_status || 'offline'

        // Processar atividades
        const activities = userData.activities || []
        const spotify = userData.spotify || null

        // Construir resposta
        const userInfo = {
          id: discordUser.id,
          username: discordUser.username,
          discriminator: discordUser.discriminator,
          globalName: discordUser.global_name || null,
          avatar: discordUser.avatar,
          banner: discordUser.banner || null,
          accentColor: discordUser.accent_color || null,
          badges,
          status,
          activities: activities.map((activity: any) => ({
            name: activity.name,
            type: activity.type,
            details: activity.details || null,
            state: activity.state || null,
            applicationId: activity.application_id || null,
            timestamps: activity.timestamps || null,
            assets: activity.assets || null,
          })),
          spotify: spotify ? {
            trackId: spotify.track_id,
            song: spotify.song,
            artist: spotify.artist,
            album: spotify.album,
            albumArtUrl: spotify.album_art_url,
            timestamps: spotify.timestamps,
          } : null,
          kv: userData.kv || {},
        }

        return NextResponse.json(userInfo)
      }
    }

    // Fallback: buscar dados básicos da API pública do Discord
    console.log('Lanyard failed, trying Discord API...')
    response = await fetch(`https://discord.com/api/v10/users/${userId}`, {
      headers: {
        'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`
      }
    })

    if (!response.ok) {
      // Se não tiver bot token, retornar dados mínimos
      return NextResponse.json({
        id: userId,
        username: 'Usuário Discord',
        discriminator: '0000',
        globalName: null,
        avatar: null,
        banner: null,
        accentColor: null,
        badges: [],
        status: 'offline',
        activities: [],
        spotify: null,
        kv: {},
      })
    }

    const discordData = await response.json()
    const badges = parseBadges(discordData.public_flags || 0)

    const userInfo = {
      id: discordData.id,
      username: discordData.username,
      discriminator: discordData.discriminator || '0',
      globalName: discordData.global_name || null,
      avatar: discordData.avatar,
      banner: discordData.banner || null,
      accentColor: discordData.accent_color || null,
      badges,
      status: 'offline', // Sem Lanyard, não temos status em tempo real
      activities: [],
      spotify: null,
      kv: {},
    }

    return NextResponse.json(userInfo)
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    // Retornar dados mínimos em caso de erro
    return NextResponse.json({
      id: userId,
      username: 'Usuário Discord',
      discriminator: '0000',
      globalName: null,
      avatar: null,
      banner: null,
      accentColor: null,
      badges: [],
      status: 'offline',
      activities: [],
      spotify: null,
      kv: {},
    })
  }
}

function parseBadges(flags: number): string[] {
  const badges = []
  if (flags & (1 << 0)) badges.push('Staff')
  if (flags & (1 << 1)) badges.push('Partner')
  if (flags & (1 << 2)) badges.push('HypeSquad Events')
  if (flags & (1 << 3)) badges.push('Bug Hunter Level 1')
  if (flags & (1 << 6)) badges.push('HypeSquad Bravery')
  if (flags & (1 << 7)) badges.push('HypeSquad Brilliance')
  if (flags & (1 << 8)) badges.push('HypeSquad Balance')
  if (flags & (1 << 9)) badges.push('Early Supporter')
  if (flags & (1 << 14)) badges.push('Bug Hunter Level 2')
  if (flags & (1 << 16)) badges.push('Verified Bot Developer')
  if (flags & (1 << 17)) badges.push('Early Verified Bot Developer')
  if (flags & (1 << 18)) badges.push('Discord Certified Moderator')
  if (flags & (1 << 22)) badges.push('Active Developer')
  return badges
}
