import React, { useState } from 'react';
import { PlusCircle, Trash2, Copy, RotateCcw, CheckCircle2, Clock, CheckSquare, Square } from 'lucide-react';
import { BillItem } from '../types';
import { formatRupiah } from '../utils/formatters';

interface MonthlyBillsSectionProps {
  bills: BillItem[];
  onAddBill: (bill: Omit<BillItem, 'id' | 'paid'>) => void;
  onToggleBillPaid: (index: number) => void;
  onDeleteBill: (index: number) => void;
  onCopyPreviousMonthBills: () => void;
  onResetBills: () => void;
}

export const MonthlyBillsSection: React.FC<MonthlyBillsSectionProps> = ({
  bills,
  onAddBill,
  onToggleBillPaid,
  onDeleteBill,
  onCopyPreviousMonthBills,
  onResetBills,
}) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount.replace(/[^0-9]/g, ''));
    if (!name.trim() || isNaN(numAmount) || numAmount <= 0) return;

    onAddBill({
      name: name.trim(),
      amount: numAmount,
      dueDate: dueDate.trim() || undefined,
    });

    setName('');
    setAmount('');
    setDueDate('');
    setIsFormOpen(false);
  };

  const totalBills = bills.reduce((sum, b) => sum + b.amount, 0);
  const paidBillsCount = bills.filter((b) => b.paid).length;
  const paidBillsAmount = bills.filter((b) => b.paid).reduce((sum, b) => sum + b.amount, 0);
  const progressPercent = bills.length > 0 ? Math.round((paidBillsCount / bills.length) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Box Tambah Tagihan Rutin Bulanan */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-800 text-base flex items-center gap-2">
            <span>📄</span>
            <span>Tambah Tagihan Rutin Bulanan</span>
          </h2>
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{isFormOpen ? 'Tutup' : 'Tambah'}</span>
          </button>
        </div>

        {isFormOpen && (
          <form onSubmit={handleSubmit} className="p-3.5 bg-indigo-50/40 rounded-2xl border border-indigo-100 space-y-3 animate-in fade-in duration-150">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Nama Tagihan
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Misal: Listrik PLN, WiFi IndiHome, Kost, BPJS, Spotify"
                required
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Nominal Tagihan (Rp)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Contoh: 350000"
                  required
                  min="1"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Jatuh Tempo (Opsional)
                </label>
                <input
                  type="text"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  placeholder="Misal: Tgl 10 tiap bulan"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-slate-700"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Tambah ke Daftar Tagihan</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Checklist Tagihan Bulan Ini */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200/80 space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-bold text-slate-800 text-base leading-tight">Checklist Tagihan Bulan Ini</h2>
            <p className="text-[11px] text-slate-400">Centang kotak untuk menandai Lunas</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onCopyPreviousMonthBills}
              title="Salin tagihan rutin dari bulan sebelumnya"
              className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2.5 py-1.5 rounded-xl font-semibold transition flex items-center gap-1 shadow-2xs"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Salin Bulan Lalu</span>
            </button>
            {bills.length > 0 && (
              <button
                onClick={onResetBills}
                title="Reset status lunas semua tagihan bulan ini"
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2.5 py-1.5 rounded-xl font-medium transition flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Status progress bar if bills exist */}
        {bills.length > 0 && (
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1.5">
            <div className="flex justify-between items-center text-[11px] font-medium text-slate-600">
              <span>
                Status Lunas: <strong>{paidBillsCount}</strong> dari {bills.length} tagihan ({progressPercent}%)
              </span>
              <span>
                Terbayar: <strong className="text-emerald-600">{formatRupiah(paidBillsAmount)}</strong> / {formatRupiah(totalBills)}
              </span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Bill Items */}
        <div className="space-y-2.5 pt-1">
          {bills.length === 0 ? (
            <div className="p-4 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-1">
              <p className="text-xs text-slate-400 font-medium">Belum ada tagihan rutin terdaftar di bulan ini.</p>
              <p className="text-[10px] text-slate-400">
                Gunakan "Salin Bulan Lalu" untuk menyalin tagihan berulang, atau tambahkan di form atas.
              </p>
            </div>
          ) : (
            bills.map((item, index) => (
              <div
                key={item.id || index}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  item.paid
                    ? 'bg-emerald-50/70 border-emerald-200 shadow-2xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <button
                    type="button"
                    onClick={() => onToggleBillPaid(index)}
                    className="focus:outline-none transition active:scale-95"
                    title={item.paid ? 'Tandai Belum Dibayar' : 'Tandai Sudah Lunas'}
                  >
                    {item.paid ? (
                      <CheckSquare className="w-5 h-5 text-indigo-600 fill-indigo-100" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-300 hover:text-indigo-500" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <p
                      className={`font-bold text-sm truncate transition ${
                        item.paid ? 'line-through text-slate-400' : 'text-slate-800'
                      }`}
                    >
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          item.paid
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {item.paid ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Sudah Lunas</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            <span>Belum Dibayar</span>
                          </>
                        )}
                      </span>
                      {item.dueDate && (
                        <span className="text-[10px] text-slate-400">
                          {item.dueDate}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`font-extrabold text-sm ${
                      item.paid ? 'text-slate-400 line-through' : 'text-slate-700'
                    }`}
                  >
                    {formatRupiah(item.amount)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onDeleteBill(index)}
                    title="Hapus tagihan"
                    className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
