/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: process.cwd(),
  },
  // Melhorar tratamento de erros durante build
  reactStrictMode: true,
  // Suprimir avisos de hidratação em desenvolvimento após build
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Configurações para melhorar estabilidade após build
  experimental: {
    // Evitar problemas de hidratação
    optimizePackageImports: ['@fortawesome/react-fontawesome'],
  },
}

export default nextConfig
