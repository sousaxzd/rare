'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const servers = [
    {
        name: 'Light',
        icon: 'https://cdn.discordapp.com/icons/1464288982627127358/a_a0a71f52f17a972bb922120e788e8270.gif?size=2048',
        banner: 'https://cdn.discordapp.com/splashes/1464288982627127358/ee9b44b15955c1d7ec0823a8c6f3a85b.png?size=2048',
        invite: 'https://discord.gg/rGVzQ5KQYj',
    },
    {
        name: 'CHK',
        icon: 'https://cdn.discordapp.com/icons/1395499598830764062/4e20e96a794e43049e4d5b2efdf14a1d.png?size=2048',
        banner: 'https://cdn.discordapp.com/attachments/1443008207638364170/1450299303389171903/content.png?ex=698d2d7b&is=698bdbfb&hm=b59de4c5341aac02f888fd5deb8d36acd688ea59daff9fc827f59e03f8afcb3b&',
        invite: 'https://discord.gg/GkDdp9TqYJ',
    },
    {
        name: 'HAIL',
        icon: 'https://cdn.discordapp.com/icons/1458571578899173661/88bd398ad03380370505e48cf9652544.png?size=2048',
        banner: 'https://cdn.discordapp.com/attachments/1469478776206393345/1471267066383434064/New-Project_3_.png?ex=698e4fbb&is=698cfe3b&hm=6e1f62ae131d688962e4c277684df4160831242467f79e0852786adf642817b1&',
        invite: 'https://discord.gg/vt3Y64fT',
    },
    {
        name: 'JEME',
        icon: 'https://cdn.discordapp.com/icons/1070492659795361882/bec2b3219c3aba8655fb3f29fc2f9d11.png?size=2048',
        banner: 'https://media.discordapp.net/attachments/1427016766223024255/1457228022930215013/bem_vindo.png?ex=698d55da&is=698c045a&hm=a4c39daa6bc4b661d33f1506fc0739ae39dc26f1fb126e9d6c91bec5f8249c04&=&format=webp&quality=lossless&width=1448&height=568',
        invite: 'https://discord.gg/ydCZWt4TRS',
    },
]

export function DiscordBotSection() {
    return (
        <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="relative mt-8 mb-8 py-16 md:mt-12 md:mb-16 md:py-24"
        >
            <div className="relative z-10 container mx-auto px-6">
                {/* Server Badges */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {servers.map((server, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative overflow-hidden rounded-2xl bg-background border border-foreground/10 hover:border-[#FFD700]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#FFD700]/5"
                        >
                            {/* Banner */}
                            <div className="relative h-32 overflow-hidden bg-gradient-to-br from-[#FFD700]/20 to-[#FFD700]/5">
                                {server.banner ? (
                                    <img
                                        src={server.banner}
                                        alt={`${server.name} banner`}
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-[#FFD700]/30 to-[#FFD700]/10" />
                                )}
                            </div>

                            {/* Icon */}
                            <div className="absolute top-20 left-1/2 -translate-x-1/2">
                                <div className="w-20 h-20 rounded-full border-4 border-background overflow-hidden shadow-xl">
                                    <img
                                        src={server.icon}
                                        alt={`${server.name} icon`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="pt-14 pb-6 px-6 text-center">
                                <h3 className="text-foreground text-xl font-bold mb-4">
                                    {server.name}
                                </h3>

                                {/* Buttons */}
                                <div className="flex flex-col gap-2">
                                    <Button
                                        className="w-full bg-[#FFD700] text-black hover:bg-[#FFD700]/90 text-sm font-semibold"
                                        onClick={() => window.open(server.invite, '_blank')}
                                    >
                                        Entrar no Servidor
                                    </Button>
                                    <Link href={`/clan/${server.name.toLowerCase()}`} className="w-full">
                                        <Button className="w-full bg-transparent border border-foreground/10 text-foreground hover:bg-foreground/5 text-sm">
                                            Conhecer {server.name}
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </motion.section>
    )
}
