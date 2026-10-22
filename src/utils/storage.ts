import { MonthData, MonthDataStore, InstallmentItem, UserAccount } from '../types';
import { getCurrentMonthKey } from './formatters';

const STORAGE_USERS_KEY = 'budgeting_users';
const STORAGE_CURRENT_USER_KEY = 'budgeting_current_user';

export function getStoredUsers(): Record<string, UserAccount> {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error('Failed to parse users from localStorage', err);
    return {};
  }
}

export function saveStoredUsers(users: Record<string, UserAccount>): void {
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users', err);
  }
}

export function getStoredCurrentUser(): string | null {
  try {
    return localStorage.getItem(STORAGE_CURRENT_USER_KEY);
  } catch {
    return null;
  }
}

export function setStoredCurrentUser(username: string | null): void {
  try {
    if (username) {
      localStorage.setItem(STORAGE_CURRENT_USER_KEY, username);
    } else {
      localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
    }
  } catch (err) {
    console.error('Failed to update current user', err);
  }
}

export function getUserMonthDataStore(username: string): MonthDataStore {
  try {
    const key = `budgeting_data_${username.toLowerCase()}`;
    const raw = localStorage.getItem(key);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (err) {
    console.error(`Failed to load data for user ${username}`, err);
    return {};
  }
}

export function saveUserMonthDataStore(username: string, data: MonthDataStore): void {
  try {
    const key = `budgeting_data_${username.toLowerCase()}`;
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed to save data for user ${username}`, err);
  }
}

export function getUserInstallments(username: string): InstallmentItem[] {
  try {
    const key = `budgeting_installments_${username.toLowerCase()}`;
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error(`Failed to load installments for user ${username}`, err);
    return [];
  }
}

export function saveUserInstallments(username: string, installments: InstallmentItem[]): void {
  try {
    const key = `budgeting_installments_${username.toLowerCase()}`;
    localStorage.setItem(key, JSON.stringify(installments));
  } catch (err) {
    console.error(`Failed to save installments for user ${username}`, err);
  }
}

export function getOrCreateMonthData(store: MonthDataStore, monthKey: string): MonthData {
  if (store[monthKey]) {
    const data = store[monthKey];
    return {
      incomes: Array.isArray(data.incomes) ? data.incomes : [],
      transactions: Array.isArray(data.transactions) ? data.transactions : [],
      bills: Array.isArray(data.bills) ? data.bills : [],
      installmentPaidKeys: Array.isArray(data.installmentPaidKeys) ? data.installmentPaidKeys : [],
    };
  }

  return {
    incomes: [],
    transactions: [],
    bills: [],
    installmentPaidKeys: [],
  };
}

export function seedDemoData(username: string): { store: MonthDataStore; installments: InstallmentItem[] } {
  const currentMonth = getCurrentMonthKey();
  const demoStore: MonthDataStore = {
    [currentMonth]: {
      incomes: [
        { id: 'inc-1', name: 'Gaji Pokok Bulanan', amount: 8500000, category: 'Gaji', date: `${currentMonth}-01` },
        { id: 'inc-2', name: 'Project Freelance Desain', amount: 2000000, category: 'Freelance', date: `${currentMonth}-08` },
      ],
      transactions: [
        { id: 'tx-1', name: 'Belanja Mingguan Supermarket', amount: 450000, category: 'Belanja', date: `${currentMonth}-03` },
        { id: 'tx-2', name: 'Bensin Motor & Parkir', amount: 80000, category: 'Transportasi', date: `${currentMonth}-05` },
        { id: 'tx-3', name: 'Makan Siang Bareng Tim', amount: 65000, category: 'Makanan', date: `${currentMonth}-07` },
        { id: 'tx-4', name: 'Kopi & Snack Santai', amount: 45000, category: 'Makanan', date: `${currentMonth}-10` },
      ],
      bills: [
        { id: 'bill-1', name: 'Listrik Token PLN', amount: 350000, paid: true, dueDate: 'Tanggal 5' },
        { id: 'bill-2', name: 'Internet WiFi IndiHome', amount: 380000, paid: true, dueDate: 'Tanggal 10' },
        { id: 'bill-3', name: 'Sewa Kost Bulanan', amount: 1500000, paid: false, dueDate: 'Tanggal 25' },
        { id: 'bill-4', name: 'BPJS Kesehatan', amount: 150000, paid: false, dueDate: 'Tanggal 15' },
      ],
      installmentPaidKeys: [0],
    },
  };

  const demoInstallments: InstallmentItem[] = [
    { id: 'inst-1', name: 'Smartphone Samsung Galaxy', amount: 650000, tenor: 12, paidMonths: 5 },
    { id: 'inst-2', name: 'Laptop Kerja ASUS Zenbook', amount: 950000, tenor: 10, paidMonths: 7 },
  ];

  saveUserMonthDataStore(username, demoStore);
  saveUserInstallments(username, demoInstallments);

  return { store: demoStore, installments: demoInstallments };
}
