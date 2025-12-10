import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname.toLowerCase()

  // Lista de arquivos estáticos que não devem cair na rota [affiliate]
  const staticFiles = ['favicon.ico', 'favicon.svg', 'robots.txt', 'sitemap.xml', 'manifest.json', 'icon.svg']
  const staticExtensions = ['.ico', '.svg', '.png', '.jpg', '.jpeg', '.json', '.txt', '.xml', '.webp', '.woff', '.woff2', '.ttf', '.eot']

  // Se for um arquivo estático, deixar o Next.js servir normalmente (não interceptar)
  const isStaticFile = staticFiles.some(file => pathname === `/${file}` || pathname.includes(`/${file}`)) || 
                       staticExtensions.some(ext => pathname.endsWith(ext))

  if (isStaticFile) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Apenas interceptar rotas que não são arquivos estáticos ou rotas do Next.js
    '/((?!api|_next|favicon.ico|favicon.svg|robots.txt|sitemap.xml|manifest.json|icon.svg).*)',
  ],
}

