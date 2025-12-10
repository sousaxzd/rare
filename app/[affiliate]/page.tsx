import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { validateAffiliateCode } from '@/lib/wallet'
import SetCookieAndRedirect from './set-cookie-client'

export default async function AffiliateRedirectPage({ params }: { params: { affiliate: string } }) {
    const affiliateCode = params.affiliate

    // Ignorar arquivos estáticos e rotas comuns que podem cair aqui por engano
    if (['favicon.ico', 'robots.txt', 'sitemap.xml', 'manifest.json'].includes(affiliateCode)) {
        return null
    }

    // Tentar validar o código no backend
    try {
        const check = await validateAffiliateCode(affiliateCode)

        if (check.valid && check.data) {
            // Se válido, não podemos definir cookies diretamente num Server Component (pelo menos não facilmente para o cliente)
            // Mas podemos usar um Client Component wrapper ou Route Handler.
            // O mais simples aqui para garantir o cookie no cliente é renderizar um Client Component que define o cookie e redireciona.
            return <SetCookieAndRedirect code={check.data.code} name={check.data.name} />
        }
    } catch (error) {
        console.error('Erro ao verificar afiliado:', error)
    }

    // Se não for afiliado válido, apenas redireciona para home sem cookie
    redirect('/')
}


