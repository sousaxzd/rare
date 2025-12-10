'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export function CTASection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 2.0 }}
      className="px-4 md:px-0"
    >
      <div className="flex flex-col md:flex-row md:justify-between gap-4 md:gap-6 md:items-center">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 2.1 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold max-w-2xl"
        >
          Crie sua conta gratuitamente e surpreenda-se com o resultado
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 2.2 }}
          className="flex flex-col sm:flex-row gap-2 md:max-w-xl w-full sm:w-auto"
        >
          <Button
            className="w-full sm:w-auto bg-transparent border border-foreground/10 text-foreground hover:bg-foreground/5 text-sm px-4"
            onClick={() => {
              window.location.href = "/dashboard";
            }}
          >
            <span className="flex items-center gap-1 whitespace-nowrap">
              Acessar a Dashboard
              <FontAwesomeIcon icon={faUpRightFromSquare} className="text-[11px]" />
            </span>
          </Button>
          <Button
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 text-sm px-4"
            onClick={() => {
              window.location.href = "/pricing";
            }}
          >
            <span>Começar agora</span>
          </Button>
        </motion.div>
      </div>
    </motion.section>
  )
}

