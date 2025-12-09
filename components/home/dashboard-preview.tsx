'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'

export function DashboardPreview() {
  const containerRef = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 })
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7.5deg', '-7.5deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7.5deg', '7.5deg'])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative z-20 flex items-center justify-center w-full self-center overflow-visible mt-20 md:mt-32 mb-12"
    >
      {/* Container com largura igual ao header e outros elementos */}
      <div className="w-full max-w-7xl mx-auto px-6 relative">
        {/* Image Container with Effects - compensa o padding para imagem ocupar largura total */}
        <div className="relative -mx-6">
          {/* Outer shadow/darkening effect - pode ultrapassar as bordas */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.8 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="absolute -inset-8 bg-gradient-to-b from-background via-background/95 to-background rounded-3xl blur-2xl"
          />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.6 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
            className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 rounded-3xl blur-xl"
          />

          {/* Main image container - largura total, alinhada com bordas do container */}
          <motion.div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 107, 53, 0.1)',
              perspective: '1000px'
            }}
            className="relative rounded-2xl overflow-hidden bg-background border border-foreground/10 shadow-2xl dashboard-preview-3d cursor-pointer"
          >
            {/* Inner darkening borders */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/60 z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40 z-10 pointer-events-none" />

            {/* Image - ocupa toda largura do container */}
            <div className="relative w-full bg-foreground/5">
              <img
                src="/preview.png"
                alt="Dashboard Preview"
                className="w-full h-auto object-contain select-none relative z-0"
                draggable={false}
              />

              {/* Additional overlay effects */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-20 pointer-events-none opacity-60" />
              <div className="absolute top-0 left-0 right-0 h-16 md:h-32 bg-gradient-to-b from-background to-transparent z-20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-16 md:h-32 bg-gradient-to-t from-background to-transparent z-20 pointer-events-none" />
            </div>
          </motion.div>

          {/* Decorative glow effects - podem ultrapassar as bordas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 0.4, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="absolute -inset-12 bg-primary/5 rounded-3xl blur-3xl -z-10"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 0.2, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/5 rounded-full blur-[120px] -z-10"
          />
        </div>
      </div>
    </motion.section>
  )
}
