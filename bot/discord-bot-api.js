const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const https = require('https');
const http = require('http');
require('dotenv').config();

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const GUILD_ID = process.env.DISCORD_GUILD_ID;
const API_URL = process.env.API_URL || 'http://localhost:3000';
const API_KEY = process.env.API_SECRET_KEY || 'change-this-key';

// Criar cliente do Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ]
});

// Função para fazer requisição HTTP para a API
function makeApiRequest(action, userId) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${API_URL}/api/bot`);
    const isHttps = url.protocol === 'https:';
    const lib = isHttps ? https : http;
    
    const data = JSON.stringify({
      action,
      userId,
      apiKey: API_KEY
    });

    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = lib.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve(response);
        } catch (error) {
          reject(new Error('Erro ao parsear resposta'));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

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

// Evento quando o bot estiver pronto
client.once('ready', () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
  console.log(`🌐 API URL: ${API_URL}`);
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
      
      // Fazer requisição para a API
      const response = await makeApiRequest('add', userId);
      
      if (response.success) {
        await interaction.editReply(
          `✅ Card do usuário \`${userId}\` adicionado com sucesso!\n` +
          `📊 Total de usuários: ${response.totalUsers}\n` +
          `🌐 O site será atualizado automaticamente.`
        );
      } else {
        await interaction.editReply(`❌ ${response.message}`);
      }
      
    } else if (commandName === 'remove_card_rare') {
      await interaction.deferReply();
      
      const userId = interaction.options.getString('id');
      
      // Fazer requisição para a API
      const response = await makeApiRequest('remove', userId);
      
      if (response.success) {
        await interaction.editReply(
          `✅ Card do usuário \`${userId}\` removido com sucesso!\n` +
          `📊 Total de usuários: ${response.totalUsers}\n` +
          `🌐 O site será atualizado automaticamente.`
        );
      } else {
        await interaction.editReply(`❌ ${response.message}`);
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
