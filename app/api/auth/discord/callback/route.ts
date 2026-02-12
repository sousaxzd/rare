import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', request.url))
  }

  try {
    // Trocar o código por um token de acesso
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || '1465579747512946738',
        client_secret: process.env.DISCORD_CLIENT_SECRET || 'j2z6m7wkxNDHveg9UVMgkfyGP9VgYzeu',
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: `${request.nextUrl.origin}/api/auth/discord/callback`,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token')
    }

    const tokenData = await tokenResponse.json()

    // Buscar informações do usuário
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user data')
    }

    const userData = await userResponse.json()

    // Criar HTML que salva no localStorage e redireciona
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Autenticando...</title>
        </head>
        <body>
          <script>
            localStorage.setItem('discord_user', JSON.stringify({
              id: '${userData.id}',
              username: '${userData.username}',
              discriminator: '${userData.discriminator}',
              avatar: '${userData.avatar || ''}',
              email: '${userData.email || ''}'
            }));
            window.location.href = '/';
          </script>
        </body>
      </html>
    `

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    })
  } catch (error) {
    console.error('Discord OAuth error:', error)
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url))
  }
}
