import React from 'react';
import { User, LogOut, Download, Sparkles } from 'lucide-react';

interface HeaderProps {
  username: string;
  onLogout: () => void;
  onOpenExport: () => void;
  onLoadDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({ username, onLogout, onOpenExport, onLoadDemo }) => {
  return (
    <header className="bg-indigo-600 text-white shadow-md rounded-b-3xl sticky top-0 z-40">
      <div className="max-w-xl mx-auto px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center font-black text-sm text-white">
            BK
          </div>
          <div>
            <h1 className="font-extrabold text-base leading-none tracking-tight">BudgetingKU</h1>
            <p className="text-[10px] text-indigo-200 font-medium">Kelola Keuangan Cerdas</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Demo Data button for quick testing */}
          <button
            onClick={onLoadDemo}
            title="Muat Contoh Data"
            className="text-xs bg-indigo-700/80 hover:bg-indigo-700 text-indigo-100 p-2 rounded-xl transition flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline text-[11px] font-medium">Contoh Data</span>
          </button>

          {/* Export / Backup button */}
          <button
            onClick={onOpenExport}
            title="Cadangkan / Ekspor Data"
            className="text-xs bg-indigo-700/80 hover:bg-indigo-700 text-indigo-100 p-2 rounded-xl transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px] font-medium">Cadangkan</span>
          </button>

          {/* User Name Badge */}
          <div className="flex items-center gap-1.5 bg-indigo-500/70 text-white text-xs px-2.5 py-1.5 rounded-xl font-medium">
            <User className="w-3.5 h-3.5" />
            <span className="max-w-[90px] truncate">{username}</span>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="text-xs bg-rose-500 hover:bg-rose-600 active:scale-95 text-white px-2.5 py-1.5 rounded-xl font-semibold transition flex items-center gap-1 shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Keluar</span>
          </button>
        </div>
      </div>
    </header>
  );
};
