'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { motion } from 'framer-motion'
import GridLines from '@/components/grid-lines'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const HERO_LINE_ONE_WORDS: { text: string; highlight: boolean }[] = [
  { text: "Sua", highlight: false },
  { text: "carteira", highlight: true },
  { text: "digital", highlight: true },
]
const HERO_LINE_TWO_WORDS: { text: string; highlight: boolean }[] = [
  { text: "completa", highlight: false },
  { text: "em", highlight: false },
  { text: "um", highlight: false },
  { text: "só", highlight: false },
  { text: "lugar", highlight: false },
]

export function Hero() {
  return (
    <section className="flex flex-col justify-center md:items-center md:text-center pt-20 md:pt-32 px-4 md:px-0">
      <GridLines
        className="z-0 opacity-50"
        style={{
          WebkitMaskImage:
            "radial-gradient(50% 40% at 50% 20%, #000 30%, transparent 80%)",
          maskImage:
            "radial-gradient(50% 40% at 50% 20%, #000 30%, transparent 80%)",
        }}
      />

      <section className="relative flex flex-col gap-2 w-full">
        {/* Glow effect - appears with content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          className="pointer-events-none absolute top-20 left-25 h-40 md:left-50 md:h-50 w-1/2 max-w-sm rounded-full bg-primary/20 blur-[80px]"
        />

        {/* Badge - appears first above title */}
        <motion.div
          initial={{ opacity: 0, y: -10, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-fit mx-auto text-center items-center justify-center px-3 py-1 md:px-5 md:py-1 bg-primary/30 backdrop-blur-[32px] border border-primary/20 rounded-full text-foreground text-[10px] sm:text-[11px] md:text-[12px] self-center flex flex-row gap-1.5 md:gap-2 mb-4 whitespace-nowrap"
        >
          <p className="whitespace-nowrap">
            Conta gratuita <span className="font-semibold">para sempre</span>
          </p>
          <p className="text-primary/50 hidden sm:inline">|</p>
          <Link href="/pricing" className="text-[10px] sm:text-[11px] md:text-xs text-foreground p-0.5 md:p-1 hover:text-primary transition-colors inline-flex items-center gap-0.5 md:gap-1 whitespace-nowrap">
            Começar agora
            <FontAwesomeIcon icon={faUpRightFromSquare} className="text-[9px] md:text-[10px]" />
          </Link>
        </motion.div>

        {/* Title with staggered word animations */}
        <h1 className="text-[2.25rem] sm:text-[2.75rem] md:text-5xl lg:text-7xl font-bold leading-[1.12] sm:leading-[1.1] px-4 md:px-0 text-center">
          <div className="flex flex-wrap justify-center items-center gap-x-2 sm:gap-x-2.5 gap-y-0">
            {HERO_LINE_ONE_WORDS.map((item, index) => (
              <motion.span
                key={`l1-${index}`}
                initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.3 + index * 0.08, duration: 0.4, ease: "easeOut" }}
                className={`inline-block ${item.highlight ? "text-primary" : ""}`}
              >
                {item.text}
              </motion.span>
            ))}
          </div>
          <div className="flex flex-wrap justify-center items-center gap-x-2 sm:gap-x-2.5 gap-y-0 mt-0">
            {HERO_LINE_TWO_WORDS.map((item, index) => (
              <motion.span
                key={`l2-${index}`}
                initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.3 + (index + 3) * 0.08, duration: 0.4, ease: "easeOut" }}
                className={`inline-block ${item.highlight ? "text-primary" : ""}`}
              >
                {item.text}
              </motion.span>
            ))}
          </div>
        </h1>

        {/* Description - appears after title */}
        <motion.p
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.9, duration: 0.5, ease: "easeOut" }}
          className="text-foreground/70 font-normal text-sm sm:text-base md:text-[15px] max-w-2xl self-center mt-4 px-4 md:px-0 text-center"
        >
          Receba e transfira PIX de forma anônima, sem MEDs ou bloqueios e sem idade mínima. <span className="font-semibold text-primary">Privacidade, liberdade e segurança</span> para você operar com tranquilidade.
        </motion.p>

        {/* CTA Buttons - appear last */}
        <motion.div
          className="flex gap-2 md:gap-5 flex-col sm:flex-row items-stretch sm:items-center justify-center mt-4 w-full px-4 md:px-0"
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 1.1, duration: 0.5, ease: "easeOut" }}
        >
          <Button
            className="w-full sm:w-auto sm:flex-none bg-primary text-primary-foreground hover:bg-primary/90 text-sm px-6"
            onClick={() => {
              window.location.href = "/pricing";
            }}
          >
            <span>Começar agora</span>
          </Button>
          <Button
            className="w-full sm:w-auto bg-background border border-foreground/10 rounded-lg text-foreground hover:bg-foreground/10 text-sm px-6"
            onClick={() => {
              window.location.href = "/about";
            }}
          >
            <span className="flex items-center justify-center gap-1 whitespace-nowrap">
              Conheça nossos produtos <FontAwesomeIcon icon={faChevronRight} className="text-[11px] duration-200 transition-all hover:text-foreground text-foreground/80" />
            </span>
          </Button>
        </motion.div>
      </section>
    </section>
  )
}
