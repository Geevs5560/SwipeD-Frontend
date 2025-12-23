
import React, { useState, useMemo, useEffect } from 'react';
import { Card, ScreenHeader, CoinBadge, NetworkBadge, Button, Input } from './Shared';
import { CoinSymbol, NetworkType, Transaction } from '../types';
import { MOCK_TRANSACTIONS } from '../constants';
import { 
  TrendingUp, TrendingDown, Clock, Search, Filter, 
  Calendar, ArrowUpRight, ArrowDownLeft, Send, 
  CheckCircle2, XCircle, ChevronDown, Download,
  Table
} from 'lucide-react';

interface SavingsAccountProps {
  onBack: () => void;
  initialParams?: { coin?: CoinSymbol; network?: NetworkType };
}

// SavingsAccountScreen provides detailed analytics and transaction history for the savings vault.
export const SavingsAccountScreen: React.FC<SavingsAccountProps> = ({ onBack, initialParams }) => {
  const [filterCoin, setFilterCoin] = useState<CoinSymbol | 'ALL'>(initialParams?.coin || 'ALL');
  const [filterNetwork, setFilterNetwork] = useState<NetworkType | 'ALL'>(initialParams?.network || 'ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'COMPLETED' | 'PENDING' | 'FAILED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(!!initialParams); // Show filters if we jumped here with params

  // Filter transactions based on current UI state.
  const filteredTransactions = useMemo(() => {
    return MOCK_TRANSACTIONS.filter(tx => {
      const matchesCoin = filterCoin === 'ALL' || tx.coin === filterCoin;
      const matchesNetwork = filterNetwork === 'ALL' || tx.network === filterNetwork;
      const matchesStatus = filterStatus === 'ALL' || tx.status === filterStatus;
      const matchesSearch = tx.hash?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           tx.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCoin && matchesNetwork && matchesStatus && matchesSearch;
    });
  }, [filterCoin, filterNetwork, filterStatus, searchTerm]);

  // Calculate high-level stats for inbound and outbound volume.
  const stats = useMemo(() => {
    const inbound = filteredTransactions
      .filter(tx => tx.type === 'RECEIVE' || tx.type === 'DEPOSIT')
      .reduce((acc, tx) => acc + (tx.coin === CoinSymbol.USDT ? tx.amount : 0), 0);
    const outbound = filteredTransactions
      .filter(tx => tx.type === 'SEND')
      .reduce((acc, tx) => acc + (tx.coin === CoinSymbol.USDT ? tx.amount : 0), 0);
    return { inbound, outbound };
  }, [filteredTransactions]);

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'COMPLETED': return { label: 'Completed', color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: CheckCircle2 };
      case 'PENDING': return { label: 'Pending', color: 'text-amber-500', bg: 'bg-amber-500/10', icon: Clock };
      case 'FAILED': return { label: 'Failed', color: 'text-rose-500', bg: 'bg-rose-500/10', icon: XCircle };
      default: return { label: status, color: 'text-gray-400', bg: 'bg-gray-100', icon: Clock };
    }
  };

  return (
    <div className="pb-28 animate-in fade-in duration-300 h-full flex flex-col">
      <ScreenHeader title="Savings Analytics" onBack={onBack} />
      
      <div className="px-1 space-y-6 flex-1 flex flex-col">
        {/* Performance Header */}
        <Card className="p-6 bg-slate-900 border-indigo-500/20 shadow-xl shadow-indigo-500/10 overflow-hidden relative">
           <div className="absolute top-0 right-0 p-4 opacity-5">
              <TrendingUp size={80} className="text-crypto-accent" />
           </div>
           <div className="grid grid-cols-2 gap-8 relative z-10">
              <div>
                 <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Total Inbound</div>
                 <div className="text-2xl font-black text-crypto-accent tracking-tighter leading-none">
                    +${stats.inbound.toLocaleString()}
                 </div>
                 <p className="text-[8px] text-white/20 font-bold mt-1 uppercase">USDT Equivalent</p>
              </div>
              <div>
                 <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Total Outbound</div>
                 <div className="text-2xl font-black text-white tracking-tighter leading-none">
                    -${stats.outbound.toLocaleString()}
                 </div>
                 <p className="text-[8px] text-white/20 font-bold mt-1 uppercase">USDT Equivalent</p>
              </div>
           </div>
        </Card>

        {/* Action Bar */}
        <div className="flex gap-2">
           <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-crypto-accent transition-colors" />
              <input 
                type="text" 
                placeholder="Search Hash..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-slate-900/60 border border-gray-100 dark:border-slate-800 rounded-2xl py-3.5 pl-11 pr-4 text-[11px] font-bold text-gray-900 dark:text-white focus:outline-none focus:border-crypto-accent transition-all"
              />
           </div>
           <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`p-3.5 rounded-2xl border-2 transition-all ${showFilters ? 'border-crypto-accent bg-crypto-accent/5 text-crypto-accent shadow-lg shadow-crypto-accent/10' : 'border-gray-100 dark:border-slate-800 text-gray-400'}`}
           >
              <Filter size={18} />
           </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <Card className="p-5 animate-in slide-in-from-top-2 duration-300 space-y-5 bg-white/40 dark:bg-slate-900/40 border-gray-100 dark:border-slate-800">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Asset Filter</label>
                   <select 
                      value={filterCoin} 
                      onChange={e => setFilterCoin(e.target.value as any)}
                      className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl px-3 py-2 text-[10px] font-bold text-gray-900 dark:text-white focus:outline-none"
                    >
                      <option value="ALL">All Coins</option>
                      {Object.values(CoinSymbol).map(c => <option key={c} value={c}>{c}</option>)}
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Network Layer</label>
                   <select 
                      value={filterNetwork} 
                      onChange={e => setFilterNetwork(e.target.value as any)}
                      className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl px-3 py-2 text-[10px] font-bold text-gray-900 dark:text-white focus:outline-none"
                    >
                      <option value="ALL">All Networks</option>
                      {Object.values(NetworkType).map(n => <option key={n} value={n}>{n}</option>)}
                   </select>
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Status Protocol</label>
                <div className="flex gap-2">
                   {['ALL', 'COMPLETED', 'PENDING', 'FAILED'].map(s => (
                      <button 
                        key={s} 
                        onClick={() => setFilterStatus(s as any)}
                        className={`flex-1 py-2 rounded-xl text-[9px] font-black tracking-tight border transition-all ${filterStatus === s ? 'bg-indigo-500 border-indigo-500 text-white shadow-md' : 'bg-gray-50 dark:bg-slate-800 border-gray-100 dark:border-slate-700 text-gray-400'}`}
                      >
                         {s.charAt(0) + s.slice(1).toLowerCase()}
                      </button>
                   ))}
                </div>
             </div>
          </Card>
        )}

        {/* List Header */}
        <div className="flex justify-between items-center px-1">
           <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Asset Manifest</h3>
           <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500">
              <Table size={12} /> {filteredTransactions.length} Entries Found
           </div>
        </div>

        {/* Transaction List */}
        <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar pr-1">
           {filteredTransactions.length === 0 ? (
             <div className="py-24 text-center">
                <div className="w-16 h-16 bg-gray-50 dark:bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto mb-4 text-gray-200 dark:text-slate-800">
                   <Search size={32} />
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No matching transactions found</p>
             </div>
           ) : (
             filteredTransactions.map(tx => {
                const status = getStatusConfig(tx.status);
                const isPositive = tx.type === 'RECEIVE' || tx.type === 'DEPOSIT';
                return (
                   <Card key={tx.id} className="p-4 border-gray-100 dark:border-slate-800/60 bg-white dark:bg-slate-900/40 hover:scale-[1.01] transition-transform shadow-sm group">
                      <div className="flex justify-between items-start mb-4">
                         <div className="flex items-center gap-4">
                            <div className="relative">
                               <CoinBadge symbol={tx.coin} size="md" />
                               <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center ${isPositive ? 'bg-crypto-accent text-black' : 'bg-gray-100 dark:bg-slate-800 text-gray-400'}`}>
                                  {isPositive ? <ArrowDownLeft size={10} strokeWidth={4} /> : <Send size={10} strokeWidth={4} />}
                               </div>
                            </div>
                            <div>
                               <div className="text-sm font-black text-gray-900 dark:text-white tracking-tight group-hover:text-crypto-accent transition-colors">
                                  {tx.type === 'RECEIVE' ? 'Recieve' : tx.type === 'SEND' ? 'Send' : 'Deposit'} Manifest
                               </div>
                               <div className="flex items-center gap-2 mt-1">
                                  <NetworkBadge network={tx.network} />
                                  <span className="text-[8px] font-mono text-gray-400 tracking-tighter uppercase">{tx.id}</span>
                               </div>
                            </div>
                         </div>
                         <div className="text-right">
                            <div className={`text-sm font-black tracking-tighter ${isPositive ? 'text-crypto-accent' : 'text-gray-900 dark:text-white'}`}>
                               {isPositive ? '+' : '-'}{tx.amount} {tx.coin}
                            </div>
                            <div className="text-[9px] text-gray-400 font-mono tracking-widest mt-1">
                               {new Date(tx.date).toLocaleDateString()}
                            </div>
                         </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-3 border-t border-gray-50 dark:border-slate-800/50">
                         <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${status.bg} ${status.color} border-current/10`}>
                            <status.icon size={10} strokeWidth={3} />
                            {status.label}
                         </div>
                         <button className="text-[9px] font-black text-gray-400 hover:text-crypto-accent uppercase tracking-widest flex items-center gap-1 transition-colors">
                            Details <ChevronDown size={10} />
                         </button>
                      </div>
                   </Card>
                );
             })
           )}
        </div>
      </div>
    </div>
  );
};
