
import React, { useState, useMemo } from 'react';
import { Card, ScreenHeader, Button, CoinBadge, NetworkBadge, Logo } from './Shared';
import { 
  BarChart, Activity, DollarSign, Users, ShieldCheck, 
  History, Settings, ChevronRight, UserX, UserCheck, 
  FileText, ArrowUpRight, TrendingUp, Search, Lock, 
  Eye, CheckCircle2, XCircle, AlertCircle, Database, 
  BarChart3, PieChart, LayoutDashboard, Globe, ShieldAlert
} from 'lucide-react';
import { ResponsiveContainer, BarChart as ReBarChart, Bar, XAxis, Tooltip, Cell } from 'recharts';
import { CoinSymbol, NetworkType, User } from '../types';

const MOCK_PLATFORM_USERS: User[] = [
  { id: 'U-88293', name: 'Alex Crypto', email: 'alex@swiped.io', phone: '+1 555-0199', type: 'PERSONAL', isVerified: true, avatarUrl: 'https://i.pravatar.cc/150?u=1', status: 'ACTIVE', kycStatus: 'VERIFIED', balanceUsdt: 12500 },
  { id: 'U-77210', name: 'Sarah Merchant', email: 'sarah@merchants.com', phone: '+1 234-5678', type: 'BUSINESS', isVerified: false, avatarUrl: 'https://i.pravatar.cc/150?u=2', status: 'PENDING', kycStatus: 'PENDING', balanceUsdt: 45000 },
  { id: 'U-99122', name: 'Devin Block', email: 'devin@block.tech', phone: '+1 999-2211', type: 'PERSONAL', isVerified: true, avatarUrl: 'https://i.pravatar.cc/150?u=3', status: 'ACTIVE', kycStatus: 'VERIFIED', balanceUsdt: 2100 },
  { id: 'U-11002', name: 'Molly Ledger', email: 'molly@finance.io', phone: '+1 000-1122', type: 'PERSONAL', isVerified: false, avatarUrl: 'https://i.pravatar.cc/150?u=4', status: 'SUSPENDED', kycStatus: 'REJECTED', balanceUsdt: 0 },
];

const WEEKLY_PROFIT_DATA = [
  { name: 'Mon', profit: 4000, color: '#10B981' },
  { name: 'Tue', profit: 3000, color: '#10B981' },
  { name: 'Wed', profit: 5000, color: '#10B981' },
  { name: 'Thu', profit: 2780, color: '#10B981' },
  { name: 'Fri', profit: 6890, color: '#10B981' },
  { name: 'Sat', profit: 2390, color: '#10B981' },
  { name: 'Sun', profit: 8490, color: '#10B981' },
];

export const OwnerDashboard: React.FC<{ onBack: () => void, onNavigateSub: (view: string) => void }> = ({ onBack, onNavigateSub }) => {
  return (
    <div className="pb-24 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <ScreenHeader title="Root Operations" onBack={onBack} />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card onClick={() => onNavigateSub('OWNER_PROFIT')} className="p-6 bg-slate-900 border-crypto-accent/20 cursor-pointer hover:scale-105 transition-all">
            <div className="text-crypto-accent text-[10px] mb-2 font-black tracking-widest uppercase">Cumulative Profit</div>
            <div className="text-3xl font-black text-white">$28,120.50</div>
            <div className="mt-2 flex items-center gap-1 text-[9px] font-bold text-crypto-accent">
                <TrendingUp size={12} /> +12.5% this week
            </div>
        </Card>
        <Card onClick={() => onNavigateSub('OWNER_USERS')} className="p-6 bg-slate-900 border-indigo-500/20 cursor-pointer hover:scale-105 transition-all">
            <div className="text-indigo-400 text-[10px] mb-2 font-black tracking-widest uppercase">System Nodes</div>
            <div className="text-3xl font-black text-white">1,254</div>
            <div className="mt-2 flex items-center gap-1 text-[9px] font-bold text-indigo-400">
                <Users size={12} /> 48 Pending KYC
            </div>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Management Modules</h3>
        
        <ControlItem 
            icon={Users} 
            title="User Control Center" 
            desc="Manage identities & access levels" 
            count={MOCK_PLATFORM_USERS.length}
            onClick={() => onNavigateSub('OWNER_USERS')}
        />
        <ControlItem 
            icon={ShieldCheck} 
            title="KYC Authorization" 
            desc="Review & validate compliance" 
            count={1}
            color="text-amber-500"
            onClick={() => onNavigateSub('OWNER_KYC_AUTH')}
        />
        <ControlItem 
            icon={BarChart3} 
            title="Profit Analytics" 
            desc="Fee & Gas markup breakdown" 
            onClick={() => onNavigateSub('OWNER_PROFIT')}
            color="text-crypto-accent"
        />
        <ControlItem 
            icon={Database} 
            title="Audit Persistence" 
            desc="System-wide execution logs" 
            onClick={() => onNavigateSub('OWNER_LOGS')}
            color="text-indigo-500"
        />
      </div>

      <div className="mt-10">
        <Card className="p-6 bg-slate-950 border-gray-800">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-xs text-white uppercase tracking-widest flex items-center gap-2">
                    <Activity size={14} className="text-crypto-accent" /> Network Throughput
                </h3>
                <span className="text-[10px] font-mono text-gray-500">Live Updates</span>
            </div>
            <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart data={WEEKLY_PROFIT_DATA}>
                        <XAxis dataKey="name" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#0B0E14', border: '1px solid #1e293b', borderRadius: '12px' }}
                            itemStyle={{ color: '#10B981', fontWeight: 'bold' }}
                        />
                        <Bar dataKey="profit" radius={[6, 6, 0, 0]}>
                            {WEEKLY_PROFIT_DATA.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                            ))}
                        </Bar>
                    </ReBarChart>
                </ResponsiveContainer>
            </div>
        </Card>
      </div>
    </div>
  );
};

const ControlItem = ({ icon: Icon, title, desc, count, color = "text-gray-400", onClick }: any) => (
    <Card onClick={onClick} className="p-5 flex items-center justify-between hover:bg-slate-900 border-gray-100 dark:border-slate-800 cursor-pointer group transition-all">
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl bg-current/10 ${color} group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
            </div>
            <div>
                <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{title}</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-0.5">{desc}</p>
            </div>
        </div>
        <div className="flex items-center gap-3">
            {count !== undefined && (
                <span className="bg-slate-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 text-[10px] font-black px-2 py-1 rounded-lg">
                    {count}
                </span>
            )}
            <ChevronRight size={18} className="text-gray-300 group-hover:text-white transition-colors" />
        </div>
    </Card>
);

export const OwnerUsersPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [search, setSearch] = useState('');
    
    const filteredUsers = useMemo(() => 
        MOCK_PLATFORM_USERS.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.id.toLowerCase().includes(search.toLowerCase())),
    [search]);

    return (
        <div className="pb-24 animate-in slide-in-from-right duration-500">
            <ScreenHeader title="User Control" onBack={onBack} />
            
            <div className="mb-6 px-1">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-crypto-accent transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search Identity or UID..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white focus:outline-none focus:border-crypto-accent"
                    />
                </div>
            </div>

            <div className="space-y-4 px-1">
                {filteredUsers.map(user => (
                    <Card key={user.id} className="p-5 bg-slate-950 border-slate-800/60 flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-800">
                                <img src={user.avatarUrl} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-white uppercase tracking-tight">{user.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[9px] font-mono text-gray-500 uppercase">{user.id}</span>
                                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border ${
                                        user.status === 'ACTIVE' ? 'border-crypto-accent text-crypto-accent' : 
                                        user.status === 'SUSPENDED' ? 'border-red-500 text-red-500' : 'border-amber-500 text-amber-500'
                                    }`}>
                                        {user.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <div className="text-[10px] font-black text-white tracking-tight">${user.balanceUsdt.toLocaleString()} USDT</div>
                            <button className="p-2 bg-slate-800 rounded-lg text-gray-400 hover:text-white transition-colors">
                                <Settings size={14} />
                            </button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export const OwnerKycAuthPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const pendingKyc = MOCK_PLATFORM_USERS.filter(u => u.kycStatus === 'PENDING');

    return (
        <div className="pb-24 animate-in slide-in-from-right duration-500">
            <ScreenHeader title="KYC Authority" onBack={onBack} />
            
            <div className="px-1 space-y-6">
                <div className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-3xl flex gap-4">
                    <ShieldAlert className="text-amber-500 shrink-0" size={24} />
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold leading-relaxed uppercase">
                        Manual validation required for {pendingKyc.length} identity manifests. Compliance oracles suggest cross-referencing national databases.
                    </p>
                </div>

                {pendingKyc.map(user => (
                    <Card key={user.id} className="p-6 bg-slate-950 border-slate-800">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-white uppercase tracking-tight">{user.name}</h4>
                                    <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">{user.id}</span>
                                </div>
                            </div>
                            <button className="p-3 bg-slate-800 rounded-xl text-crypto-accent hover:bg-slate-700">
                                <Eye size={20} />
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                                <div className="text-[8px] font-black text-gray-500 uppercase mb-1">Type</div>
                                <div className="text-[10px] font-bold text-white">{user.type}</div>
                            </div>
                            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                                <div className="text-[8px] font-black text-gray-500 uppercase mb-1">Email</div>
                                <div className="text-[10px] font-bold text-white truncate">{user.email}</div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="flex-1 py-3 bg-rose-500/10 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-rose-500/20 hover:bg-rose-500/20">
                                Reject Protocol
                            </button>
                            <button className="flex-1 py-3 bg-crypto-accent text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
                                Authorize Manifest
                            </button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export const OwnerProfitPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const profitBreakdown = [
        { label: 'Escrow Vault Fees', amount: 12450.00, count: 842, coin: CoinSymbol.USDT, icon: ShieldCheck, color: 'text-crypto-accent' },
        { label: 'Transfer Service Fees', amount: 4890.50, count: 2450, coin: CoinSymbol.USDT, icon: Globe, color: 'text-indigo-400' },
        { label: 'Gas Fuel Markup', amount: 8120.25, count: 512, coin: CoinSymbol.USDT, icon: FuelIcon, color: 'text-amber-500' },
        { label: 'KYC Processing Fees', amount: 2659.75, count: 1254, coin: CoinSymbol.USDT, icon: ShieldAlert, color: 'text-indigo-500' },
    ];

    return (
        <div className="pb-24 animate-in slide-in-from-right duration-500">
            <ScreenHeader title="Profit Ecosystem" onBack={onBack} />
            
            <div className="px-1 space-y-8">
                <Card className="p-8 bg-slate-900 border-crypto-accent/20 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <TrendingUp size={64} className="text-crypto-accent" />
                    </div>
                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Aggregate Platform Earnings</div>
                    <div className="text-4xl font-black text-white tracking-tighter">$28,120.50 <span className="text-lg opacity-40">USDT</span></div>
                    <div className="mt-6 flex justify-center gap-4 border-t border-slate-800 pt-6">
                        <div className="text-left">
                            <div className="text-[8px] font-black text-gray-500 uppercase mb-1">Daily Yield</div>
                            <div className="text-xs font-black text-crypto-accent">+$1,240.20</div>
                        </div>
                        <div className="w-px bg-slate-800"></div>
                        <div className="text-left">
                            <div className="text-[8px] font-black text-gray-500 uppercase mb-1">Monthly Forecast</div>
                            <div className="text-xs font-black text-white">$45,000.00</div>
                        </div>
                    </div>
                </Card>

                <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Revenue Breakdown</h3>
                    {profitBreakdown.map((item, i) => (
                        <Card key={i} className="p-5 bg-slate-950 border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-2xl bg-current/10 ${item.color}`}>
                                    <item.icon size={20} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-white uppercase tracking-tight">{item.label}</h4>
                                    <p className="text-[9px] text-gray-500 font-bold uppercase mt-0.5">{item.count} Processed Transactions</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-black text-white">+${item.amount.toLocaleString()}</div>
                                <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Settled</div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

const FuelIcon = ({ size, className }: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M3 22L15 22" />
        <path d="M18 7L18 22" />
        <path d="M4 9L15 9V22H4V9Z" />
        <path d="M13 13H15" />
        <path d="M18 7L21 11" />
        <path d="M18 15V15" />
        <path d="M15 9L18 5L21 7" />
    </svg>
);

export const OwnerLogsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const logs = [
        { id: 'LOG-001', event: 'KYC_AUTHORIZED', user: 'U-88293', details: 'Manual verification by Root', time: '2 mins ago', severity: 'INFO' },
        { id: 'LOG-002', event: 'ESCROW_SETTLED', user: 'U-77210', details: 'Protocol ESC-9921 finalized', time: '15 mins ago', severity: 'SUCCESS' },
        { id: 'LOG-003', event: 'ROOT_ACCESS', user: 'SYSTEM', details: 'Administrator Portal Login', time: '1 hour ago', severity: 'WARNING' },
        { id: 'LOG-004', event: 'WITHDRAWAL_FAILED', user: 'U-11002', details: 'Insufficient fuel for transaction', time: '3 hours ago', severity: 'ERROR' },
    ];

    return (
        <div className="pb-24 animate-in slide-in-from-right duration-500">
            <ScreenHeader title="Audit Log" onBack={onBack} />
            
            <div className="px-1 space-y-3">
                {logs.map(log => (
                    <Card key={log.id} className="p-4 bg-slate-950 border-slate-800">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${
                                    log.severity === 'SUCCESS' ? 'bg-crypto-accent' : 
                                    log.severity === 'WARNING' ? 'bg-amber-500' : 
                                    log.severity === 'ERROR' ? 'bg-rose-500' : 'bg-indigo-500'
                                } shadow-[0_0_8px_current]`} />
                                <span className="text-[10px] font-black text-white uppercase tracking-tighter">{log.event}</span>
                            </div>
                            <span className="text-[8px] font-mono text-gray-500">{log.time}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{log.details}</p>
                        <div className="mt-3 flex items-center justify-between border-t border-slate-800 pt-3">
                            <span className="text-[8px] font-mono text-gray-600">Actor: {log.user}</span>
                            <span className="text-[8px] font-mono text-gray-600">ID: {log.id}</span>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
