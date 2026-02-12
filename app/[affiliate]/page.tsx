import { redirect } from 'next/navigation'
import SetCookieAndRedirect from './set-cookie-client'

export default async function AffiliateRedirectPage({ params }: { params: Promise<{ affiliate: string }> }) {
    const { affiliate } = await params
    const affiliateCode = affiliate.toLowerCase().trim()

    // Ignorar arquivos estáticos e rotas comuns que podem cair aqui por engano
    const staticFiles = ['favicon.ico', 'robots.txt', 'sitemap.xml', 'manifest.json', 'favicon.svg', 'icon.svg']
    const staticExtensions = ['.ico', '.svg', '.png', '.jpg', '.jpeg', '.json', '.txt', '.xml', '.webp']

    if (staticFiles.includes(affiliateCode) || staticExtensions.some(ext => affiliateCode.endsWith(ext))) {
        redirect('/')
    }

    // Por enquanto, aceita qualquer código de afiliado
    // TODO: Implementar validação de afiliados quando o backend estiver pronto
    if (affiliateCode && affiliateCode.length > 0) {
        return <SetCookieAndRedirect code={affiliateCode} name={affiliateCode} />
    }

    // Se não for afiliado válido, apenas redireciona para home sem cookie
    redirect('/')
}
