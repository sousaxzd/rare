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
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.3, ease: "easeOut" }}
      className="relative z-20 w-full self-center mt-12 md:mt-24 mb-8 max-w-[100vw] overflow-hidden md:overflow-visible px-4 md:px-0"
    >
      {/* Outer shadow/darkening effect - fora do container principal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 1, delay: 1.6 }}
        className="absolute -inset-4 md:-inset-8 bg-gradient-to-b from-background via-background/95 to-background rounded-3xl blur-md md:blur-2xl -z-10 pointer-events-none"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1, delay: 1.7 }}
        className="absolute -inset-4 md:-inset-8 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 rounded-3xl blur-sm md:blur-xl -z-10 pointer-events-none"
      />

      {/* Decorative glow effects - fora do container principal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 1.2, delay: 1.8 }}
        className="absolute -inset-12 md:-inset-20 bg-primary/5 rounded-3xl blur-xl md:blur-3xl -z-20 pointer-events-none"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{ duration: 1.2, delay: 1.9 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-primary/5 rounded-full blur-[60px] md:blur-[120px] -z-20 pointer-events-none"
      />

      {/* Main image container - elemento visível alinhado */}
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 107, 53, 0.1)',
          perspective: '1000px'
        }}
        className="relative rounded-2xl overflow-hidden bg-background border border-foreground/10 shadow-2xl dashboard-preview-3d cursor-pointer w-full"
      >
        {/* Inner darkening borders */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/60 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40 z-10 pointer-events-none" />

        {/* Image - ocupa toda largura do container */}
        <div className="relative w-full bg-foreground/5 overflow-hidden">
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
    </motion.section>
  )
}
