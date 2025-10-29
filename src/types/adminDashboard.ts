import type { LucideIcon } from 'lucide-react';
import type { WorkflowKey } from '../data/adminWorkflows';
import type { WorkflowAction } from '../data/adminWorkflows';

export type StatCard = {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  gradient: string;
  description: string;
  operations: WorkflowAction[];
  targetWorkflow: WorkflowKey;
};

export type QuickAction = {
  label: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  operations: WorkflowAction[];
  targetWorkflow: WorkflowKey;
};

export type ShopRequest = {
  id: string;
  shopName: string;
  owner: string;
  packageType: string;
  stars: number;
  paymentStatus: string;
  status: string;
  submittedAt: string;
  email: string;
  phone: string;
};

export type UserAlert = {
  id: string;
  name: string;
  issue: string;
  stars: number;
  lastAction: string;
  severity: string;
};

export type PaymentQueueItem = {
  id: string;
  shopName: string;
  owner: string;
  amount: number;
  method: string;
  submittedAt: string;
  status: string;
};

export type SystemActivityItem = {
  time: string;
  actor: string;
  action: string;
  type: string;
};

export type ShopPerformanceItem = {
  id: string;
  name: string;
  packageType: string;
  revenue: number;
  revenueLimit: number;
  orders: number;
  supportUsed: number;
};

export type WorkflowFocus =
  | { type: 'stat'; data: StatCard }
  | { type: 'quickAction'; data: QuickAction }
  | { type: 'shopRequest'; data: ShopRequest }
  | { type: 'payment'; data: PaymentQueueItem }
  | { type: 'userAlert'; data: UserAlert }
  | { type: 'systemActivity'; data: SystemActivityItem }
  | { type: 'shopPerformance'; data: ShopPerformanceItem };
