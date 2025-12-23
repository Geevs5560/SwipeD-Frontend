
import React, { useState, useMemo } from 'react';
import { Card, ScreenHeader, CoinBadge, NetworkBadge, Button } from './Shared';
import { Calendar, Download, Filter, FileText, ChevronRight, ArrowUpRight, ArrowDownLeft, Clock, Search, Table, Grid } from 'lucide-react';
import { MOCK_TRANSACTIONS } from '../constants';
import { CoinSymbol, NetworkType } from '../types';

export const StatementsScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [dateRange, setDateRange] = useState({ start: '2023-10-01', end: '2023-10-31' });
  const [accountFilter, setAccountFilter] = useState<'ALL' | 'SAVINGS' | 'PERSONAL'>('ALL');
  const [isExporting, setIsExporting] = useState(false);
  const filteredTransactions = useMemo(() => {
    return MOCK_TRANSACTIONS.filter(tx => {
      const txDate = tx.date.split('T')[0];
      return txDate >= dateRange.start && txDate <= dateRange.end;
    });
  }, [dateRange]);

  const handleExport = (type: 'PDF' | 'CSV') => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert(`${type} Manifest Generated and Encrypted.`);
    }, 2000);
  };

  return (
    <div className="pb-24 animate-in fade-in duration-300">
      <ScreenHeader title="Financial Manifests" onBack={onBack} />
      <div className="px-1 space-y-8">
        <Card className="p-6 space-y-6 bg-white/40 dark:bg-slate-900/40">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xs font-bold text-gray-400 tracking-widest">Filter Parameters</h3>
            <button className="text-xs font-bold text-crypto-accent tracking-wide">Clear</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 tracking-wide ml-1">Start Point</label>
              <input type="date" value={dateRange.start} onChange={e => setDateRange({...dateRange, start: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:border-crypto-accent" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 tracking-wide ml-1">End Point</label>
              <input type="date" value={dateRange.end} onChange={e => setDateRange({...dateRange, end: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:border-crypto-accent" />
            </div>
          </div>
          <div className="space-y-3">
             <label className="text-[10px] font-bold text-gray-400 tracking-wide ml-1">Vault Context</label>
             <div className="grid grid-cols-3 gap-2">
                {['All', 'Savings', 'Personal'].map(act => (
                  <button key={act} onClick={() => setAccountFilter(act.toUpperCase() as any)} className={`py-2.5 rounded-xl border-2 text-[10px] font-bold transition-all ${accountFilter === act.toUpperCase() ? 'border-crypto-accent bg-crypto-accent/5 text-crypto-accent' : 'border-gray-100 dark:border-slate-800 text-gray-400'}`}>
                    {act}
                  </button>
                ))}
             </div>
          </div>
        </Card>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 rounded-2xl h-14 font-bold text-xs tracking-wide gap-3" onClick={() => handleExport('CSV')} disabled={isExporting}>
            <Download size={16} /> Export CSV
          </Button>
          <Button className="flex-1 rounded-2xl h-14 font-bold text-xs tracking-wide gap-3" onClick={() => handleExport('PDF')} disabled={isExporting}>
            <FileText size={16} /> Generate PDF
          </Button>
        </div>
      </div>
    </div>
  );
};
