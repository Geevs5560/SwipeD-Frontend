
import React, { useState } from 'react';
import { NetworkType, CoinSymbol, WalletCardProps, Transaction, ViewState } from '../types';
import { Card, CoinBadge, NetworkBadge, Button, Logo } from './Shared';
import { COINS_BY_NETWORK, COIN_LOGOS, MOCK_TRANSACTIONS } from '../constants';
import { 
  Menu, X, User as UserIcon, Shield, Send, ArrowDownLeft, 
  ShieldCheck, PlusCircle, History, FileText, QrCode, 
  Settings, Sun, Moon, Clock, ChevronRight, Eye, 
  EyeOff, TrendingUp, MoreHorizontal, Building2, Sparkles, Palette, Search, ExternalLink
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (view: string, params?: any) => void;
  user: any;
  toggleTheme?: () => void;
  isDarkMode?: boolean;
  cycleThemeColor?: () => void;
  themeColor?: string;
}

const SidebarMenu = ({ isOpen, onClose, onNavigate, user }: { isOpen: boolean, onClose: () => void, onNavigate: (v: ViewState) => void, user: any }) => {
  const menuItems = [
    { label: 'KYC Verification', icon: Shield, view: 'KYC', color: 'text-amber-500' },
    { label: 'User Profile', icon: UserIcon, view: 'PROFILE', color: 'text-indigo-500' }, 
    { label: 'Send Assets', icon: Send, view: 'SEND', color: 'text-crypto-accent' },
    { label: 'Recieve Assets', icon: ArrowDownLeft, view: 'RECEIVE', color: 'text-crypto-accent' },
    { label: 'Escrow Vault', icon: ShieldCheck, view: 'ESCROW', color: 'text-crypto-accent' },
    { label: 'Asset Deposits', icon: PlusCircle, view: 'GAS_DEPOSITS', color: 'text-indigo-500' },
    { label: 'Transaction History', icon: History, view: 'TRANSACTIONS', color: 'text-gray-400' },
    { label: 'Financial Manifests', icon: FileText, view: 'STATEMENTS', color: 'text-gray-400' },
  ];

  return (
    <>
      <div 
        className={`fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div className={`fixed top-0 left-0 bottom-0 z-[200] w-72 bg-white dark:bg-slate-950 border-r border-gray-100 dark:border-slate-800 transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : '-translate-x-full shadow-none'} shadow-2xl`}>
        <div className="flex flex-col h-full">
          <div className="p-8 border-b border-gray-50 dark:border-slate-900">
            <div className="flex justify-between items-center mb-8">
              <Logo className="text-2xl" />
              <button onClick={onClose} className="p-2 rounded-xl bg-gray-50 dark:bg-slate-900 text-gray-400 hover:text-crypto-accent transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => { onNavigate('PROFILE'); onClose(); }}>
              <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white dark:border-slate-800 shadow-lg">
                <img src={user?.avatarUrl} alt="User" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="font-bold text-gray-900 dark:text-white tracking-tight">{user?.name}</div>
                <div className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">{user?.id}</div>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2 no-scrollbar">
            {menuItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => { onNavigate(item.view as ViewState); onClose(); }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-900 transition-all group active:scale-95"
              >
                <div className={`p-2.5 rounded-xl bg-current/5 ${item.color} group-hover:scale-110 transition-transform`}>
                  <item.icon size={20} strokeWidth={2} />
                </div>
                <span className="text-sm font-bold text-gray-600 dark:text-slate-400 tracking-tight group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
          <div className="p-8 border-t border-gray-50 dark:border-slate-900">
            <button className="w-full py-4 px-6 rounded-2xl bg-rose-500/10 text-rose-500 text-[11px] font-bold tracking-wider border border-rose-500/10 hover:bg-rose-500/20 transition-all">
              Security Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const TotalBalanceCard = ({ isHidden, toggleHidden, onOpenDetails }: { isHidden: boolean, toggleHidden: () => void, onOpenDetails: () => void }) => (
  <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 dark:bg-slate-950 p-8 text-white shadow-2xl shadow-crypto-accent/30 dark:shadow-slate-950/40 mb-8 transition-all duration-500 group border border-white/10">
    <div className="absolute inset-0 bg-gradient-to-br from-crypto-accent via-slate-800 to-slate-900 opacity-90 transition-colors duration-500"></div>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--accent-glow),transparent_60%)]"></div>
    <div className="absolute inset-0 premium-3d-grid opacity-10 group-hover:opacity-20 transition-opacity duration-700 animate-grid-flow"></div>
    <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
            <div>
                <div className="flex items-center gap-2 text-white/70 font-bold text-xs tracking-wide mb-3">
                   <Sparkles size={14} className="text-white" />
                   Savings Account
                </div>
                <div className="flex items-center gap-4">
                    <h2 className="text-5xl font-black tracking-tighter drop-shadow-sm">
                        {isHidden ? '•••••••' : '$12,500.00'}
                    </h2>
                    <button 
                      onClick={toggleHidden} 
                      className="opacity-60 hover:opacity-100 transition-opacity bg-white/10 hover:bg-white/20 p-2.5 rounded-2xl backdrop-blur-xl border border-white/10"
                    >
                        {isHidden ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </div>
            <button 
              onClick={onOpenDetails}
              className="bg-white/10 p-4 rounded-3xl backdrop-blur-xl border border-white/20 shadow-lg hover:bg-white/20 transition-all active:scale-95"
            >
                <Building2 size={24} className="text-white" />
            </button>
        </div>
        <div className="flex items-center justify-between mt-8">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white bg-white/20 px-3.5 py-2 rounded-2xl border border-white/20 backdrop-blur-md">
                    <TrendingUp size={14} className="text-white" />
                    <span>+1.8%</span>
                </div>
                 <div className="h-4 w-px bg-white/10"></div>
                 <span className="text-xs text-white/60 font-medium tracking-tight">Active Cryptographic Vault</span>
            </div>
            <button 
              onClick={onOpenDetails}
              className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-white/70 hover:text-white transition-colors"
            >
              View Analytics <ExternalLink size={12} />
            </button>
        </div>
    </div>
  </div>
);

const WalletSection: React.FC<WalletCardProps & { onAction: (action: string, coin?: CoinSymbol, network?: NetworkType, walletType?: 'SAVINGS' | 'PERSONAL' | 'GAS') => void, isHidden: boolean }> = ({ type, title, networks, onAction, isHidden }) => {
  const getHeaderColor = () => {
      switch(type) {
          case 'SAVINGS': return 'bg-crypto-accent';
          case 'GAS': return 'bg-indigo-500';
          default: return 'bg-crypto-accent';
      }
  };

  const allCoins: { coin: CoinSymbol, network: NetworkType }[] = [];
  (Object.keys(networks) as NetworkType[]).forEach(net => {
      networks[net]?.forEach(coin => {
          allCoins.push({ coin, network: net });
      });
  });

  return (
    <div className="mb-8 last:mb-0">
      <div className="flex justify-between items-end mb-4 px-2">
        <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2">
                <div className={`w-1.5 h-6 rounded-full ${getHeaderColor()} transition-colors duration-500`}></div>
                {title}
            </h3>
            <p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold mt-0.5 ml-3.5">
                {allCoins.length} Active Assets
            </p>
        </div>
        {type === 'GAS' && (
          <button 
            onClick={() => onAction('GAS_DEPOSITS')}
            className="text-[10px] font-bold text-indigo-500 hover:text-indigo-600 tracking-wider flex items-center gap-1.5 bg-indigo-500/5 px-4 py-2 rounded-xl border border-indigo-500/10 transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            Deposit Management <ChevronRight size={12} />
          </button>
        )}
      </div>
      <div className="flex overflow-x-auto gap-4 px-2 pb-4 no-scrollbar -mx-2">
        {allCoins.map((item, idx) => (
          <div 
            key={`${item.network}-${item.coin}-${idx}`}
            onClick={() => {
              if (type === 'GAS') {
                onAction('GAS_DEPOSITS', item.coin, item.network);
              } else if (type === 'SAVINGS') {
                onAction('SAVINGS_ACCOUNT', item.coin, item.network);
              }
            }}
            className={`flex-shrink-0 w-44 bg-white dark:bg-slate-900/60 rounded-3xl p-5 border border-gray-100 dark:border-slate-800 shadow-sm relative group overflow-hidden transition-all cursor-pointer active:scale-95 ring-0 hover:ring-2 ${type === 'GAS' ? 'hover:ring-indigo-500/20' : 'hover:ring-crypto-accent/20'}`}
          >
             <div className="flex justify-between items-start mb-4">
                <CoinBadge symbol={item.coin} size="lg" />
                <div className="bg-gray-100 dark:bg-slate-800 p-1.5 rounded-xl">
                    <NetworkBadge network={item.network} />
                </div>
             </div>
             <div className="mb-4">
                <div className="text-xs font-bold text-gray-400 dark:text-slate-500 mb-0.5 uppercase">{item.coin}</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                    {isHidden ? '••••••' : (item.coin === 'USDT' ? '12,450.00' : item.coin === 'ETH' ? '2.50' : '5,000')}
                </div>
                <div className="text-[10px] text-gray-500 dark:text-slate-500 font-bold mt-0.5 uppercase">
                    ≈ ${isHidden ? '••••' : (item.coin === 'USDT' ? '12,450' : item.coin === 'ETH' ? '6,000' : '384')} USD
                </div>
             </div>
             <div className="flex gap-2">
                {type === 'GAS' ? (
                     <div className="w-full flex flex-col gap-2">
                        <div className="h-1 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                           <div className="h-full bg-indigo-500 w-[65%]" />
                        </div>
                        <span className="text-[8px] font-bold text-indigo-500 text-center tracking-tighter">Click to Manage Deposits</span>
                     </div>
                ) : (
                    <>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onAction('SEND', item.coin, item.network, 'SAVINGS'); }}
                            className="flex-1 py-2 bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white text-[10px] font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            Send
                        </button>
                        <button 
                             onClick={(e) => { e.stopPropagation(); onAction('RECEIVE', item.coin, item.network, 'SAVINGS'); }}
                             className="flex-1 py-2 bg-crypto-accent/5 dark:bg-crypto-accent/10 text-crypto-accent text-[10px] font-bold rounded-xl hover:bg-crypto-accent/20 transition-colors"
                        >
                            Rec
                        </button>
                    </>
                )}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, user, toggleTheme, isDarkMode, cycleThemeColor, themeColor }) => {
  const [hideBalances, setHideBalances] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleWalletAction = (action: string, coin?: CoinSymbol, network?: NetworkType, walletType?: 'SAVINGS' | 'PERSONAL' | 'GAS') => {
    onNavigate(action, { coin, network, destination: walletType });
  };

  const recentTransactions = [...MOCK_TRANSACTIONS]
    .filter(tx => tx.coin !== CoinSymbol.TRX || tx.network !== NetworkType.TRC20)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="pb-28 pt-2">
      <SidebarMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        onNavigate={(v) => onNavigate(v)} 
        user={user} 
      />
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-3.5">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="p-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl text-gray-600 dark:text-slate-400 hover:text-crypto-accent transition-all active:scale-90 shadow-sm"
            >
              <Menu size={22} strokeWidth={2} />
            </button>
            <div 
              onClick={() => onNavigate('SAVINGS_ACCOUNT')}
              className="cursor-pointer group"
            >
                <Logo className="text-xl" />
                <p className="text-[10px] text-gray-500 dark:text-slate-500 font-bold -mt-1 tracking-widest flex items-center gap-1 group-hover:text-crypto-accent transition-colors">
                  Savings Account <ChevronRight size={10} />
                </p>
            </div>
        </div>
        <div className="flex gap-3">
            <button className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800 rounded-full text-gray-600 dark:text-slate-300 hover:text-crypto-accent transition-all shadow-sm border border-gray-100 dark:border-slate-700">
                <Search size={18} />
            </button>
            <button onClick={cycleThemeColor} className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800 rounded-full text-crypto-accent hover:scale-110 transition-all shadow-sm border border-gray-100 dark:border-slate-700">
                <Palette size={18} />
            </button>
            {toggleTheme && (
                <button onClick={toggleTheme} className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800 rounded-full text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white transition-all shadow-sm border border-gray-100 dark:border-slate-700">
                    {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
            )}
        </div>
      </div>

      <TotalBalanceCard 
        isHidden={hideBalances} 
        toggleHidden={() => setHideBalances(!hideBalances)} 
        onOpenDetails={() => onNavigate('SAVINGS_ACCOUNT')}
      />

      <div className="grid grid-cols-4 gap-3 mb-10 px-1">
        {[
            { label: 'Send', icon: Send, action: 'SEND', bg: 'bg-crypto-accent/10', color: 'text-crypto-accent' },
            { label: 'Recieve', icon: ArrowDownLeft, action: 'RECEIVE', bg: 'bg-crypto-accent/10', color: 'text-crypto-accent' },
            { label: 'Escrow', icon: ShieldCheck, action: 'ESCROW', bg: 'bg-crypto-accent/10', color: 'text-crypto-accent' },
            { label: 'Deposits', icon: PlusCircle, action: 'GAS_DEPOSITS', bg: 'bg-indigo-500/10', color: 'text-indigo-500' },
        ].map((item, i) => (
            <button key={i} onClick={() => onNavigate(item.action)} className="flex flex-col items-center gap-2 group">
                <div className={`w-14 h-14 rounded-[1.2rem] ${item.bg} flex items-center justify-center ${item.color} group-hover:scale-105 transition-all duration-200 shadow-sm border border-transparent hover:border-current/10 relative overflow-hidden`}>
                    <item.icon size={22} strokeWidth={2} />
                </div>
                <span className="text-[11px] font-bold text-gray-600 dark:text-slate-400 tracking-tight">{item.label}</span>
            </button>
        ))}
      </div>

      <div className="space-y-4 mb-8">
        <WalletSection 
            type="SAVINGS" 
            title="Savings Portfolio" 
            onAction={handleWalletAction}
            isHidden={hideBalances}
            networks={{
                [NetworkType.ERC20]: [CoinSymbol.USDT, CoinSymbol.ETH],
                [NetworkType.BEP20]: [CoinSymbol.USDT, CoinSymbol.BNB],
            }} 
        />
        <WalletSection 
            type="GAS" 
            title="Asset Deposits" 
            onAction={handleWalletAction}
            isHidden={hideBalances}
            networks={{
                [NetworkType.ERC20]: [CoinSymbol.USDT, CoinSymbol.ETH],
                [NetworkType.BEP20]: [CoinSymbol.BNB],
            }} 
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-6 px-2">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Recent Activity</h3>
            <button onClick={() => onNavigate('TRANSACTIONS')} className="text-[11px] text-crypto-accent font-bold tracking-wider flex items-center hover:bg-crypto-accent/5 dark:hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors">
                History <ChevronRight size={12} className="ml-1" />
            </button>
        </div>
        <div className="space-y-3">
            {recentTransactions.map(tx => (
                <div key={tx.id} onClick={() => onNavigate('TRANSACTIONS')} className="flex items-center justify-between p-4 rounded-3xl bg-white dark:bg-slate-900/40 border border-gray-100 dark:border-slate-800/60 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors ${tx.type === 'SEND' ? 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white' : 'bg-crypto-accent/10 text-crypto-accent'}`}>
                            {tx.type === 'SEND' ? <Send size={20} /> : tx.type === 'RECEIVE' ? <ArrowDownLeft size={20} /> : <Clock size={20} />}
                        </div>
                        <div>
                            <div className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-crypto-accent transition-colors">{tx.type === 'SEND' ? 'Send' : 'Recieve'}</div>
                            <div className="text-[10px] text-gray-400 dark:text-slate-500 font-mono">{new Date(tx.date).toLocaleDateString()}</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className={`text-sm font-bold ${tx.type === 'SEND' ? 'text-gray-900 dark:text-white' : 'text-crypto-accent'}`}>
                             {tx.type === 'SEND' ? '-' : '+'}{tx.amount} {tx.coin}
                        </div>
                        <div className="flex items-center justify-end gap-1.5 mt-0.5">
                             <NetworkBadge network={tx.network} />
                             <div className={`w-1.5 h-1.5 rounded-full bg-crypto-accent transition-colors duration-500`}></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
