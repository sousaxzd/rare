'use client'

// Force rebuild

import { Hero } from '@/components/home/hero'
import { CTASection } from '@/components/home/cta'
import { BenefitsSecuritySection } from '@/components/home/benefits-security'
import { BenefitsPrivacySection } from '@/components/home/benefits-privacy'
import { DashboardPreview } from '@/components/home/dashboard-preview'
import { StatsSection } from '@/components/home/stats-section'

export default function Home() {
  return (
    <main className="flex flex-col overflow-x-hidden w-full">
      <Hero />

      <DashboardPreview />

      <StatsSection />

      <BenefitsSecuritySection />

      <BenefitsPrivacySection />

      <CTASection />
    </main>
  )
}
