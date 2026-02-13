'use client'

import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown, faTrophy, faUsers } from '@fortawesome/free-solid-svg-icons'

export default function HistoriaPage() {

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20 mb-6">
            <FontAwesomeIcon icon={faCrown} className="text-[#FFD700] text-xl" />
            <span className="text-[#FFD700] font-semibold">As Raridades do MushMC</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-6">
            Nossa História
          </h1>
          
          <p className="text-xl text-foreground/60 max-w-3xl mx-auto leading-relaxed">
            A jornada de jovens visionários que decidiram conquistar o impossível
          </p>
        </motion.div>

        {/* Story Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-invert prose-lg max-w-none mb-20"
        >
          {/* Chapter 1 */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#FFD700]/20 flex items-center justify-center">
                <span className="text-[#FFD700] font-bold text-xl">I</span>
              </div>
              <h2 className="text-3xl font-bold text-foreground m-0">O Início de Tudo</h2>
            </div>
            
            <div className="space-y-6 text-foreground/80 leading-relaxed">
              <p className="text-lg">
                Era uma vez, no vasto universo do <span className="text-[#FFD700] font-semibold">MushMC</span>, jovens que compartilhavam mais do que apenas a paixão por jogos. Eles compartilhavam um sonho audacioso: <span className="text-foreground font-semibold">dominar o cenário competitivo e criar um legado que seria lembrado por gerações</span>.
              </p>
              
              <p className="text-lg">
                Não eram apenas jogadores comuns. Eram estrategistas, visionários, líderes natos. Enquanto outros se contentavam em participar, eles queriam <span className="text-[#FFD700] font-semibold">conquistar</span>. Enquanto outros sonhavam pequeno, eles enxergavam o topo da montanha.
              </p>
              
              <p className="text-lg">
                A ideia surgiu em uma noite comum, durante uma sessão épica de BedWars. Entre risadas, estratégias e vitórias consecutivas, nasceu uma pergunta que mudaria tudo: <span className="text-foreground italic">"E se nós não apenas jogássemos... mas possuíssemos os clãs mais prestigiados do servidor?"</span>
              </p>
            </div>
          </div>

          {/* Chapter 2 */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#FFD700]/20 flex items-center justify-center">
                <span className="text-[#FFD700] font-bold text-xl">II</span>
              </div>
              <h2 className="text-3xl font-bold text-foreground m-0">A Primeira Conquista</h2>
            </div>
            
            <div className="space-y-6 text-foreground/80 leading-relaxed">
              <p className="text-lg">
                O que parecia impossível para muitos, para eles era apenas o primeiro passo. Com determinação inabalável e recursos combinados, adquiriram seu primeiro <span className="text-[#FFD700] font-semibold">clã dourado</span>. Não era apenas um símbolo de status — era a prova de que sonhos grandes exigem ações grandes.
              </p>
              
              <p className="text-lg">
                Mas um clã não era suficiente. A ambição crescia a cada vitória, a cada membro que se juntava à causa, a cada torneio conquistado. <span className="text-foreground font-semibold">Eles não queriam ser apenas parte da elite. Queriam SER a elite</span>.
              </p>
              
              <div className="bg-[#FFD700]/5 border-l-4 border-[#FFD700] p-6 rounded-r-lg my-8">
                <p className="text-foreground/90 italic text-xl m-0">
                  "Não jogamos para participar. Jogamos para dominar. E quando dominamos, conquistamos."
                </p>
              </div>
            </div>
          </div>

          {/* Chapter 3 */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#FFD700]/20 flex items-center justify-center">
                <span className="text-[#FFD700] font-bold text-xl">III</span>
              </div>
              <h2 className="text-3xl font-bold text-foreground m-0">O Império Cresce</h2>
            </div>
            
            <div className="space-y-6 text-foreground/80 leading-relaxed">
              <p className="text-lg">
                Um clã se tornou dois. Dois se tornaram três. E quando todos achavam que já era suficiente, eles adquiriram o quarto. <span className="text-[#FFD700] font-semibold">Quatro clãs dourados</span> sob o comando de três visionários. Algo nunca visto antes no MushMC.
              </p>
              
              <p className="text-lg">
                Cada clã tinha sua identidade, sua força, sua comunidade. A <span className="text-foreground font-semibold">LIGHT</span>, com sua tradição e excelência. A <span className="text-foreground font-semibold">CHK</span>, com sua moral de campeões. A <span className="text-foreground font-semibold">HAIL</span>, com sua tecnologia e inovação. A <span className="text-foreground font-semibold">JEME</span>, com seu histórico de elite.
              </p>
              
              <p className="text-lg">
                Mas não eram clãs separados. Eram <span className="text-[#FFD700] font-semibold">um império unificado</span>, uma rede de excelência onde os melhores jogadores se reuniam, treinavam e conquistavam juntos.
              </p>
            </div>
          </div>

          {/* Chapter 4 */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#FFD700]/20 flex items-center justify-center">
                <span className="text-[#FFD700] font-bold text-xl">IV</span>
              </div>
              <h2 className="text-3xl font-bold text-foreground m-0">O Legado Continua</h2>
            </div>
            
            <div className="space-y-6 text-foreground/80 leading-relaxed">
              <p className="text-lg">
                Hoje, quando novos jogadores entram no MushMC e perguntam sobre os clãs mais prestigiados, um nome ressoa: <span className="text-[#FFD700] font-bold text-2xl">Rare - As Raridades do Mush</span>. Não é apenas um grupo. É um movimento. Uma filosofia. Um padrão de excelência.
              </p>
              
              <p className="text-lg">
                Mais de <span className="text-[#FFD700] font-semibold">800 membros</span> fazem parte desta família. Torneios conquistados. Recordes quebrados. Lendas criadas. E o mais importante: <span className="text-foreground font-semibold">a jornada está apenas começando</span>.
              </p>
              
              <p className="text-lg">
                Porque para esses visionários, quatro clãs dourados não é o fim. É apenas o começo de algo muito maior. O objetivo? <span className="text-[#FFD700] font-semibold">Todos os clãs dourados do MushMC</span>. E quando você conhece a história deles, você sabe que não é questão de "se", mas de "quando".
              </p>
              
              <div className="bg-gradient-to-r from-[#FFD700]/10 to-transparent border border-[#FFD700]/20 p-8 rounded-lg my-8">
                <p className="text-foreground text-2xl font-bold m-0 mb-4">
                  Rare não é sobre ser o melhor.
                </p>
                <p className="text-foreground/80 text-xl m-0">
                  É sobre redefinir o que "melhor" significa.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
        >
          <div className="bg-background border border-foreground/10 rounded-2xl p-8 text-center">
            <FontAwesomeIcon icon={faCrown} className="text-[#FFD700] text-4xl mb-4" />
            <div className="text-5xl font-bold text-foreground mb-2">4</div>
            <div className="text-foreground/60">Clãs Dourados</div>
          </div>
          
          <div className="bg-background border border-foreground/10 rounded-2xl p-8 text-center">
            <FontAwesomeIcon icon={faUsers} className="text-[#FFD700] text-4xl mb-4" />
            <div className="text-5xl font-bold text-foreground mb-2">800+</div>
            <div className="text-foreground/60">Membros Ativos</div>
          </div>
          
          <div className="bg-background border border-foreground/10 rounded-2xl p-8 text-center">
            <FontAwesomeIcon icon={faTrophy} className="text-[#FFD700] text-4xl mb-4" />
            <div className="text-5xl font-bold text-foreground mb-2">∞</div>
            <div className="text-foreground/60">Vitórias Conquistadas</div>
          </div>
        </motion.div>


      </div>
    </div>
  )
}
