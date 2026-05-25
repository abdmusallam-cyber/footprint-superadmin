export type UserRole = 'ADMIN' | 'CASHIER';
export type TenantStatus = 'active' | 'suspended' | 'expired' | 'trial';
export type TenantPlan = 'basic' | 'pro' | 'enterprise';

export interface Tenant {
  id: string;
  name: string;
  dbId: string;
  adminEmail: string;
  contactPhone?: string;
  address?: string;
  status: TenantStatus;
  plan: TenantPlan;
  maxUsers?: number;
  maxBranches?: number;
  expiresAt: string;
  createdAt: string;
  updatedAt?: string;
  notes?: string;
  logoUrl?: string;
}

export interface TenantStats {
  totalOrders?: number;
  totalRevenue?: number;
  activeUsers?: number;
  lastActivity?: string;
}

export const __isTypesModule = true;
