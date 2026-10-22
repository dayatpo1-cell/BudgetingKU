import React from 'react';
import { ArrowDownRight, ArrowUpRight, Wallet, PieChart, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

interface SummaryCardsProps {
  totalIncomes: number;
  totalTrans: number;
  totalBills: number;
  totalInstallments: number;
  paidBillsTotal: number;
  paidInstallmentsTotal: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalIncomes,
  totalTrans,
  totalBills,
  totalInstallments,
  paidBillsTotal,
  paidInstallmentsTotal,
}) => {
  const totalExpenses = totalTrans + totalBills + totalInstallments;
  const remainingBudget = totalIncomes - totalExpenses;
  const isDeficit = remainingBudget < 0;

  // Realized cash outflow so far (daily expenses + paid bills + paid installments this month)
  const actualPaidOutflow = totalTrans + paidBillsTotal + paidInstallmentsTotal;

  // Percentage of income committed
  const committedRatio = totalIncomes > 0 ? Math.min(Math.round((totalExpenses / totalIncomes) * 100), 100) : 0;

  return (
    <div className="space-y-3">
      {/* 2-column + 1-full grid matching prototype */}
      <div className="grid grid-cols-2 gap-3">
        {/* Dana Masuk Card */}
        <div className="bg-emerald-50/80 border border-emerald-100 p-3.5 rounded-2xl flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
              Dana Masuk
            </span>
            <span className="p-1 rounded-lg bg-emerald-100 text-emerald-700">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2">
            <p className="text-base sm:text-lg font-black text-emerald-800 tracking-tight">
              {formatRupiah(totalIncomes)}
            </p>
            <p className="text-[10px] text-emerald-600/90 font-medium mt-0.5">
              Total pemasukan bulan ini
            </p>
          </div>
        </div>

        {/* Total Pengeluaran Card */}
        <div className="bg-rose-50/80 border border-rose-100 p-3.5 rounded-2xl flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">
              Total Komitmen
            </span>
            <span className="p-1 rounded-lg bg-rose-100 text-rose-700">
              <ArrowDownRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2">
            <p className="text-base sm:text-lg font-black text-rose-800 tracking-tight">
              {formatRupiah(totalExpenses)}
            </p>
            <p className="text-[10px] text-rose-600/90 font-medium mt-0.5">
              Harian + Tagihan + Cicilan
            </p>
          </div>
        </div>

        {/* Sisa Saldo Periode Ini (Col span 2) */}
        <div
          className={`col-span-2 p-4 rounded-2xl border text-center transition-all shadow-xs ${
            isDeficit
              ? 'bg-rose-100/70 border-rose-200'
              : 'bg-indigo-50/80 border-indigo-100'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider">
            {isDeficit ? (
              <span className="text-rose-600 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                Defisit Anggaran Periode Ini
              </span>
            ) : (
              <span className="text-indigo-600 flex items-center gap-1">
                <Wallet className="w-4 h-4" />
                Sisa Saldo Periode Ini
              </span>
            )}
          </div>

          <p
            className={`text-2xl sm:text-3xl font-black mt-1 tracking-tight ${
              isDeficit ? 'text-rose-700' : 'text-indigo-700'
            }`}
          >
            {formatRupiah(remainingBudget)}
          </p>

          {/* Allocation progress bar */}
          <div className="mt-3 pt-2.5 border-t border-slate-200/50 space-y-1.5">
            <div className="flex justify-between items-center text-[11px] font-medium text-slate-500">
              <span className="flex items-center gap-1">
                <PieChart className="w-3.5 h-3.5 text-slate-400" />
                Alokasi Pemasukan: <strong className="text-slate-700">{committedRatio}%</strong>
              </span>
              <span>
                Realisasi terbayar: <strong className="text-slate-700">{formatRupiah(actualPaidOutflow)}</strong>
              </span>
            </div>

            <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  isDeficit ? 'bg-rose-600' : committedRatio > 85 ? 'bg-amber-500' : 'bg-indigo-600'
                }`}
                style={{ width: `${Math.min(committedRatio, 100)}%` }}
              />
            </div>
          </div>

          {/* Quick Expense Breakdown Pills */}
          <div className="grid grid-cols-3 gap-1.5 mt-3 pt-2 border-t border-slate-200/40 text-left">
            <div className="bg-white/80 p-1.5 rounded-xl border border-slate-200/60">
              <p className="text-[9px] font-bold text-slate-400 uppercase truncate">💸 Harian</p>
              <p className="text-[11px] font-extrabold text-slate-700 mt-0.5 truncate">{formatRupiah(totalTrans)}</p>
            </div>
            <div className="bg-white/80 p-1.5 rounded-xl border border-slate-200/60">
              <p className="text-[9px] font-bold text-slate-400 uppercase truncate">📄 Tagihan</p>
              <p className="text-[11px] font-extrabold text-slate-700 mt-0.5 truncate">{formatRupiah(totalBills)}</p>
            </div>
            <div className="bg-white/80 p-1.5 rounded-xl border border-slate-200/60">
              <p className="text-[9px] font-bold text-slate-400 uppercase truncate">⏱️ Cicilan</p>
              <p className="text-[11px] font-extrabold text-slate-700 mt-0.5 truncate">{formatRupiah(totalInstallments)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
