'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBolt, faShieldAlt, faUserSecret, faLock, faBan, faCheckCircle, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { motion } from 'framer-motion'
import Link from 'next/link'

const benefits = [
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
  {
    icon: faLock,
    title: 'Privacidade Completa',
    description: 'Seus dados nunca são compartilhados. Opere com total discrição e confidencialidade.',
  },
  {
    icon: faBan,
    title: 'Sem Bloqueios',
    description: 'Nunca mais receba meds ou bloqueios. Opere livremente sem restrições ou limitações.',
  },
  {
    icon: faCheckCircle,
    title: 'Operação Livre',
    description: 'Gerencie seus pagamentos sem interferências. Controle total sobre suas transações financeiras.',
  },
]

export function BenefitsSection() {
  return (
    <section className="mt-40 mb-20 flex flex-col lg:flex-row justify-between w-full gap-8">
      {/* Left Column - Text Content */}
      <div className="w-full lg:w-1/2 flex flex-col gap-2">
        <div className="flex items-center gap-1">
          <FontAwesomeIcon icon={faShieldAlt} className="text-primary text-[12px]" />
          <span className="text-primary/50 text-[12px]">|</span>
          <span className="text-primary font-semibold text-[12px]">Benefícios exclusivos</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          Venda com segurança, privacidade e liberdade total
        </h1>
        <div className="flex flex-col gap-1">
          <p className="text-foreground/70 text-sm md:text-base max-w-xl leading-relaxed">
            A Vision Wallet oferece tudo que você precisa para operar com total discrição. Venda sem usar seu nome, sem receber meds ou bloqueios. Sua liberdade financeira começa aqui.
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
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
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
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Column - Visual Elements with Dashed Lines */}
      <div className="w-full lg:w-2/5 h-auto rounded-lg p-7 border border-dashed border-foreground/10 lg:block hidden">
        <div className="flex flex-col">
          <p className="text-foreground/60 uppercase text-xs font-[monospace]">Sua carteira</p>
          <p className="text-foreground/60 text-xs leading-tight md:max-w-sm mt-2">
            Uma plataforma completa que garante privacidade, segurança e liberdade para suas operações financeiras.
          </p>
        </div>

        <div className="mt-5 flex flex-row gap-4">
          {/* Dashed vertical line */}
          <div className="h-auto w-[1px] border-l border-dashed border-foreground/10" />

          <div className="flex flex-col gap-6 flex-1">
            {/* Security Card */}
            <div className="flex flex-col gap-2">
              <p className="text-foreground/60 uppercase text-xs font-[monospace]">Segurança</p>
              <div className="p-4 border border-foreground/10 rounded-lg bg-foreground/2">
                <div className="flex flex-row gap-3 items-center">
                  <div className="w-16 h-16 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faShieldAlt} className="text-primary text-2xl" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-foreground/70 text-[10px] uppercase font-[monospace]">Criptografia AES-256</p>
                    <p className="text-foreground/70 text-[11px] leading-tight">
                      Proteção de nível bancário para todas as suas transações e dados pessoais.
                    </p>
                  </div>
                </div>
                <div className="h-[40%] w-full rounded-md bg-[repeating-linear-gradient(45deg,rgba(255,107,53,0.10)_0,rgba(255,107,53,0.10)_1,transparent_1px,transparent_8px)] mt-3" />
              </div>
            </div>

            {/* Privacy Card */}
            <div className="flex flex-col gap-2">
              <p className="text-foreground/60 uppercase text-xs font-[monospace]">Privacidade</p>
              <div className="p-4 border border-foreground/10 rounded-lg bg-foreground/2">
                <div className="flex flex-row gap-3 items-center">
                  <div className="w-16 h-16 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faUserSecret} className="text-primary text-2xl" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-foreground/70 text-[10px] uppercase font-[monospace]">Anonimato Total</p>
                    <p className="text-foreground/70 text-[11px] leading-tight">
                      Opere sem revelar sua identidade. Venda com total discrição e proteção.
                    </p>
                  </div>
                </div>
                <div className="flex flex-row gap-2 mt-3">
                  <div className="h-[1px] w-full border-b border-dashed border-foreground/10 self-center" />
                  <FontAwesomeIcon icon={faLock} className="text-foreground/30 text-xs" />
                  <div className="h-[1px] w-full border-b border-dashed border-foreground/10 self-center" />
                </div>
              </div>
            </div>

            {/* Freedom Card */}
            <div className="flex flex-col gap-2">
              <p className="text-foreground/60 uppercase text-xs font-[monospace]">Liberdade</p>
              <div className="p-4 border border-foreground/10 rounded-lg bg-foreground/2">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faBan} className="text-primary text-sm" />
                    <p className="text-foreground/70 text-[11px] font-semibold">Sem bloqueios</p>
                  </div>
                  <p className="text-foreground/70 text-[11px] leading-tight">
                    Opere livremente sem meds, bloqueios ou restrições. Sua conta, suas regras.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

