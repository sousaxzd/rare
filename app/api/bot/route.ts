import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const FOUNDERS_FILE_PATH = path.join(process.cwd(), 'components/home/founders-section.tsx');

// Função para ler o arquivo e extrair os IDs dos fundadores
function getFoundersIds(): string[] {
  try {
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
  } catch (error) {
    console.error('Erro ao ler arquivo:', error);
    return [];
  }
}

// Função para atualizar o arquivo com novos IDs
function updateFoundersFile(newIds: string[]): boolean {
  try {
    let fileContent = fs.readFileSync(FOUNDERS_FILE_PATH, 'utf8');
    
    const formattedIds = newIds.map(id => `  '${id}'`).join(',\n');
    const newFoundersArray = `const FOUNDERS = [\n${formattedIds}\n]`;
    
    fileContent = fileContent.replace(
      /const FOUNDERS = \[[\s\S]*?\]/,
      newFoundersArray
    );
    
    fs.writeFileSync(FOUNDERS_FILE_PATH, fileContent, 'utf8');
    return true;
  } catch (error) {
    console.error('Erro ao atualizar arquivo:', error);
    return false;
  }
}

// Rota GET para verificar status e listar IDs
export async function GET(request: NextRequest) {
  try {
    const currentIds = getFoundersIds();
    
    return NextResponse.json({ 
      success: true,
      message: 'API funcionando',
      totalUsers: currentIds.length,
      users: currentIds,
      note: 'Use o bot Discord standalone na pasta bot/ para gerenciar os cards'
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao processar requisição',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}

// Rota POST para adicionar/remover usuários via API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId, apiKey } = body;

    // Validação simples de API key (adicione uma chave secreta no .env)
    const validApiKey = process.env.API_SECRET_KEY || 'change-this-key';
    if (apiKey !== validApiKey) {
      return NextResponse.json({ 
        success: false, 
        message: 'API key inválida' 
      }, { status: 401 });
    }

    if (!action || !userId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Ação e userId são obrigatórios' 
      }, { status: 400 });
    }

    // Validar ID
    if (!/^\d+$/.test(userId)) {
      return NextResponse.json({ 
        success: false, 
        message: 'ID inválido! Use apenas números.' 
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
      const updated = updateFoundersFile(newIds);
      
      if (updated) {
        return NextResponse.json({ 
          success: true, 
          message: 'Usuário adicionado com sucesso',
          totalUsers: newIds.length,
          users: newIds
        });
      } else {
        return NextResponse.json({ 
          success: false, 
          message: 'Erro ao atualizar arquivo' 
        }, { status: 500 });
      }
      
    } else if (action === 'remove') {
      if (!currentIds.includes(userId)) {
        return NextResponse.json({ 
          success: false, 
          message: 'Usuário não encontrado' 
        }, { status: 404 });
      }

      if (currentIds.length <= 1) {
        return NextResponse.json({ 
          success: false, 
          message: 'Não é possível remover todos os usuários' 
        }, { status: 400 });
      }

      const newIds = currentIds.filter(id => id !== userId);
      const updated = updateFoundersFile(newIds);
      
      if (updated) {
        return NextResponse.json({ 
          success: true, 
          message: 'Usuário removido com sucesso',
          totalUsers: newIds.length,
          users: newIds
        });
      } else {
        return NextResponse.json({ 
          success: false, 
          message: 'Erro ao atualizar arquivo' 
        }, { status: 500 });
      }
    }

    return NextResponse.json({ 
      success: false, 
      message: 'Ação inválida. Use "add" ou "remove"' 
    }, { status: 400 });
    
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao processar requisição',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}
