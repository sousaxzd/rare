/**
 * Configuração da API
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export const API_BASE_URL = `${BACKEND_URL}/api`;

/**
 * Função genérica para fazer requisições à API
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Todas as rotas usam /api como base
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Adicionar token se existir
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include', // Para cookies
  };

  try {
    // Adicionar timeout de 10 segundos
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    
    // Se não houver conteúdo, retornar sucesso
    if (response.status === 204) {
      return {} as T;
    }

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      // Se não conseguir fazer parse do JSON, pode ser erro de rede ou servidor
      if (!response.ok) {
        // Criar erro com status para facilitar tratamento
        const error = new Error(`Erro na requisição: ${response.statusText}`) as Error & { status?: number; response?: Response };
        error.status = response.status;
        error.response = response;
        throw error;
      }
      // Se response.ok mas não tem JSON, retornar objeto vazio
      return {} as T;
    }

    if (!response.ok) {
      // Criar erro com status para facilitar tratamento
      const error = new Error(data.error || data.message || `Erro na requisição: ${response.statusText}`) as Error & { status?: number; response?: Response };
      error.status = response.status;
      error.response = response;
      throw error;
    }

    return data;
  } catch (error) {
    // Tratar erros de conexão/rede
    if (error instanceof Error) {
      // Erro de abort (timeout)
      if (error.name === 'AbortError') {
        const timeoutError = new Error('Tempo de espera esgotado. O servidor pode estar indisponível.') as Error & { status?: number };
        timeoutError.status = 0; // Status 0 indica erro de rede
        throw timeoutError;
      }
      
      // Erros de rede (backend não disponível)
      if (
        error.message.includes('Failed to fetch') ||
        error.message.includes('NetworkError') ||
        error.message.includes('Network request failed') ||
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('ERR_CONNECTION_REFUSED') ||
        error.message.includes('ERR_NETWORK_CHANGED')
      ) {
        const networkError = new Error('Servidor indisponível. Verifique se o backend está rodando.') as Error & { status?: number };
        networkError.status = 0; // Status 0 indica erro de rede
        throw networkError;
      }
      
      // Se já tem status, manter
      throw error;
    }
    throw new Error('Erro desconhecido na requisição');
  }
}

/**
 * GET request
 */
export function apiGet<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'GET' });
}

/**
 * POST request
 */
export function apiPost<T>(endpoint: string, body?: unknown): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * PUT request
 */
export function apiPut<T>(endpoint: string, body?: unknown): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * DELETE request
 */
export function apiDelete<T>(endpoint: string, body?: unknown): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'DELETE',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * Upload file request
 */
export async function apiUpload<T>(endpoint: string, file: File, fieldName: string = 'file'): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const formData = new FormData();
  formData.append(fieldName, file);

  const defaultHeaders: HeadersInit = {};

  // Adicionar token se existir
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    method: 'PUT',
    headers: defaultHeaders,
    credentials: 'include',
    body: formData,
  };

  try {
    // Adicionar timeout de 30 segundos para uploads
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Erro na requisição: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    // Tratar erros de conexão/rede
    if (error instanceof Error) {
      // Erro de abort (timeout)
      if (error.name === 'AbortError') {
        throw new Error('Tempo de espera esgotado. O servidor pode estar indisponível.');
      }
      
      // Erros de rede (backend não disponível)
      if (
        error.message.includes('Failed to fetch') ||
        error.message.includes('NetworkError') ||
        error.message.includes('Network request failed') ||
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('ERR_CONNECTION_REFUSED') ||
        error.message.includes('ERR_NETWORK_CHANGED')
      ) {
        throw new Error('Servidor indisponível. Verifique se o backend está rodando.');
      }
      
      throw error;
    }
    throw new Error('Erro desconhecido na requisição');
  }
}

