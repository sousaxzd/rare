'use client'

import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faYoutube, faInstagram, faDiscord, faTelegram } from '@fortawesome/free-brands-svg-icons'
import { Logo } from './icons'
import { footerLinks } from '@/config/footer'

export function Footer() {
  return (
    <footer className="flex flex-col py-10 border-t border-foreground/10 w-full">
      <section className="flex w-full flex-col md:flex-row gap-5 md:gap-20 max-w-7xl mx-auto px-6 md:justify-between">
        <div className="flex flex-col gap-2 md:justify-center">
          <div className="flex items-center justify-start gap-3">
            <Link href="/" className="flex flex-row gap-2 items-center select-none w-fit">
              <img 
                src="https://cdn.discordapp.com/attachments/1469478776206393345/1471283379285655685/New-Project_1__1_.png?ex=698e5eec&is=698d0d6c&hm=8ed7e7068d9f805ff3cc78379824252d0e7076a8da72142c4b025ac99c98b10d&" 
                alt="Rare Mush Logo" 
                width={40} 
                height={40}
                className="rounded-lg"
              />
              <div className="flex flex-col leading-[15px]">
                <span className="text-foreground/90 font-normal font-sans text-[13px]">
                  Rare
                </span>
                <span className="text-foreground/60 font-normal font-sans text-[12px]">
                  Mush
                </span>
              </div>
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-foreground/60 text-[12px]">© 2026 Rare Mush. Todos os direitos reservados.</p>
            <div className="flex flex-col gap-0.5">
              <p className="text-foreground/60 text-[12px]">
                Comunidade administrada por <span className="font-semibold">RARIDADES</span>
              </p>
            </div>
            <div className="flex flex-row gap-1">
              <Link 
                href="https://youtube.com/@NAOTEMYOUTUBE" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-foreground transition-colors"
                aria-label="YouTube"
              >
                <FontAwesomeIcon icon={faYoutube} className="text-[18px]" />
              </Link>
              <Link 
                href="https://instagram.com/NAOTEMINSTAGRAM" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <FontAwesomeIcon icon={faInstagram} className="text-[18px]" />
              </Link>
              <Link 
                href="https://discord.gg/wHVKdnBU2x" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-foreground transition-colors"
                aria-label="Discord"
              >
                <FontAwesomeIcon icon={faDiscord} className="text-[18px]" />
              </Link>
              <Link 
                href="https://t.me/NAOTEMTELEGRAM" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-foreground transition-colors"
                aria-label="Telegram"
              >
                <FontAwesomeIcon icon={faTelegram} className="text-[18px]" />
              </Link>
            </div>
          </div>
        </div>
        <hr className="border-foreground/10 md:hidden my-0" />
        <div className="grid grid-cols-1 gap-5">
          <div className="flex flex-col gap-3">
            <span className="text-foreground/70 text-[12px] font-semibold">{footerLinks.product.title}</span>
            <div className="flex flex-col gap-1">
              {footerLinks.product.links.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/70 hover:text-foreground hover:underline text-[14px] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </footer>
  )
}
