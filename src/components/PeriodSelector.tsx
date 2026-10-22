import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, RotateCcw } from 'lucide-react';
import { formatMonthLabel, getAdjacentMonthKey, getCurrentMonthKey } from '../utils/formatters';

interface PeriodSelectorProps {
  currentMonthKey: string;
  onChangeMonth: (newMonthKey: string) => void;
}

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({ currentMonthKey, onChangeMonth }) => {
  const isCurrentMonth = currentMonthKey === getCurrentMonthKey();

  const handlePrev = () => {
    onChangeMonth(getAdjacentMonthKey(currentMonthKey, -1));
  };

  const handleNext = () => {
    onChangeMonth(getAdjacentMonthKey(currentMonthKey, 1));
  };

  const handleToday = () => {
    onChangeMonth(getCurrentMonthKey());
  };

  return (
    <div className="bg-white p-3.5 sm:p-4 rounded-2xl shadow-sm border border-slate-200/80 flex flex-wrap items-center justify-between gap-2.5">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
          <Calendar className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block leading-none">
            Periode Anggaran
          </span>
          <span className="text-sm font-bold text-slate-800 leading-tight">
            {formatMonthLabel(currentMonthKey)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 ml-auto">
        {!isCurrentMonth && (
          <button
            onClick={handleToday}
            className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-2 py-1.5 rounded-xl transition flex items-center gap-1"
            title="Kembali ke Bulan Sekarang"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Bulan Ini</span>
          </button>
        )}

        <button
          onClick={handlePrev}
          aria-label="Bulan sebelumnya"
          className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <input
          type="month"
          value={currentMonthKey}
          onChange={(e) => e.target.value && onChangeMonth(e.target.value)}
          className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-slate-700 cursor-pointer"
        />

        <button
          onClick={handleNext}
          aria-label="Bulan berikutnya"
          className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
