/**
 * Funções de autenticação e gerenciamento de usuário
 */

import { apiGet, apiPost, apiPut } from './api';

export interface SignupData {
  fullName: string;
  email: string;
  password: string;
  code: string;
  birthDate?: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface VerifyCodeData {
  email: string;
  code: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    _id: string;
    fullName: string;
    email: string;
    emailVerified: boolean;
  };
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
  return apiPost('/auth/signup/verify-code', data);
}

/**
 * Solicitar código de verificação para login
 */
export async function requestLoginCode(data: LoginData): Promise<{ success: boolean; message: string }> {
  return apiPost('/auth/login/request-code', data);
}

/**
 * Verificar código e fazer login
 */
export async function verifyCode(data: VerifyCodeData): Promise<AuthResponse> {
  return apiPost('/auth/login/verify-code', data);
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
  return apiPost('/auth/forgot-password/verify-code', { email, code, newPassword });
}

/**
 * Atualizar preferência de IA
 */
export async function updateAIEnabled(aiEnabled: boolean): Promise<{ success: boolean; message: string; data: { aiEnabled: boolean } }> {
  return apiPut('/v1/user/update', { aiEnabled });
}
