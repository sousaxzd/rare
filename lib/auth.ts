/**
 * Funções de autenticação e gerenciamento de usuário
 */

import { apiGet, apiPost, apiPut, apiDelete } from './api';

export interface SignupData {
  fullName: string;
  email: string;
  password: string;
  code: string;
  birthDate?: string;
  phone?: string;
  taxID?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface VerifyCodeData {
  email: string;
  code: string;
  trustDevice?: boolean;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
  deviceTrusted?: boolean;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  emailVerified: boolean;
  birthDate?: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  admin?: boolean;
  aiEnabled?: boolean; // Added aiEnabled field
  taxID?: string; // CPF/CNPJ (somente leitura)
}

/**
 * Solicitar código de verificação para cadastro
 */
export async function requestSignupCode(email: string, password?: string): Promise<{ success: boolean; message: string }> {
  return apiPost('/auth/signup/request-code', { email, password });
}

/**
 * Cadastrar novo usuário
 */
export async function signup(data: SignupData): Promise<AuthResponse> {
  const response = await apiPost<AuthResponse>('/auth/signup/verify-code', data);
  // Salvar token no localStorage se o cadastro foi bem-sucedido
  if (response.success && response.token && typeof window !== 'undefined') {
    localStorage.setItem('token', response.token);
  }
  return response;
}

/**
 * Solicitar código de verificação para login
 */
export async function requestLoginCode(data: LoginData): Promise<{ 
  success: boolean; 
  message: string;
  trustedDevice?: boolean;
  token?: string;
  user?: User;
  requiresCode?: boolean;
}> {
  const response = await apiPost<any>('/auth/login/request-code', data);
  // Se dispositivo confiável, salvar token
  if (response.trustedDevice && response.token && typeof window !== 'undefined') {
    localStorage.setItem('token', response.token);
  }
  return response;
}

/**
 * Verificar código e fazer login
 */
export async function verifyCode(data: VerifyCodeData): Promise<AuthResponse> {
  const response = await apiPost<AuthResponse>('/auth/login/verify-code', data);
  // Salvar token no localStorage se o login foi bem-sucedido
  if (response.success && response.token && typeof window !== 'undefined') {
    localStorage.setItem('token', response.token);
  }
  return response;
}

/**
 * Obter informações do usuário autenticado
 */
export async function getMe(): Promise<{ success: boolean; user: User }> {
  return apiGet('/auth/me');
}

/**
 * Fazer logout
 */
export async function logout(): Promise<{ success: boolean; message: string }> {
  const response = await apiPost('/auth/logout');
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
  return response;
}

/**
 * Verificar se está autenticado
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('token');
}

/**
 * Obter token do localStorage
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

/**
 * Solicitar código para alterar email
 */
export async function requestEmailChangeCode(newEmail: string): Promise<{ success: boolean; message: string }> {
  return apiPost('/auth/change-email/request-code', { newEmail });
}

/**
 * Alterar email do usuário
 */
export async function changeEmail(newEmail: string, code: string): Promise<{ success: boolean; message: string; user: User }> {
  return apiPost('/auth/change-email/verify-code', { newEmail, code });
}

/**
 * Alterar telefone do usuário
 */
export async function changePhone(phone: string): Promise<{ success: boolean; message: string; user: User }> {
  return apiPost('/auth/change-phone', { phone });
}

/**
 * Alterar nome do usuário
 */
export async function changeName(fullName: string): Promise<{ success: boolean; message: string; user: User }> {
  return apiPost('/auth/change-name', { fullName });
}

/**
 * Alterar avatar do usuário
 */
export async function changeAvatar(file: File): Promise<{ success: boolean; message: string; user: User }> {
  const formData = new FormData();
  formData.append('avatar', file);
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}/api/auth/change-avatar`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    },
    body: formData,
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || data.message || 'Erro ao alterar avatar');
  }
  
  return data;
}

/**
 * Solicitar código para alterar senha
 */
export async function requestPasswordChangeCode(oldPassword?: string, forgotPassword?: boolean): Promise<{ success: boolean; message: string }> {
  return apiPost('/auth/change-password/request-code', { oldPassword, forgotPassword });
}

/**
 * Alterar senha do usuário
 */
export async function changePassword(newPassword: string, code: string): Promise<{ success: boolean; message: string; user: User }> {
  return apiPost('/auth/change-password/verify-code', { newPassword, code });
}

/**
 * Solicitar código para recuperar senha
 */
export async function requestForgotPasswordCode(email: string): Promise<{ success: boolean; message: string }> {
  return apiPost('/auth/forgot-password/request-code', { email });
}

/**
 * Redefinir senha após esquecimento
 */
export async function resetPassword(email: string, code: string, newPassword: string): Promise<AuthResponse> {
  const response = await apiPost<AuthResponse>('/auth/forgot-password/verify-code', { email, code, newPassword });
  // Salvar token no localStorage se a redefinição foi bem-sucedida
  if (response.success && response.token && typeof window !== 'undefined') {
    localStorage.setItem('token', response.token);
  }
  return response;
}

/**
 * Atualizar preferência de IA
 */
export async function updateAIEnabled(aiEnabled: boolean): Promise<{ success: boolean; message: string; data: { aiEnabled: boolean } }> {
  return apiPut('/v1/user/update', { aiEnabled });
}

/**
 * Interface para dispositivo confiável
 */
export interface TrustedDevice {
  id: string;
  deviceName: string;
  userAgent: string;
  ip: string;
  lastUsedAt: string;
  createdAt: string;
}

/**
 * Listar dispositivos confiáveis
 */
export async function getTrustedDevices(): Promise<{ success: boolean; data: TrustedDevice[] }> {
  return apiGet('/v1/user/trusted-devices');
}

/**
 * Remover dispositivo confiável
 */
export async function removeTrustedDevice(deviceId: string): Promise<{ success: boolean; message: string }> {
  return apiDelete(`/v1/user/trusted-devices/${deviceId}`);
}

/**
 * Remover todos os dispositivos confiáveis
 */
export async function removeAllTrustedDevices(): Promise<{ success: boolean; message: string }> {
  return apiDelete('/v1/user/trusted-devices');
}

/**
 * Interface para sessão ativa
 */
export interface Session {
  id: string;
  deviceName: string;
  userAgent: string;
  ip: string;
  lastActivity: string;
  createdAt: string;
  expiresAt: string;
  isCurrent: boolean;
}

/**
 * Listar sessões ativas
 */
export async function getSessions(): Promise<{ success: boolean; data: Session[] }> {
  return apiGet('/v1/user/sessions');
}

/**
 * Revogar sessão específica
 */
export async function revokeSession(sessionId: string): Promise<{ success: boolean; message: string }> {
  return apiDelete(`/v1/user/sessions/${sessionId}`);
}

/**
 * Revogar todas as sessões (exceto a atual)
 */
export async function revokeAllSessions(): Promise<{ success: boolean; message: string; revokedCount?: number }> {
  return apiDelete('/v1/user/sessions');
}
