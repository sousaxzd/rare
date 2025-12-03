'use client'

import { Hero } from '@/components/home/hero'
import { CTASection } from '@/components/home/cta'
import { BenefitsSecuritySection } from '@/components/home/benefits-security'
import { BenefitsPrivacySection } from '@/components/home/benefits-privacy'
import { DashboardPreview } from '@/components/home/dashboard-preview'
export default function Home() {
  return (
    <main className="flex flex-col">
      <Hero />

      <DashboardPreview />

      <BenefitsSecuritySection />

      <BenefitsPrivacySection />

      <CTASection />
    </main>
  )
}
