export interface IncomeItem {
  id: string;
  name: string;
  amount: number;
  date?: string;
  category?: string;
}

export interface TransactionItem {
  id: string;
  name: string;
  amount: number;
  date?: string;
  category?: string;
}

export interface BillItem {
  id: string;
  name: string;
  amount: number;
  paid: boolean;
  dueDate?: string;
}

export interface InstallmentItem {
  id: string;
  name: string;
  amount: number;
  tenor: number;
  paidMonths: number;
  createdAt?: string;
}

export interface MonthData {
  incomes: IncomeItem[];
  transactions: TransactionItem[];
  bills: BillItem[];
  installmentPaidKeys: number[]; // indices or IDs of installments paid this month
}

export type MonthDataStore = Record<string, MonthData>;

export interface UserAccount {
  password: string;
  fullName?: string;
  createdAt?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
}
