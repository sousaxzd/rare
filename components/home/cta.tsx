'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export function CTASection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col md:flex-row md:justify-between gap-2 md:items-center">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl font-bold max-w-2xl"
        >
          Crie sua conta gratuitamente e surpreenda-se com o resultado
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-row gap-2 md:max-w-xl"
        >
          <Button
            className="w-fit bg-transparent border border-foreground/10 text-foreground hover:bg-foreground/5"
            onClick={() => {
              window.location.href = "/dashboard";
            }}
          >
            <span className="flex items-center gap-1">
              Acessar a Dashboard
              <FontAwesomeIcon icon={faUpRightFromSquare} className="text-[11px]" />
            </span>
          </Button>
          <Button
            className="w-fit bg-primary text-primary-foreground hover:bg-primary/90"
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

