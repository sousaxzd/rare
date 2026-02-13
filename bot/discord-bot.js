const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
require('dotenv').config();

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const GUILD_ID = process.env.DISCORD_GUILD_ID;

const FOUNDERS_FILE_PATH = path.join(__dirname, '../components/home/founders-section.tsx');

// Criar cliente do Discord
const client = new Client({
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

(async () => {
  try {
    console.log('🔄 Registrando comandos slash...');
    
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands },
    );
    
    console.log('✅ Comandos registrados com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao registrar comandos:', error);
  }
})();

// Função para ler o arquivo e extrair os IDs dos fundadores
function getFoundersIds() {
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
function updateFoundersFile(newIds) {
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
function gitCommitAndPush(message) {
  try {
    const projectDir = path.join(__dirname, '..');
    
    // Executar comandos git
    execSync('git add .', { cwd: projectDir, stdio: 'inherit' });
    execSync(`git commit -m "${message}"`, { cwd: projectDir, stdio: 'inherit' });
    execSync('git push', { cwd: projectDir, stdio: 'inherit' });
    
    return true;
  } catch (error) {
    console.error('Erro ao executar git:', error);
    return false;
  }
}

// Evento quando o bot estiver pronto
client.once('ready', () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
  console.log('🎮 Comandos disponíveis:');
  console.log('   /add_card_rare iduser:<ID>');
  console.log('   /remove_card_rare id:<ID>');
});

// Evento de interação (comandos)
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  try {
    if (commandName === 'add_card_rare') {
      await interaction.deferReply();
      
      const userId = interaction.options.getString('iduser');
      
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
      
      const userId = interaction.options.getString('id');
      
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
client.login(TOKEN);
