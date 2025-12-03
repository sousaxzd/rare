/**
 * Serviços para gerenciamento de plano do usuário
 */

import { apiGet, apiPut } from './api';

export interface UserPlan {
  id: string;
  name: string;
  transactionFee: number;
  transactionFeeInReais: string;
  monthlyFee: number;
  monthlyFeeInReais: string;
  minTransactions: number;
  maxTransactions: number | null;
}

export interface UserPlanInfo {
  currentPlan: UserPlan;
  planDates: {
    startDate: string | null;
    endDate: string | null;
    renewalDate: string | null;
    daysRemaining: number | null;
  };
  settings: {
    autoRenew: boolean;
    autoUpgrade: boolean;
  };
  balance: number;
  balanceInReais: string;
}

export interface AvailablePlan {
  id: string;
  name: string;
  transactionFee: number;
  transactionFeeInReais: string;
  monthlyFee: number;
  monthlyFeeInReais: string;
  minTransactions: number;
  maxTransactions: number | null;
  downgradeTo: string | null;
  order: number;
}

/**
 * Obter informações do plano atual do usuário
 */
export async function getMyPlan(): Promise<{ success: boolean; data: UserPlanInfo }> {
  return apiGet('/auth/plan');
}

/**
 * Listar planos disponíveis
 */
export async function getAvailablePlans(): Promise<{ success: boolean; data: { plans: AvailablePlan[] } }> {
  return apiGet('/auth/plan/available');
}

/**
 * Fazer upgrade do plano
 */
export async function upgradePlan(plan: string): Promise<{
  success: boolean;
  message: string;
  data: {
    plan: string;
    balance: number;
    planEndDate: string;
    creditUsed: number;
    amountPaid: number;
  };
}> {
  return apiPut('/auth/plan/upgrade', { plan });
}

/**
 * Atualizar configurações do plano (autoRenew, autoUpgrade)
 */
export async function updatePlanSettings(data: {
  autoRenew?: boolean;
  autoUpgrade?: boolean;
}): Promise<{
  success: boolean;
  message: string;
  data: {
    settings: {
      autoRenew: boolean;
      autoUpgrade: boolean;
    };
  };
}> {
  return apiPut('/auth/plan/settings', data);
}

