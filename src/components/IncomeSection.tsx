import React, { useState } from 'react';
import { PlusCircle, Trash2, ArrowUpCircle, Tag, Calendar as CalendarIcon } from 'lucide-react';
import { IncomeItem } from '../types';
import { formatRupiah, getTodayDateString } from '../utils/formatters';

interface IncomeSectionProps {
  incomes: IncomeItem[];
  onAddIncome: (income: Omit<IncomeItem, 'id'>) => void;
  onDeleteIncome: (index: number) => void;
}

const INCOME_CATEGORIES = ['Gaji Pokok', 'Bonus / THR', 'Freelance / Side Job', 'Investasi', 'Bisnis / Jualan', 'Lainnya'];

export const IncomeSection: React.FC<IncomeSectionProps> = ({ incomes, onAddIncome, onDeleteIncome }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(INCOME_CATEGORIES[0]);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount.replace(/[^0-9]/g, ''));
    if (!name.trim() || isNaN(numAmount) || numAmount <= 0) return;

    onAddIncome({
      name: name.trim(),
      amount: numAmount,
      category: category,
      date: getTodayDateString(),
    });

    setName('');
    setAmount('');
    setIsExpanded(false);
  };

  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200/80 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">💰</span>
          <div>
            <h2 className="font-bold text-slate-800 text-base leading-tight">Pemasukan Bulan Ini</h2>
            <p className="text-[11px] text-slate-400">Total: {formatRupiah(totalIncome)} ({incomes.length} item)</p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition flex items-center gap-1"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>{isExpanded ? 'Tutup' : 'Tambah'}</span>
        </button>
      </div>

      {/* Form Tambah Pemasukan */}
      {isExpanded && (
        <form onSubmit={handleSubmit} className="p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-3 animate-in fade-in duration-150">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Sumber Pemasukan
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Gaji PT ABC, Bonus Project, Penjualan"
              required
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
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
                placeholder="Misal: 7500000"
                required
                min="1"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium text-slate-700"
              >
                {INCOME_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
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
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5"
            >
              <ArrowUpCircle className="w-4 h-4" />
              <span>Simpan Pemasukan</span>
            </button>
          </div>
        </form>
      )}

      {/* List Pemasukan */}
      <div className="space-y-2">
        {incomes.length === 0 ? (
          <div className="p-4 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200">
            <p className="text-xs text-slate-400 font-medium">Belum ada pemasukan di periode bulan ini.</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Klik tombol Tambah di atas untuk mencatat sumber dana.</p>
          </div>
        ) : (
          incomes.map((item, index) => (
            <div
              key={item.id || index}
              className="flex justify-between items-center p-3 bg-emerald-50/70 rounded-2xl border border-emerald-100/90 hover:border-emerald-200 transition"
            >
              <div className="min-w-0 pr-2">
                <p className="font-bold text-slate-800 text-sm truncate">{item.name}</p>
                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-emerald-700">
                  {item.category && (
                    <span className="bg-emerald-100/80 px-2 py-0.5 rounded-md font-semibold">
                      {item.category}
                    </span>
                  )}
                  {item.date && (
                    <span className="text-slate-400">
                      {item.date}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-extrabold text-sm text-emerald-700">
                  + {formatRupiah(item.amount)}
                </span>
                <button
                  type="button"
                  onClick={() => onDeleteIncome(index)}
                  title="Hapus pemasukan"
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-100 hover:text-rose-700 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
