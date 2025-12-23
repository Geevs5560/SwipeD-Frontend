
import React, { useState } from 'react';
import { Transaction, CoinSymbol, NetworkType } from '../types';
import { MOCK_TRANSACTIONS, AVAILABLE_NETWORKS } from '../constants';
import { Card, ScreenHeader, CoinBadge, NetworkBadge, Button } from './Shared';
import { Send, ArrowDownLeft, PlusCircle, CheckCircle2, XCircle, Clock, Search, Filter, Copy, ExternalLink, Check, Share2, AlertCircle, ChevronRight } from 'lucide-react';

const TransactionDetail: React.FC<{ transaction: Transaction; onBack: () => void }> = ({ transaction, onBack }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'COMPLETED': return { label: 'Completed', color: 'text-emerald-600 dark:text-emerald-400', icon: CheckCircle2, bg: 'bg-emerald-100 dark:bg-emerald-500/10' };
      case 'PENDING': return { label: 'Pending', color: 'text-amber-600 dark:text-amber-400', icon: Clock, bg: 'bg-amber-100 dark:bg-amber-500/10' };
      case 'FAILED': return { label: 'Failed', color: 'text-rose-600 dark:text-rose-400', icon: XCircle, bg: 'bg-rose-100 dark:bg-rose-500/10' };
      default: return { label: status, color: 'text-slate-600 dark:text-slate-400', icon: Clock, bg: 'bg-slate-100 dark:bg-slate-800' };
    }
  };

  const statusConfig = getStatusConfig(transaction.status);
  const StatusIcon = statusConfig.icon;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getTypeLabel = (type: string) => {
    if (type === 'RECEIVE') return 'Recieve';
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  };

  return (
    <div className="h-full flex flex-col pb-24 animate-in fade-in duration-300">
      <ScreenHeader title="Transaction Details" onBack={onBack} />
      <div className="flex flex-col items-center justify-center py-8">
         <div className="relative mb-4">
            <CoinBadge symbol={transaction.coin} size="lg" />
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white dark:border-crypto-card ${statusConfig.bg} ${statusConfig.color}`}>
                <StatusIcon size={14} />
            </div>
         </div>
         <div className={`text-3xl font-black flex items-center gap-2 ${transaction.type === 'SEND' ? 'text-gray-900 dark:text-white' : 'text-crypto-accent'}`}>
             {transaction.type === 'SEND' ? '-' : '+'}{transaction.amount} {transaction.coin}
         </div>
         <div className={`mt-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider flex items-center gap-1.5 border border-current/10 ${statusConfig.bg} ${statusConfig.color}`}>
            <StatusIcon size={12} strokeWidth={2.5} />
            {statusConfig.label}
         </div>
      </div>
      <Card className="space-y-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
        <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-slate-800">
            <span className="text-gray-400 dark:text-slate-500 text-xs font-bold">Status</span>
            <div className={`flex items-center gap-1.5 text-xs font-bold tracking-tight ${statusConfig.color}`}>
                {statusConfig.label}
            </div>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-slate-800">
            <span className="text-gray-400 dark:text-slate-500 text-xs font-bold">Date</span>
            <span className="text-gray-900 dark:text-white text-xs font-bold">{formatDate(transaction.date)}</span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-slate-800">
            <span className="text-gray-400 dark:text-slate-500 text-xs font-bold">Type</span>
            <span className="text-gray-900 dark:text-white text-xs font-bold">{getTypeLabel(transaction.type)}</span>
        </div>
      </Card>
    </div>
  );
};

export const HistoryScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const filteredTransactions = MOCK_TRANSACTIONS.filter(tx => {
    const matchesSearch = tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tx.coin.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || tx.type === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || tx.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'COMPLETED': return { label: 'Completed', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-500/10', icon: CheckCircle2 };
      case 'PENDING': return { label: 'Pending', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-500/10', icon: Clock };
      case 'FAILED': return { label: 'Failed', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-100 dark:bg-rose-500/10', icon: XCircle };
      default: return { label: status, color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800', icon: AlertCircle };
    }
  };

  const getTypeConfig = (type: string) => {
    switch(type) {
      case 'SEND': return { label: 'Send', icon: Send, bg: 'bg-gray-100 dark:bg-slate-800', text: 'text-gray-900 dark:text-white' };
      case 'RECEIVE': return { label: 'Recieve', icon: ArrowDownLeft, bg: 'bg-crypto-accent/10', text: 'text-crypto-accent' };
      case 'DEPOSIT': return { label: 'Deposit', icon: PlusCircle, bg: 'bg-indigo-50 dark:bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400' };
      default: return { label: type, icon: PlusCircle, bg: 'bg-gray-100 dark:bg-slate-800', text: 'text-gray-500' };
    }
  };

  return (
    <div className="h-full flex flex-col pb-24 px-1">
      <ScreenHeader title="History" onBack={onBack} />
      <div className="space-y-3 mb-6">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-crypto-accent transition-colors" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search hash or ID..." 
            className="w-full bg-white/40 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-800/60 backdrop-blur-md rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-crypto-accent transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-600 shadow-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-white/60 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700/60 text-gray-900 dark:text-white text-xs font-bold rounded-xl px-4 py-2.5 focus:outline-none focus:border-crypto-accent min-w-fit shadow-sm"
            >
                <option value="ALL">Types</option>
                <option value="SEND">Send</option>
                <option value="RECEIVE">Recieve</option>
                <option value="DEPOSIT">Deposit</option>
            </select>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 no-scrollbar">
        {filteredTransactions.map((tx) => {
          const statusConfig = getStatusConfig(tx.status);
          const typeConfig = getTypeConfig(tx.type);
          const TypeIcon = typeConfig.icon;
          const StatusIcon = statusConfig.icon;
          return (
            <Card key={tx.id} className="flex items-center justify-between p-4 bg-white/40 dark:bg-slate-900/40 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all cursor-pointer group border-gray-100/50 dark:border-slate-800/50 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="relative">
                    <CoinBadge symbol={tx.coin} size="md" />
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-crypto-card shadow-sm ${typeConfig.bg} ${typeConfig.text}`}>
                         <TypeIcon size={10} strokeWidth={3} />
                    </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-gray-900 dark:text-white tracking-tight">{typeConfig.label}</span>
                    <NetworkBadge network={tx.network} />
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-black text-sm flex items-center justify-end gap-1 tracking-tighter ${tx.type === 'SEND' ? 'text-gray-900 dark:text-white' : 'text-crypto-accent'}`}>
                  {tx.type === 'SEND' ? '-' : '+'}{tx.amount} <span className="text-[10px] opacity-60 font-bold uppercase">{tx.coin}</span>
                </div>
                <div className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center justify-end gap-1.5 w-fit ml-auto mt-2 border border-current/10 ${statusConfig.bg} ${statusConfig.color}`}>
                  <StatusIcon size={12} strokeWidth={3} className="shrink-0" />
                  <span>{statusConfig.label}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
