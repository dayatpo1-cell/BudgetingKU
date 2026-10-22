import React, { useState } from 'react';
import { PlusCircle, Trash2, CheckCircle2, Award, Clock, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { InstallmentItem } from '../types';
import { formatRupiah } from '../utils/formatters';

interface InstallmentsSectionProps {
  installments: InstallmentItem[];
  installmentPaidKeys: number[];
  onAddInstallment: (item: Omit<InstallmentItem, 'id' | 'paidMonths'>) => void;
  onToggleInstallmentPaid: (index: number) => void;
  onDeleteInstallment: (index: number) => void;
}

export const InstallmentsSection: React.FC<InstallmentsSectionProps> = ({
  installments,
  installmentPaidKeys,
  onAddInstallment,
  onToggleInstallmentPaid,
  onDeleteInstallment,
}) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [tenor, setTenor] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount.replace(/[^0-9]/g, ''));
    const numTenor = parseInt(tenor, 10);
    if (!name.trim() || isNaN(numAmount) || numAmount <= 0 || isNaN(numTenor) || numTenor <= 0) return;

    onAddInstallment({
      name: name.trim(),
      amount: numAmount,
      tenor: numTenor,
    });

    setName('');
    setAmount('');
    setTenor('');
    setIsFormOpen(false);
  };

  const handlePayClick = (index: number, inst: InstallmentItem, isCurrentlyPaid: boolean) => {
    // If not paid and will reach 100%, trigger confetti celebration!
    if (!isCurrentlyPaid && (inst.paidMonths + 1) >= inst.tenor) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Safe fallback
      }
    }
    onToggleInstallmentPaid(index);
  };

  const totalMonthlyCommitment = installments.reduce((sum, inst) => sum + inst.amount, 0);

  return (
    <div className="space-y-4">
      {/* Box Tambah Cicilan Berjangka */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-800 text-base flex items-center gap-2">
            <span>⏱️</span>
            <span>Tambah Cicilan Berjangka (Tenor)</span>
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
                Nama Barang / Tagihan
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Smartphone, Laptop, Motor, Kulkas"
                required
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Nominal / Bulan (Rp)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="500000"
                  required
                  min="1"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Total Tenor (Bulan)
                </label>
                <input
                  type="number"
                  value={tenor}
                  onChange={(e) => setTenor(e.target.value)}
                  placeholder="6"
                  required
                  min="1"
                  max="120"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
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
                <span>Simpan Tracker Cicilan</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Daftar Tracker Cicilan */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200/80 space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-800 text-base leading-tight">Daftar Tracker Cicilan</h2>
            <p className="text-[11px] text-slate-400">Pantau progres tenor dan klik tombol bayar bulanan</p>
          </div>
          {installments.length > 0 && (
            <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-xl font-bold">
              {formatRupiah(totalMonthlyCommitment)} /bln
            </span>
          )}
        </div>

        <div className="space-y-3 pt-1">
          {installments.length === 0 ? (
            <div className="p-4 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-1">
              <p className="text-xs text-slate-400 font-medium">Belum ada cicilan berjangka yang dicatat.</p>
              <p className="text-[10px] text-slate-400">
                Tambahkan cicilan gadget, motor, atau barang untuk memantau sisa tenor dengan mudah.
              </p>
            </div>
          ) : (
            installments.map((inst, index) => {
              const isPaidThisMonth = installmentPaidKeys.includes(index);
              const paidMonths = inst.paidMonths || 0;
              const remainingMonths = Math.max(0, inst.tenor - paidMonths);
              const remainingAmount = remainingMonths * inst.amount;
              const progressPercent = Math.min(100, Math.round((paidMonths / inst.tenor) * 100));
              const isFullyPaid = paidMonths >= inst.tenor;

              const currentStepNumber = Math.min(inst.tenor, paidMonths + (isPaidThisMonth ? 0 : 1));

              return (
                <div
                  key={inst.id || index}
                  className={`p-4 rounded-2xl border space-y-3 transition-all shadow-xs ${
                    isFullyPaid
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : isPaidThisMonth
                      ? 'bg-indigo-50/30 border-indigo-200'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-slate-900 text-sm truncate">{inst.name}</p>
                        {isFullyPaid ? (
                          <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Award className="w-3 h-3 text-emerald-600" />
                            Lunas Sepenuhnya
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                            Cicilan ke-{currentStepNumber} dari {inst.tenor}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {formatRupiah(inst.amount)} /bln • Sisa:{' '}
                        <b className={isFullyPaid ? 'text-emerald-700' : 'text-rose-600'}>
                          {isFullyPaid ? 'Rp 0 (Selesai)' : formatRupiah(remainingAmount)}
                        </b>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDeleteInstallment(index)}
                      title="Hapus tracker cicilan"
                      className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isFullyPaid ? 'bg-emerald-500' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                      <span>Progres: <strong className="text-slate-700">{progressPercent}%</strong></span>
                      <span>
                        {isFullyPaid ? (
                          <span className="text-emerald-600 font-bold">Semua {inst.tenor} bulan telah lunas</span>
                        ) : (
                          <>Sisa: <strong className="text-slate-700">{remainingMonths} bulan</strong></>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Pay button for the active month */}
                  {!isFullyPaid ? (
                    <button
                      type="button"
                      onClick={() => handlePayClick(index, inst, isPaidThisMonth)}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                        isPaidThisMonth
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {isPaidThisMonth ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>✓ Sudah Dibayar Bulan Ini (Klik untuk Batal)</span>
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                          <span>🟢 Bayar Cicilan Bulan Ini</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="p-2 bg-emerald-50 rounded-xl text-center text-xs font-semibold text-emerald-700 border border-emerald-100 flex items-center justify-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span>Selamat! Cicilan barang ini sudah selesai lunas.</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
