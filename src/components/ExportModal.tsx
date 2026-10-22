import React, { useState } from 'react';
import { Download, Upload, Copy, Check, X, FileText, AlertCircle } from 'lucide-react';
import { MonthDataStore, InstallmentItem } from '../types';
import { formatRupiah, formatMonthLabel } from '../utils/formatters';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  monthKey: string;
  dataStore: MonthDataStore;
  installments: InstallmentItem[];
  onImportData: (store: MonthDataStore, installments: InstallmentItem[]) => void;
  showToast: (type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  username,
  monthKey,
  dataStore,
  installments,
  onImportData,
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState<'backup' | 'report'>('backup');
  const [importJson, setImportJson] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentMonthData = dataStore[monthKey] || {
    incomes: [],
    transactions: [],
    bills: [],
    installmentPaidKeys: [],
  };

  const totalIncomes = currentMonthData.incomes.reduce((a, b) => a + b.amount, 0);
  const totalTrans = currentMonthData.transactions.reduce((a, b) => a + b.amount, 0);
  const totalBills = currentMonthData.bills.reduce((a, b) => a + b.amount, 0);
  const totalInstallments = installments.reduce((a, b) => a + b.amount, 0);
  const totalExpenses = totalTrans + totalBills + totalInstallments;
  const remaining = totalIncomes - totalExpenses;

  const exportPayload = {
    app: 'BudgetingKU',
    version: '2.0',
    exportedAt: new Date().toISOString(),
    username: username,
    dataStore: dataStore,
    installments: installments,
  };

  const jsonString = JSON.stringify(exportPayload, null, 2);

  const handleDownloadFile = () => {
    try {
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `budgetingku-backup-${username}-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('success', 'File cadangan JSON berhasil diunduh.', 'Berhasil');
    } catch {
      showToast('error', 'Gagal membuat file cadangan.');
    }
  };

  const handleCopyClipboard = () => {
    try {
      navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showToast('info', 'Teks data JSON disalin ke papan klip.');
    } catch {
      showToast('error', 'Gagal menyalin teks.');
    }
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importJson.trim()) return;

    try {
      const parsed = JSON.parse(importJson.trim());
      const storeToImport = parsed.dataStore || parsed;
      const installmentsToImport = parsed.installments || [];

      if (typeof storeToImport !== 'object') {
        throw new Error('Format data tidak valid');
      }

      onImportData(storeToImport, installmentsToImport);
      setImportJson('');
      showToast('success', 'Data berhasil dipulihkan dari cadangan!', 'Pemulihan Berhasil');
      onClose();
    } catch (err) {
      showToast('error', 'Format JSON tidak valid atau rusak. Periksa kembali teks JSON.', 'Gagal Memulihkan');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Cadangkan & Ringkasan Data</h3>
              <p className="text-xs text-slate-400">Pengguna: {username}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex px-4 pt-3 border-b border-slate-100 gap-2">
          <button
            onClick={() => setActiveTab('backup')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition ${
              activeTab === 'backup'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Cadangkan & Pulihkan (JSON)
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition ${
              activeTab === 'report'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Ringkasan Keuangan ({formatMonthLabel(monthKey)})
          </button>
        </div>

        {/* Content body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'backup' ? (
            <div className="space-y-4">
              {/* Export Box */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-700">Ekspor Data Saya</h4>
                  <p className="text-[11px] text-slate-400">
                    Unduh file JSON untuk menyimpan salinan aman ke perangkat Anda.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleDownloadFile}
                    className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>Unduh File .JSON</span>
                  </button>
                  <button
                    onClick={handleCopyClipboard}
                    className="py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Tersalin' : 'Salin Teks'}</span>
                  </button>
                </div>
              </div>

              {/* Import Box */}
              <form onSubmit={handleImportSubmit} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-700">Pulihkan dari Cadangan</h4>
                  <p className="text-[11px] text-slate-400">
                    Tempelkan isi teks JSON cadangan Anda untuk memulihkan seluruh data.
                  </p>
                </div>
                <textarea
                  value={importJson}
                  onChange={(e) => setImportJson(e.target.value)}
                  placeholder='Tempelkan kode JSON di sini: {"app": "BudgetingKU", ...}'
                  rows={3}
                  className="w-full p-2.5 text-xs font-mono bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!importJson.trim()}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Upload className="w-4 h-4" />
                  <span>Pulihkan Data Sekarang</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <div className="text-center pb-2 border-b border-slate-200">
                <h4 className="font-extrabold text-sm text-slate-800">Laporan Ringkasan Finansial</h4>
                <p className="text-[11px] text-slate-500">Periode: {formatMonthLabel(monthKey)}</p>
              </div>

              <div className="space-y-1.5 text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span>Dana Masuk (Pemasukan)</span>
                  <span className="font-bold text-emerald-600">{formatRupiah(totalIncomes)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span>Pengeluaran Harian</span>
                  <span className="font-bold text-rose-600">{formatRupiah(totalTrans)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span>Tagihan Rutin Bulanan</span>
                  <span className="font-bold text-rose-600">{formatRupiah(totalBills)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span>Komitmen Cicilan Tenor</span>
                  <span className="font-bold text-rose-600">{formatRupiah(totalInstallments)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-t border-slate-300 font-bold text-slate-800 text-sm">
                  <span>Sisa Saldo Bersih</span>
                  <span className={remaining < 0 ? 'text-rose-600' : 'text-indigo-600'}>
                    {formatRupiah(remaining)}
                  </span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-400 italic text-center">
                Dibuat otomatis oleh BudgetingKU
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
