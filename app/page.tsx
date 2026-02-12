'use client'

import { CTASection } from '@/components/home/cta'
import { DiscordBotSection } from '@/components/home/discord-bot-section'

export default function Home() {
  return (
    <main className="flex flex-col pt-24">
      <DiscordBotSection />
      <CTASection />
    </main>
  )
}
