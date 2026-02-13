import { NextRequest, NextResponse } from 'next/server';
import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, Interaction } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const TOKEN = process.env.DISCORD_TOKEN || 'seu_token_aqui';
const CLIENT_ID = process.env.DISCORD_CLIENT_ID || '1464378642871357624';
const GUILD_ID = process.env.DISCORD_GUILD_ID || '1464288982627127358';

let client: Client | null = null;
let isInitialized = false;

const FOUNDERS_FILE_PATH = path.join(process.cwd(), 'components/home/founders-section.tsx');

// Função para ler o arquivo e extrair os IDs dos fundadores
function getFoundersIds(): string[] {
  const fileContent = fs.readFileSync(FOUNDERS_FILE_PATH, 'utf8');
  const match = fileContent.match(/const FOUNDERS = \[([\s\S]*?)\]/);
  
  if (!match) {
    throw new Error('Não foi possível encontrar o array FOUNDERS');
  }
  
  const foundersString = match[1];
  const ids = foundersString
    .split(',')
    .map(id => id.trim().replace(/['"]/g, ''))
    .filter(id => id.length > 0);
  
  return ids;
}

// Função para atualizar o arquivo com novos IDs
function updateFoundersFile(newIds: string[]): void {
  let fileContent = fs.readFileSync(FOUNDERS_FILE_PATH, 'utf8');
  
  const formattedIds = newIds.map(id => `  '${id}'`).join(',\n');
  const newFoundersArray = `const FOUNDERS = [\n${formattedIds}\n]`;
  
  fileContent = fileContent.replace(
    /const FOUNDERS = \[[\s\S]*?\]/,
    newFoundersArray
  );
  
  fs.writeFileSync(FOUNDERS_FILE_PATH, fileContent, 'utf8');
}

// Função para fazer commit e push
function gitCommitAndPush(message: string): boolean {
  try {
    const projectDir = process.cwd();
    
    execSync('git add .', { cwd: projectDir });
    execSync(`git commit -m "${message}"`, { cwd: projectDir });
    execSync('git push', { cwd: projectDir });
    
    return true;
  } catch (error) {
    console.error('Erro ao executar git:', error);
    return false;
  }
}

// Inicializar bot
async function initializeBot() {
  if (isInitialized) {
    return { success: true, message: 'Bot já está inicializado' };
  }

  try {
    client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
      ]
    });

    // Definir comandos
    const commands = [
      new SlashCommandBuilder()
        .setName('add_card_rare')
        .setDescription('Adiciona um card de usuário na página Início')
        .addStringOption(option =>
          option.setName('iduser')
            .setDescription('ID do usuário do Discord')
            .setRequired(true)
        ),
      new SlashCommandBuilder()
        .setName('remove_card_rare')
        .setDescription('Remove um card de usuário da página Início')
        .addStringOption(option =>
          option.setName('id')
            .setDescription('ID do usuário do Discord')
            .setRequired(true)
        ),
    ].map(command => command.toJSON());

    // Registrar comandos
    const rest = new REST({ version: '10' }).setToken(TOKEN);
    
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands },
    );

    // Evento quando o bot estiver pronto
    client.once('ready', () => {
      console.log(`✅ Bot conectado como ${client?.user?.tag}`);
    });

    // Evento de interação (comandos)
    client.on('interactionCreate', async (interaction: Interaction) => {
      if (!interaction.isChatInputCommand()) return;

      const { commandName } = interaction;

      try {
        if (commandName === 'add_card_rare') {
          await interaction.deferReply();
          
          const userId = interaction.options.getString('iduser', true);
          
          // Validar ID
          if (!/^\d+$/.test(userId)) {
            await interaction.editReply('❌ ID inválido! Use apenas números.');
            return;
          }
          
          // Ler IDs atuais
          const currentIds = getFoundersIds();
          
          // Verificar se já existe
          if (currentIds.includes(userId)) {
            await interaction.editReply(`❌ O usuário \`${userId}\` já está na lista de raridades!`);
            return;
          }
          
          // Adicionar novo ID
          const newIds = [...currentIds, userId];
          updateFoundersFile(newIds);
          
          // Fazer commit
          const gitSuccess = gitCommitAndPush(`feat: adicionar card de usuário ${userId}`);
          
          if (gitSuccess) {
            await interaction.editReply(
              `✅ Card do usuário \`${userId}\` adicionado com sucesso!\n` +
              `📝 Commit realizado e enviado para o repositório.\n` +
              `🌐 O site será atualizado em breve.`
            );
          } else {
            await interaction.editReply(
              `⚠️ Card adicionado ao arquivo, mas houve um erro ao fazer commit.\n` +
              `Por favor, verifique o repositório manualmente.`
            );
          }
          
        } else if (commandName === 'remove_card_rare') {
          await interaction.deferReply();
          
          const userId = interaction.options.getString('id', true);
          
          // Ler IDs atuais
          const currentIds = getFoundersIds();
          
          // Verificar se existe
          if (!currentIds.includes(userId)) {
            await interaction.editReply(`❌ O usuário \`${userId}\` não está na lista de raridades!`);
            return;
          }
          
          // Remover ID
          const newIds = currentIds.filter(id => id !== userId);
          
          if (newIds.length === 0) {
            await interaction.editReply('❌ Não é possível remover todos os usuários!');
            return;
          }
          
          updateFoundersFile(newIds);
          
          // Fazer commit
          const gitSuccess = gitCommitAndPush(`feat: remover card de usuário ${userId}`);
          
          if (gitSuccess) {
            await interaction.editReply(
              `✅ Card do usuário \`${userId}\` removido com sucesso!\n` +
              `📝 Commit realizado e enviado para o repositório.\n` +
              `🌐 O site será atualizado em breve.`
            );
          } else {
            await interaction.editReply(
              `⚠️ Card removido do arquivo, mas houve um erro ao fazer commit.\n` +
              `Por favor, verifique o repositório manualmente.`
            );
          }
        }
      } catch (error) {
        console.error('Erro ao processar comando:', error);
        
        if (interaction.deferred) {
          await interaction.editReply('❌ Ocorreu um erro ao processar o comando. Verifique os logs.');
        } else {
          await interaction.reply('❌ Ocorreu um erro ao processar o comando. Verifique os logs.');
        }
      }
    });

    // Conectar o bot
    await client.login(TOKEN);
    
    isInitialized = true;
    
    return { 
      success: true, 
      message: 'Bot inicializado e comandos sincronizados com sucesso!',
      commands: ['add_card_rare', 'remove_card_rare']
    };
  } catch (error) {
    console.error('Erro ao inicializar bot:', error);
    return { 
      success: false, 
      message: 'Erro ao inicializar bot',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}

// Rota GET para inicializar o bot
export async function GET(request: NextRequest) {
  const result = await initializeBot();
  return NextResponse.json(result);
}

// Rota POST para comandos manuais (opcional)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId } = body;

    if (!action || !userId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Ação e userId são obrigatórios' 
      }, { status: 400 });
    }

    const currentIds = getFoundersIds();

    if (action === 'add') {
      if (currentIds.includes(userId)) {
        return NextResponse.json({ 
          success: false, 
          message: 'Usuário já existe' 
        }, { status: 400 });
      }

      const newIds = [...currentIds, userId];
      updateFoundersFile(newIds);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Usuário adicionado com sucesso',
        ids: newIds
      });
    } else if (action === 'remove') {
      if (!currentIds.includes(userId)) {
        return NextResponse.json({ 
          success: false, 
          message: 'Usuário não encontrado' 
        }, { status: 404 });
      }

      const newIds = currentIds.filter(id => id !== userId);
      updateFoundersFile(newIds);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Usuário removido com sucesso',
        ids: newIds
      });
    }

    return NextResponse.json({ 
      success: false, 
      message: 'Ação inválida' 
    }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao processar requisição',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}
