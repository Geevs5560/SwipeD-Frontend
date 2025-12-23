
import React, { useState, useMemo } from 'react';
import { CoinSymbol, NetworkType, GasDeposit, GasRevenue, DepositActivity } from '../types';
import { MOCK_GAS_DEPOSITS, MOCK_GAS_REVENUE, MOCK_DEPOSIT_ACTIVITIES, AVAILABLE_NETWORKS, COINS_BY_NETWORK } from '../constants';
import { Card, CoinBadge, NetworkBadge, Button, ScreenHeader, Input } from './Shared';
import { Fuel, ArrowDownLeft, ArrowUpRight, Plus, RefreshCw, Calendar, Sparkles, Building2, ChevronRight, XCircle, Info, Trash2, CheckCircle2, TrendingUp, History, DollarSign, Clock, LayoutList } from 'lucide-react';

interface GasManagementProps {
  initialParams?: { coin?: CoinSymbol; network?: NetworkType };
  onBack: () => void;
}

export const GasManagementScreen: React.FC<GasManagementProps> = ({ initialParams, onBack }) => {
  const [deposits, setDeposits] = useState<GasDeposit[]>(MOCK_GAS_DEPOSITS);
  const [revenues, setRevenues] = useState<GasRevenue[]>(MOCK_GAS_REVENUE);
  const [activities, setActivities] = useState<DepositActivity[]>(MOCK_DEPOSIT_ACTIVITIES);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [historyCoin, setHistoryCoin] = useState<CoinSymbol | null>(null);
  const [filterCoin, setFilterCoin] = useState<CoinSymbol | 'ALL'>(initialParams?.coin || 'ALL');

  const filteredDeposits = useMemo(() => {
    if (filterCoin === CoinSymbol.USDT) return [];
    return filterCoin === 'ALL' 
      ? deposits 
      : deposits.filter(d => d.coin === filterCoin);
  }, [deposits, filterCoin]);

  const totalRevenue = useMemo(() => 
    revenues.reduce((acc, rev) => acc + rev.totalUsdtEarned, 0), 
  [revenues]);

  const handleWithdraw = (id: string, premature: boolean) => {
    const status = premature ? "Premature Withdrawal executed (10% Slashing Applied)" : "Matured Withdrawal authorized.";
    alert(`${status}\nAssets returned to Savings Vault.`);
    setDeposits(prev => prev.filter(d => d.id !== id));
  };

  const handleRedeemRevenue = () => {
    alert(`Redeeming $${totalRevenue.toFixed(2)} USDT revenue to Savings Vault...`);
    // Add activity record
    const newAct: DepositActivity = {
      id: `DA-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      type: 'REDEEM',
      coin: CoinSymbol.USDT,
      amount: totalRevenue,
      balanceAfter: 0,
      timestamp: new Date().toISOString()
    };
    setActivities([newAct, ...activities]);
    setRevenues([]);
  };

  const handleNewDeposit = (amount: number, coin: CoinSymbol, network: NetworkType) => {
    const newDeposit: GasDeposit = {
      id: `GD-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      coin,
      network,
      amount,
      initialAmount: amount,
      consumedAmount: 0,
      maturityDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString()
    };
    setDeposits([newDeposit, ...deposits]);
    
    const newAct: DepositActivity = {
      id: `DA-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      type: 'DEPOSIT',
      coin,
      amount,
      timestamp: new Date().toISOString()
    };
    setActivities([newAct, ...activities]);
    setIsDepositModalOpen(false);
  };

  const filteredHistory = useMemo(() => {
    if (!historyCoin) return [];
    return activities.filter(a => a.coin === historyCoin);
  }, [activities, historyCoin]);

  return (
    <div className="pb-28">
      <ScreenHeader title="Deposit Management" onBack={onBack} />
      
      <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar px-1">
        <button 
          onClick={() => setFilterCoin('ALL')}
          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap border-2 ${filterCoin === 'ALL' ? 'border-indigo-500 bg-indigo-500/5 text-indigo-500' : 'border-gray-100 dark:border-slate-800 text-gray-400'}`}
        >
          All Assets
        </button>
        {Object.values(CoinSymbol).map(c => (
          <button 
            key={c}
            onClick={() => setFilterCoin(c)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap border-2 flex items-center gap-2 ${filterCoin === c ? (c === CoinSymbol.USDT ? 'border-emerald-500 bg-emerald-500/5 text-emerald-500' : 'border-indigo-500 bg-indigo-500/5 text-indigo-500') : 'border-gray-100 dark:border-slate-800 text-gray-400'}`}
          >
            <CoinBadge symbol={c} size="sm" /> {c} {c === CoinSymbol.USDT && <span className="text-[8px] bg-emerald-500 text-white px-1 rounded ml-1">REV</span>}
          </button>
        ))}
      </div>

      <div className="space-y-6 px-1">
        {filterCoin === CoinSymbol.USDT ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
             <div className="flex justify-between items-center">
                <h3 className="text-gray-500 dark:text-slate-400 text-xs font-mono uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp size={14} className="text-emerald-500" /> Revenue Protocol
                </h3>
                <div className="flex gap-2">
                    <button 
                      onClick={() => setHistoryCoin(CoinSymbol.USDT)}
                      className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 hover:scale-105 transition-all"
                    >
                        <History size={18} />
                    </button>
                    <button 
                      onClick={handleRedeemRevenue}
                      disabled={revenues.length === 0}
                      className="bg-emerald-500 text-white dark:text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 transition-all"
                    >
                        Redeem
                    </button>
                </div>
             </div>

             <Card className="p-8 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent border-emerald-500/20 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <DollarSign size={48} className="text-emerald-500" />
                </div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Redeemable Revenue</div>
                <div className="text-4xl font-black text-emerald-500 tracking-tighter">${totalRevenue.toFixed(2)} <span className="text-lg opacity-40">USDT</span></div>
                <div className="mt-4 flex justify-center gap-2">
                    <div className="px-3 py-1 bg-emerald-500/10 rounded-full text-[9px] font-black text-emerald-500 border border-emerald-500/20">Markup Applied</div>
                    <div className="px-3 py-1 bg-emerald-500/10 rounded-full text-[9px] font-black text-emerald-500 border border-emerald-500/20">Real-time Spot Rate</div>
                </div>
             </Card>

             <div className="space-y-3">
                {revenues.length === 0 ? (
                    <div className="py-24 text-center">
                        <History size={32} className="mx-auto mb-4 text-gray-200" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No consumption earnings yet</p>
                    </div>
                ) : (
                    revenues.map(rev => (
                        <Card key={rev.id} className="p-4 border-gray-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <CoinBadge symbol={rev.sourceCoin} size="md" />
                                    <div>
                                        <div className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">Consumed {rev.consumedQty} {rev.sourceCoin}</div>
                                        <div className="text-[9px] text-gray-400 font-mono tracking-widest mt-0.5">{new Date(rev.timestamp).toLocaleString()}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-black text-emerald-500">+${rev.totalUsdtEarned.toFixed(2)}</div>
                                    <div className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">Profit Included</div>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
             </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-gray-500 dark:text-slate-400 text-xs font-mono uppercase tracking-widest flex items-center gap-2">
                    <Fuel size={14} className="text-indigo-500" /> Active Asset Vaults
                </h3>
                <div className="flex gap-2">
                    <button 
                        onClick={() => filterCoin !== 'ALL' && setHistoryCoin(filterCoin)}
                        disabled={filterCoin === 'ALL'}
                        className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 hover:scale-110 transition-all disabled:opacity-30"
                    >
                        <LayoutList size={20} />
                    </button>
                    <button 
                        onClick={() => setIsDepositModalOpen(true)}
                        className="bg-indigo-500 text-white dark:text-black p-2 rounded-xl shadow-lg hover:scale-110 transition-all active:scale-95"
                    >
                        <Plus size={20} strokeWidth={3} />
                    </button>
                </div>
            </div>

            {filteredDeposits.length === 0 ? (
              <div className="py-24 text-center">
                <div className="w-16 h-16 bg-gray-50 dark:bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto mb-4 text-gray-200 dark:text-slate-800">
                   <Fuel size={32} />
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No active asset nodes found</p>
              </div>
            ) : (
              filteredDeposits.map(deposit => {
                const consumptionPercent = (deposit.consumedAmount / deposit.initialAmount) * 100;
                const isMatured = new Date(deposit.maturityDate) <= new Date();
                
                return (
                  <Card key={deposit.id} className="p-0 overflow-hidden border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950/40 shadow-sm relative group">
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <CoinBadge symbol={deposit.coin} size="lg" />
                                <div className="min-w-0">
                                    <div className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight truncate">
                                        {deposit.amount} {deposit.coin}
                                    </div>
                                    <div className="flex items-center gap-2 text-[9px] text-gray-400 font-mono tracking-widest uppercase mt-0.5">
                                        <NetworkBadge network={deposit.network} />
                                        <span>• ID: {deposit.id}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 shrink-0">
                                <div className={`text-[9px] font-black px-3 py-1 rounded-full border ${isMatured ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'}`}>
                                {isMatured ? 'MATURED' : 'LOCKED'}
                                </div>
                                <button 
                                    onClick={() => setHistoryCoin(deposit.coin)}
                                    className="p-1.5 bg-gray-50 dark:bg-slate-800 rounded-lg text-gray-400 hover:text-indigo-500 transition-colors"
                                >
                                    <History size={14} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3 mb-8">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Asset Consumption</span>
                                <span className="text-[10px] font-mono text-gray-900 dark:text-white">{consumptionPercent.toFixed(1)}%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                <div 
                                    className={`h-full transition-all duration-1000 ${consumptionPercent > 80 ? 'bg-indigo-600' : 'bg-indigo-500'}`} 
                                    style={{ width: `${consumptionPercent}%` }}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-gray-100 dark:border-slate-800">
                                <div className="text-[8px] font-black text-gray-400 uppercase mb-1">Created</div>
                                <div className="text-[10px] font-bold text-gray-900 dark:text-white">{new Date(deposit.createdAt).toLocaleDateString()}</div>
                            </div>
                            <div className="bg-gray-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-gray-100 dark:border-slate-800">
                                <div className="text-[8px] font-black text-gray-400 uppercase mb-1">Maturity</div>
                                <div className="text-[10px] font-bold text-gray-900 dark:text-white">{new Date(deposit.maturityDate).toLocaleDateString()}</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex border-t border-gray-100 dark:border-slate-800">
                        {isMatured ? (
                            <button 
                                onClick={() => handleWithdraw(deposit.id, false)}
                                className="w-full py-4 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                            >
                                <ArrowUpRight size={14} /> Full Withdrawal
                            </button>
                        ) : (
                            <button 
                                onClick={() => handleWithdraw(deposit.id, true)}
                                className="w-full py-4 bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                            >
                                <XCircle size={14} /> Premature Withdrawal
                            </button>
                        )}
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        )}
      </div>

      {isDepositModalOpen && (
        <DepositModal 
          onClose={() => setIsDepositModalOpen(false)} 
          onConfirm={handleNewDeposit} 
        />
      )}

      {historyCoin && (
        <HistoryModal 
            coin={historyCoin} 
            activities={filteredHistory} 
            onClose={() => setHistoryCoin(null)} 
        />
      )}
    </div>
  );
};

const HistoryModal: React.FC<{ coin: CoinSymbol, activities: DepositActivity[], onClose: () => void }> = ({ coin, activities, onClose }) => {
    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
            <Card className="w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300 bg-white/90 dark:bg-slate-950/90 border-indigo-500/20 h-[80vh] flex flex-col">
                <div className="p-8 border-b border-gray-100 dark:border-slate-800 text-center relative shrink-0">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-indigo-500 transition-colors"><XCircle size={20} /></button>
                    <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-500 shadow-inner border border-indigo-500/10">
                        <CoinBadge symbol={coin} size="lg" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">{coin} Manifest</h3>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1 font-black tracking-widest uppercase">Transaction Persistence Layer</p>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                    {activities.length === 0 ? (
                        <div className="py-20 text-center text-gray-400">
                           <Clock className="mx-auto mb-4 opacity-20" size={32} />
                           <p className="text-[10px] font-black uppercase tracking-widest">No activity recorded</p>
                        </div>
                    ) : (
                        activities.map(act => (
                            <Card key={act.id} className="p-4 bg-white/40 dark:bg-slate-900/40 border-gray-100 dark:border-slate-800/60 shadow-none">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${act.type === 'REVENUE_CREDIT' || act.type === 'DEPOSIT' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-indigo-500/10 text-indigo-500'}`}>
                                            {act.type === 'DEPOSIT' && <Plus size={14} />}
                                            {act.type === 'CONSUMPTION' && <Fuel size={14} />}
                                            {act.type === 'REVENUE_CREDIT' && <TrendingUp size={14} />}
                                            {act.type === 'REDEEM' && <ArrowUpRight size={14} />}
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-tight">{act.type.replace('_', ' ')}</div>
                                            <div className="text-[8px] text-gray-400 font-mono mt-0.5">{new Date(act.timestamp).toLocaleString()}</div>
                                        </div>
                                    </div>
                                    <div className={`text-xs font-black ${act.type === 'REVENUE_CREDIT' || act.type === 'DEPOSIT' ? 'text-emerald-500' : 'text-indigo-500'}`}>
                                        {act.type === 'DEPOSIT' || act.type === 'REVENUE_CREDIT' ? '+' : '-'}{act.amount} {act.coin}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-y-2 pt-3 border-t border-gray-50 dark:border-slate-800/60">
                                    {act.marketRate && (
                                        <div className="text-[8px] font-bold text-gray-400 uppercase">Market Rate: <span className="text-gray-900 dark:text-white">${act.marketRate.toFixed(2)}</span></div>
                                    )}
                                    {act.exchangeRate && (
                                        <div className="text-[8px] font-bold text-gray-400 uppercase text-right">Exchange Rate: <span className="text-gray-900 dark:text-white">${act.exchangeRate.toFixed(2)}</span></div>
                                    )}
                                    {act.profit && (
                                        <div className="text-[8px] font-bold text-gray-400 uppercase">Profit: <span className="text-emerald-500">+${act.profit.toFixed(2)}</span></div>
                                    )}
                                    {act.sourceCoin && (
                                        <div className="text-[8px] font-bold text-gray-400 uppercase text-right">From: <span className="text-gray-900 dark:text-white">{act.sourceCoin}</span></div>
                                    )}
                                    {act.balanceAfter !== undefined && (
                                        <div className="text-[8px] font-bold text-gray-400 uppercase">Bal. After: <span className="text-gray-900 dark:text-white">{act.balanceAfter.toFixed(2)} {act.coin}</span></div>
                                    )}
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </Card>
        </div>
    );
};

const DepositModal: React.FC<{ onClose: () => void, onConfirm: (amt: number, coin: CoinSymbol, net: NetworkType) => void }> = ({ onClose, onConfirm }) => {
    const [amount, setAmount] = useState('');
    const [coin, setCoin] = useState<CoinSymbol>(CoinSymbol.ETH); // Default to ETH, USDT disabled for deposit
    const [network, setNetwork] = useState<NetworkType>(NetworkType.ERC20);
    const [step, setStep] = useState(1);

    const savingsBalance = 12500; // Mock

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
            <Card className="w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300 bg-white/90 dark:bg-slate-900/90 border-indigo-500/30">
                <div className="p-8 border-b border-gray-100 dark:border-slate-800 text-center relative">
                    <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-500 shadow-inner border border-indigo-500/10">
                        <Building2 size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Forge Asset Node</h3>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-2 font-black tracking-widest uppercase">Savings → Management Vault</p>
                </div>
                
                <div className="p-8 space-y-6">
                    {step === 1 ? (
                        <div className="space-y-6">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Choose Fuel Asset</label>
                            <div className="grid grid-cols-2 gap-3">
                                {Object.values(CoinSymbol).filter(c => c !== CoinSymbol.TRX && c !== CoinSymbol.USDT).map(c => (
                                    <button 
                                        key={c}
                                        onClick={() => setCoin(c)}
                                        className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${coin === c ? 'border-indigo-500 bg-indigo-500/5 text-indigo-500' : 'border-gray-100 dark:border-slate-800 text-gray-400'}`}
                                    >
                                        <CoinBadge symbol={c} size="md" />
                                        <span className="text-[10px] font-black">{c}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl flex gap-3">
                                <span className="shrink-0"><Info size={16} className="text-gray-400" /></span>
                                <p className="text-[9px] text-gray-500 leading-relaxed font-medium uppercase">USDT cannot be deposited directly. It is earned as revenue when these fuel assets are consumed by the platform.</p>
                            </div>
                            <Button className="w-full h-12 bg-indigo-500" onClick={() => setStep(2)}>Next Step <ChevronRight size={16} /></Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <Input 
                                label="Transfer Amount" 
                                type="number" 
                                placeholder="0.00" 
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                rightElement={<span className="text-xs font-black text-indigo-500">{coin}</span>}
                            />
                            <div className="flex justify-between items-center text-[10px] font-black text-gray-400 px-1">
                                <span className="uppercase tracking-widest">Savings Context</span>
                                <span className="text-gray-900 dark:text-white">{savingsBalance} {coin}</span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                                {AVAILABLE_NETWORKS.filter(n => COINS_BY_NETWORK[n].includes(coin)).map(n => (
                                    <button 
                                        key={n}
                                        onClick={() => setNetwork(n)}
                                        className={`py-2 rounded-xl border font-mono text-[10px] transition-all ${network === n ? 'border-indigo-500 bg-indigo-500/5 text-indigo-500' : 'border-gray-100 dark:border-slate-800 text-gray-400'}`}
                                    >
                                        {n}
                                    </button>
                                ))}
                            </div>

                            <div className="pt-4 space-y-4">
                                <Button className="w-full h-16 rounded-[1.5rem] bg-indigo-500 shadow-indigo-500/20" disabled={!amount} onClick={() => onConfirm(parseFloat(amount), coin, network)}>
                                    Authorize Transfer
                                </Button>
                                <button 
                                    onClick={onClose}
                                    className="w-full text-[10px] font-black text-gray-400 hover:text-indigo-500 uppercase tracking-[0.3em] transition-colors py-2"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};
