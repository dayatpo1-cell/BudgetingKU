import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { AuthScreen } from './components/AuthScreen';
import { PeriodSelector } from './components/PeriodSelector';
import { SummaryCards } from './components/SummaryCards';
import { IncomeSection } from './components/IncomeSection';
import { DailyExpenseSection } from './components/DailyExpenseSection';
import { MonthlyBillsSection } from './components/MonthlyBillsSection';
import { InstallmentsSection } from './components/InstallmentsSection';
import { ToastContainer } from './components/Toast';
import { ConfirmModal } from './components/Modal';
import { ExportModal } from './components/ExportModal';
import {
  MonthData,
  MonthDataStore,
  InstallmentItem,
  IncomeItem,
  TransactionItem,
  BillItem,
  ToastMessage,
} from './types';
import {
  getStoredCurrentUser,
  setStoredCurrentUser,
  getUserMonthDataStore,
  saveUserMonthDataStore,
  getUserInstallments,
  saveUserInstallments,
  getOrCreateMonthData,
  seedDemoData,
} from './utils/storage';
import { getCurrentMonthKey, getAdjacentMonthKey, formatMonthLabel } from './utils/formatters';

export default function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(() => getStoredCurrentUser());
  const [currentMonthKey, setCurrentMonthKey] = useState<string>(() => getCurrentMonthKey());
  const [dataStore, setDataStore] = useState<MonthDataStore>({});
  const [installments, setInstallments] = useState<InstallmentItem[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Modal dialog state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    confirmVariant?: 'danger' | 'primary' | 'success';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Toast Helper
  const showToast = useCallback(
    (type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string) => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, type, message, title }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    },
    []
  );

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load user data on login or user change
  useEffect(() => {
    if (currentUser) {
      const loadedStore = getUserMonthDataStore(currentUser);
      const loadedInstallments = getUserInstallments(currentUser);

      // If user is empty, provide demo prompt or blank
      setDataStore(loadedStore);
      setInstallments(loadedInstallments);
    } else {
      setDataStore({});
      setInstallments([]);
    }
  }, [currentUser]);

  // Sync to localStorage whenever dataStore changes
  const updateDataStore = (newStore: MonthDataStore) => {
    setDataStore(newStore);
    if (currentUser) {
      saveUserMonthDataStore(currentUser, newStore);
    }
  };

  // Sync to localStorage whenever installments change
  const updateInstallments = (newInstallments: InstallmentItem[]) => {
    setInstallments(newInstallments);
    if (currentUser) {
      saveUserInstallments(currentUser, newInstallments);
    }
  };

  const handleLoginSuccess = (username: string) => {
    setStoredCurrentUser(username);
    setCurrentUser(username);
  };

  const handleLogout = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Keluar dari Akun',
      message: 'Apakah Anda yakin ingin keluar dari sesi BudgetingKU saat ini?',
      confirmLabel: 'Keluar',
      confirmVariant: 'danger',
      onConfirm: () => {
        setStoredCurrentUser(null);
        setCurrentUser(null);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        showToast('info', 'Anda telah keluar dari aplikasi.');
      },
    });
  };

  const currentMonthData: MonthData = getOrCreateMonthData(dataStore, currentMonthKey);

  // 1. Add Income
  const handleAddIncome = (income: Omit<IncomeItem, 'id'>) => {
    const newItem: IncomeItem = {
      ...income,
      id: `inc-${Date.now()}`,
    };
    const updatedMonthData: MonthData = {
      ...currentMonthData,
      incomes: [newItem, ...currentMonthData.incomes],
    };
    updateDataStore({
      ...dataStore,
      [currentMonthKey]: updatedMonthData,
    });
    showToast('success', `Pemasukan "${newItem.name}" berhasil dicatat.`);
  };

  // 2. Delete Income
  const handleDeleteIncome = (index: number) => {
    const itemToDelete = currentMonthData.incomes[index];
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Pemasukan',
      message: `Hapus pemasukan "${itemToDelete?.name}" dari periode ini?`,
      confirmLabel: 'Hapus',
      confirmVariant: 'danger',
      onConfirm: () => {
        const nextIncomes = [...currentMonthData.incomes];
        nextIncomes.splice(index, 1);
        updateDataStore({
          ...dataStore,
          [currentMonthKey]: {
            ...currentMonthData,
            incomes: nextIncomes,
          },
        });
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        showToast('info', 'Pemasukan telah dihapus.');
      },
    });
  };

  // 3. Add Daily Transaction
  const handleAddTransaction = (transaction: Omit<TransactionItem, 'id'>) => {
    const newItem: TransactionItem = {
      ...transaction,
      id: `tx-${Date.now()}`,
    };
    const updatedMonthData: MonthData = {
      ...currentMonthData,
      transactions: [newItem, ...currentMonthData.transactions],
    };
    updateDataStore({
      ...dataStore,
      [currentMonthKey]: updatedMonthData,
    });
    showToast('success', `Pengeluaran "${newItem.name}" berhasil dicatat.`);
  };

  // 4. Delete Daily Transaction
  const handleDeleteTransaction = (index: number) => {
    const itemToDelete = currentMonthData.transactions[index];
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Transaksi',
      message: `Hapus catatan pengeluaran "${itemToDelete?.name}"?`,
      confirmLabel: 'Hapus',
      confirmVariant: 'danger',
      onConfirm: () => {
        const nextTrans = [...currentMonthData.transactions];
        nextTrans.splice(index, 1);
        updateDataStore({
          ...dataStore,
          [currentMonthKey]: {
            ...currentMonthData,
            transactions: nextTrans,
          },
        });
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        showToast('info', 'Transaksi berhasil dihapus.');
      },
    });
  };

  // 5. Add Monthly Bill
  const handleAddBill = (bill: Omit<BillItem, 'id' | 'paid'>) => {
    const newItem: BillItem = {
      ...bill,
      id: `bill-${Date.now()}`,
      paid: false,
    };
    const updatedMonthData: MonthData = {
      ...currentMonthData,
      bills: [...currentMonthData.bills, newItem],
    };
    updateDataStore({
      ...dataStore,
      [currentMonthKey]: updatedMonthData,
    });
    showToast('success', `Tagihan "${newItem.name}" ditambahkan ke checklist.`);
  };

  // 6. Toggle Bill Paid Status
  const handleToggleBillPaid = (index: number) => {
    const nextBills = [...currentMonthData.bills];
    if (!nextBills[index]) return;
    const isNowPaid = !nextBills[index].paid;
    nextBills[index] = {
      ...nextBills[index],
      paid: isNowPaid,
    };
    updateDataStore({
      ...dataStore,
      [currentMonthKey]: {
        ...currentMonthData,
        bills: nextBills,
      },
    });

    if (isNowPaid) {
      showToast('success', `Tagihan "${nextBills[index].name}" ditandai Lunas.`);
    }
  };

  // 7. Delete Bill
  const handleDeleteBill = (index: number) => {
    const itemToDelete = currentMonthData.bills[index];
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Tagihan',
      message: `Hapus tagihan "${itemToDelete?.name}" dari daftar periode ini?`,
      confirmLabel: 'Hapus',
      confirmVariant: 'danger',
      onConfirm: () => {
        const nextBills = [...currentMonthData.bills];
        nextBills.splice(index, 1);
        updateDataStore({
          ...dataStore,
          [currentMonthKey]: {
            ...currentMonthData,
            bills: nextBills,
          },
        });
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        showToast('info', 'Tagihan telah dihapus.');
      },
    });
  };

  // 8. Copy Previous Month Bills (Key feature from prototype)
  const handleCopyPreviousMonthBills = () => {
    const prevMonthKey = getAdjacentMonthKey(currentMonthKey, -1);
    const prevData = dataStore[prevMonthKey];

    if (!prevData || !prevData.bills || prevData.bills.length === 0) {
      showToast(
        'warning',
        `Tidak ada data tagihan rutin di bulan sebelumnya (${formatMonthLabel(prevMonthKey)}).`,
        'Salin Gagal'
      );
      return;
    }

    const copiedBills: BillItem[] = prevData.bills.map((b) => ({
      id: `bill-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: b.name,
      amount: b.amount,
      dueDate: b.dueDate,
      paid: false,
    }));

    setConfirmModal({
      isOpen: true,
      title: 'Salin Tagihan Bulan Lalu',
      message: `Salin ${copiedBills.length} daftar tagihan dari ${formatMonthLabel(
        prevMonthKey
      )} ke bulan ini? (Semua diset Belum Dibayar)`,
      confirmLabel: 'Salin Sekarang',
      confirmVariant: 'primary',
      onConfirm: () => {
        updateDataStore({
          ...dataStore,
          [currentMonthKey]: {
            ...currentMonthData,
            bills: [...currentMonthData.bills, ...copiedBills],
          },
        });
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        showToast(
          'success',
          `Berhasil menyalin ${copiedBills.length} tagihan rutin dari bulan ${formatMonthLabel(prevMonthKey)}!`,
          'Salin Berhasil'
        );
      },
    });
  };

  // 9. Reset Bills (mark all unpaid in current month)
  const handleResetBills = () => {
    if (currentMonthData.bills.length === 0) return;

    setConfirmModal({
      isOpen: true,
      title: 'Reset Checklist Tagihan',
      message: 'Setel ulang status semua tagihan di bulan ini menjadi Belum Dibayar?',
      confirmLabel: 'Reset Status',
      confirmVariant: 'danger',
      onConfirm: () => {
        const nextBills = currentMonthData.bills.map((b) => ({ ...b, paid: false }));
        updateDataStore({
          ...dataStore,
          [currentMonthKey]: {
            ...currentMonthData,
            bills: nextBills,
          },
        });
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        showToast('info', 'Status tagihan bulan ini berhasil direset.');
      },
    });
  };

  // 10. Add Installment (Tenor)
  const handleAddInstallment = (item: Omit<InstallmentItem, 'id' | 'paidMonths'>) => {
    const newItem: InstallmentItem = {
      ...item,
      id: `inst-${Date.now()}`,
      paidMonths: 0,
      createdAt: new Date().toISOString(),
    };
    updateInstallments([...installments, newItem]);
    showToast('success', `Tracker cicilan "${newItem.name}" berhasil dibuat.`);
  };

  // 11. Toggle Installment Paid for current month
  const handleToggleInstallmentPaid = (index: number) => {
    const inst = installments[index];
    if (!inst) return;

    const currentPaidKeys = [...(currentMonthData.installmentPaidKeys || [])];
    const keyIndex = currentPaidKeys.indexOf(index);
    const updatedInstallments = [...installments];

    if (keyIndex > -1) {
      // Already paid this month -> revert/uncheck
      currentPaidKeys.splice(keyIndex, 1);
      if (inst.paidMonths > 0) {
        updatedInstallments[index] = {
          ...inst,
          paidMonths: inst.paidMonths - 1,
        };
      }
      showToast('info', `Pembayaran cicilan "${inst.name}" untuk bulan ini dibatalkan.`);
    } else {
      // Not yet paid this month -> mark paid
      if (inst.paidMonths < inst.tenor) {
        currentPaidKeys.push(index);
        const newPaidMonths = inst.paidMonths + 1;
        updatedInstallments[index] = {
          ...inst,
          paidMonths: newPaidMonths,
        };
        showToast(
          'success',
          `Cicilan "${inst.name}" ke-${newPaidMonths} dari ${inst.tenor} berhasil dibayar bulan ini!`,
          'Pembayaran Berhasil'
        );
      } else {
        showToast('info', `Cicilan "${inst.name}" sudah lunas 100%.`);
      }
    }

    updateInstallments(updatedInstallments);
    updateDataStore({
      ...dataStore,
      [currentMonthKey]: {
        ...currentMonthData,
        installmentPaidKeys: currentPaidKeys,
      },
    });
  };

  // 12. Delete Installment
  const handleDeleteInstallment = (index: number) => {
    const inst = installments[index];
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Tracker Cicilan',
      message: `Hapus tracker cicilan "${inst?.name}"? Progres pembayaran akan terhapus.`,
      confirmLabel: 'Hapus',
      confirmVariant: 'danger',
      onConfirm: () => {
        const nextInsts = [...installments];
        nextInsts.splice(index, 1);

        // Also cleanup paid keys in current month
        const nextPaidKeys = (currentMonthData.installmentPaidKeys || []).filter(
          (k) => k !== index
        );

        updateInstallments(nextInsts);
        updateDataStore({
          ...dataStore,
          [currentMonthKey]: {
            ...currentMonthData,
            installmentPaidKeys: nextPaidKeys,
          },
        });
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        showToast('info', 'Tracker cicilan telah dihapus.');
      },
    });
  };

  // 13. Load Demo Data
  const handleLoadDemo = () => {
    if (!currentUser) return;
    setConfirmModal({
      isOpen: true,
      title: 'Muat Contoh Data Finansial',
      message: 'Muat data contoh pemasukan, pengeluaran, tagihan rutin, dan cicilan untuk dicoba?',
      confirmLabel: 'Muat Contoh Data',
      confirmVariant: 'primary',
      onConfirm: () => {
        const { store, installments: demoInsts } = seedDemoData(currentUser);
        setDataStore(store);
        setInstallments(demoInsts);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        showToast('success', 'Contoh data berhasil dimuat ke profil Anda!', 'Data Diperbarui');
      },
    });
  };

  // 14. Import Data
  const handleImportData = (newStore: MonthDataStore, newInstallments: InstallmentItem[]) => {
    updateDataStore(newStore);
    updateInstallments(newInstallments);
  };

  // Totals calculations
  const totalIncomes = currentMonthData.incomes.reduce((acc, curr) => acc + curr.amount, 0);
  const totalTrans = currentMonthData.transactions.reduce((acc, curr) => acc + curr.amount, 0);
  const totalBills = currentMonthData.bills.reduce((acc, curr) => acc + curr.amount, 0);
  const totalInstallments = installments.reduce((acc, curr) => acc + curr.amount, 0);

  const paidBillsTotal = currentMonthData.bills
    .filter((b) => b.paid)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const paidInstallmentsTotal = installments.reduce((acc, curr, idx) => {
    if (currentMonthData.installmentPaidKeys?.includes(idx)) {
      return acc + curr.amount;
    }
    return acc;
  }, 0);

  // If not logged in, show AuthScreen
  if (!currentUser) {
    return (
      <>
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        <AuthScreen onSuccess={handleLoginSuccess} showToast={showToast} />
      </>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen text-slate-800 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel={confirmModal.confirmLabel}
        confirmVariant={confirmModal.confirmVariant}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Export / Backup Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        username={currentUser}
        monthKey={currentMonthKey}
        dataStore={dataStore}
        installments={installments}
        onImportData={handleImportData}
        showToast={showToast}
      />

      {/* Main App Layout */}
      <div>
        {/* Header */}
        <Header
          username={currentUser}
          onLogout={handleLogout}
          onOpenExport={() => setIsExportOpen(true)}
          onLoadDemo={handleLoadDemo}
        />

        {/* Main Content Area */}
        <main className="max-w-xl mx-auto p-4 sm:p-5 space-y-4 w-full">
          {/* Period Selector (Bulan) */}
          <PeriodSelector
            currentMonthKey={currentMonthKey}
            onChangeMonth={setCurrentMonthKey}
          />

          {/* Ringkasan Saldo & Dashboard */}
          <SummaryCards
            totalIncomes={totalIncomes}
            totalTrans={totalTrans}
            totalBills={totalBills}
            totalInstallments={totalInstallments}
            paidBillsTotal={paidBillsTotal}
            paidInstallmentsTotal={paidInstallmentsTotal}
          />

          {/* Form & List Pemasukan */}
          <IncomeSection
            incomes={currentMonthData.incomes}
            onAddIncome={handleAddIncome}
            onDeleteIncome={handleDeleteIncome}
          />

          {/* Form & List Catat Pengeluaran Harian */}
          <DailyExpenseSection
            transactions={currentMonthData.transactions}
            onAddTransaction={handleAddTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />

          {/* Tambah & Checklist Tagihan Rutin Bulanan */}
          <MonthlyBillsSection
            bills={currentMonthData.bills}
            onAddBill={handleAddBill}
            onToggleBillPaid={handleToggleBillPaid}
            onDeleteBill={handleDeleteBill}
            onCopyPreviousMonthBills={handleCopyPreviousMonthBills}
            onResetBills={handleResetBills}
          />

          {/* Tambah & Daftar Tracker Cicilan Berjangka (Tenor) */}
          <InstallmentsSection
            installments={installments}
            installmentPaidKeys={currentMonthData.installmentPaidKeys || []}
            onAddInstallment={handleAddInstallment}
            onToggleInstallmentPaid={handleToggleInstallmentPaid}
            onDeleteInstallment={handleDeleteInstallment}
          />
        </main>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-400 py-6 border-t border-slate-200/60 mt-8">
        <p className="font-semibold text-slate-500">BudgetingKU &copy; {new Date().getFullYear()}</p>
        <p className="text-[11px] text-slate-400 mt-0.5">Kelola Keuangan Pribadi, Tagihan Rutin & Cicilan Berjangka</p>
      </footer>
    </div>
  );
}
