import React, { useState } from 'react';
import { PlusCircle, Trash2, ArrowDownCircle, Search, Filter } from 'lucide-react';
import { TransactionItem } from '../types';
import { formatRupiah, getTodayDateString, formatDateIndo } from '../utils/formatters';

interface DailyExpenseSectionProps {
  transactions: TransactionItem[];
  onAddTransaction: (transaction: Omit<TransactionItem, 'id'>) => void;
  onDeleteTransaction: (index: number) => void;
}

const EXPENSE_CATEGORIES = [
  'Makanan & Minuman',
  'Transportasi & Bensin',
  'Belanja Kebutuhan',
  'Hiburan & Hobi',
  'Kesehatan & Obat',
  'Pendidikan',
  'Lain-lain',
];

export const DailyExpenseSection: React.FC<DailyExpenseSectionProps> = ({
  transactions,
  onAddTransaction,
  onDeleteTransaction,
}) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [date, setDate] = useState(getTodayDateString());
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount.replace(/[^0-9]/g, ''));
    if (!name.trim() || isNaN(numAmount) || numAmount <= 0) return;

    onAddTransaction({
      name: name.trim(),
      amount: numAmount,
      category: category,
      date: date || getTodayDateString(),
    });

    setName('');
    setAmount('');
    setIsExpanded(false);
  };

  const totalExpense = transactions.reduce((sum, item) => sum + item.amount, 0);

  const filteredTransactions = transactions.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      (item.category && item.category.toLowerCase().includes(q))
    );
  });

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200/80 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">💸</span>
          <div>
            <h2 className="font-bold text-slate-800 text-base leading-tight">Catat Pengeluaran Harian</h2>
            <p className="text-[11px] text-slate-400">Total: {formatRupiah(totalExpense)} ({transactions.length} transaksi)</p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition flex items-center gap-1"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>{isExpanded ? 'Tutup' : 'Catat'}</span>
        </button>
      </div>

      {/* Form Catat Transaksi */}
      {isExpanded && (
        <form onSubmit={handleSubmit} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 animate-in fade-in duration-150">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Nama Transaksi
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Makan Siang Nasi Padang, Belanja Sayur, Parkir"
              required
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Nominal (Rp)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Misal: 35000"
                required
                min="1"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-slate-700"
              >
                {EXPENSE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Tanggal Transaksi
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-slate-700"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5"
            >
              <ArrowDownCircle className="w-4 h-4" />
              <span>Simpan Transaksi</span>
            </button>
          </div>
        </form>
      )}

      {/* Filter / Search Bar jika transaksi lebih dari 4 */}
      {transactions.length > 4 && (
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari transaksi pengeluaran..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 placeholder-slate-400"
          />
        </div>
      )}

      {/* List Transaksi */}
      <div className="space-y-2">
        {transactions.length === 0 ? (
          <div className="p-4 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200">
            <p className="text-xs text-slate-400 font-medium">Belum ada pengeluaran harian tercatat di periode ini.</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Catat setiap pengeluaran kecil agar anggaran tetap terkontrol.</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-3">Tidak ditemukan transaksi dengan kata kunci tersebut.</p>
        ) : (
          filteredTransactions.map((item, index) => {
            const originalIndex = transactions.indexOf(item);
            return (
              <div
                key={item.id || index}
                className="flex justify-between items-center p-3 bg-slate-50/80 rounded-2xl border border-slate-100 hover:border-slate-200 transition"
              >
                <div className="min-w-0 pr-2">
                  <p className="font-bold text-slate-800 text-sm truncate">{item.name}</p>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                    {item.category && (
                      <span className="bg-slate-200/70 text-slate-600 px-2 py-0.5 rounded-md font-semibold">
                        {item.category}
                      </span>
                    )}
                    {item.date && (
                      <span className="text-slate-400">
                        {formatDateIndo(item.date)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-extrabold text-sm text-rose-600">
                    - {formatRupiah(item.amount)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onDeleteTransaction(originalIndex >= 0 ? originalIndex : index)}
                    title="Hapus transaksi"
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
