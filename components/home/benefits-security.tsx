'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBolt, faShieldAlt, faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

const securityBenefits = [
  {
    icon: faBolt,
    title: 'Rapidez',
    description: 'Transações instantâneas 24/7. Receba e envie pagamentos em segundos, sem esperas ou burocracias.',
  },
  {
    icon: faShieldAlt,
    title: 'Segurança Total',
    description: 'Criptografia de ponta e proteção avançada. Seus dados e transações estão completamente seguros.',
  },
  {
    icon: faUserSecret,
    title: 'Anonimato Garantido',
    description: 'Venda sem usar seu nome real. Mantenha sua identidade protegida em todas as transações.',
  },
]

export function BenefitsSecuritySection() {
  return (
    <section className="mt-20 mb-12 flex flex-col lg:flex-row justify-between w-full gap-8 relative">
      {/* Left Column - Text Content */}
      <div className="w-full lg:w-1/2 flex flex-col gap-2 relative z-10">
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="flex items-center gap-1">
          <FontAwesomeIcon icon={faShieldAlt} className="text-primary text-[12px]" />
          <span className="text-primary/50 text-[12px]">|</span>
          <span className="text-primary font-semibold text-[12px]">Segurança e Performance</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          Opere com rapidez, segurança e anonimato total
        </h1>
        <div className="flex flex-col gap-1">
          <p className="text-foreground/70 text-sm md:text-base max-w-xl leading-relaxed">
            Transações instantâneas protegidas por criptografia de nível bancário. Venda sem revelar sua identidade e opere com total discrição.
          </p>
          <Link
            href="/pricing"
            className="text-foreground flex items-center gap-1 w-fit px-4 py-2 bg-foreground/2 border border-foreground/10 rounded-lg hover:bg-foreground/10 duration-100 transition-all cursor-pointer my-2"
          >
            <span className="text-[12px] text-foreground/80">Ver planos e preços</span>
            <FontAwesomeIcon icon={faChevronRight} className="text-foreground/70 text-[12px]" />
          </Link>
        </div>
        <hr className="border-foreground/10 my-4" />

        {/* Benefits List */}
        <div className="flex flex-col gap-6 mt-2">
          {securityBenefits.map((benefit, index) => (
            <div
              key={index}
              className="flex flex-row gap-4 justify-between items-start"
            >
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <FontAwesomeIcon icon={benefit.icon} className="text-primary text-sm" />
                </div>
                <p className="text-foreground/90 text-sm font-semibold whitespace-nowrap">
                  {benefit.title}
                </p>
              </div>
              <p className="text-foreground/60 text-xs md:text-sm leading-tight md:max-w-xs max-w-1/2 text-right lg:text-left">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column - Image with Glow */}
      <div className="w-full lg:w-1/2 h-auto relative flex items-center justify-end lg:block hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full opacity-60 pointer-events-none" />
        <img
          src="/roboanonimo.png"
          alt="Segurança e Anonimato"
          className="relative z-10 w-full h-auto object-contain max-h-[600px] scale-110 translate-x-10"
        />
      </div>
    </section>
  )
}

