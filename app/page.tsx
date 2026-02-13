'use client'

import { CTASection } from '@/components/home/cta'
import { DiscordBotSection } from '@/components/home/discord-bot-section'
import { FoundersSection } from '@/components/home/founders-section'

export default function Home() {
  return (
    <main className="flex flex-col pt-24">
      <DiscordBotSection />
      <FoundersSection />
      <CTASection />
    </main>
  )
}
