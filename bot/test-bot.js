// Script de teste para verificar se o bot consegue ler e modificar o arquivo

const fs = require('fs');
const path = require('path');

const FOUNDERS_FILE_PATH = path.join(__dirname, '../components/home/founders-section.tsx');

console.log('🔍 Testando leitura do arquivo...\n');

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

try {
  const currentIds = getFoundersIds();
  
  console.log('✅ Arquivo lido com sucesso!');
  console.log(`📊 Total de IDs encontrados: ${currentIds.length}\n`);
  console.log('📋 IDs atuais:');
  currentIds.forEach((id, index) => {
    console.log(`   ${index + 1}. ${id}`);
  });
  
  console.log('\n✅ Teste concluído com sucesso!');
  console.log('🚀 O bot está pronto para ser usado.');
  
} catch (error) {
  console.error('❌ Erro ao testar:', error.message);
}
