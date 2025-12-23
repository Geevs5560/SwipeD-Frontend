
import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Input, ScreenHeader, CoinBadge, NetworkBadge, Logo } from './Shared';
import { 
  Shield, Plus, Users, FileText, CheckCircle, Search, Trash2, ArrowRight, 
  Layers, Link as LinkIcon, UserCheck, Clock, RotateCcw, Filter, Mail, 
  ChevronRight, Check, XCircle, AlertTriangle, MessageSquare, Upload, 
  RefreshCw, Building2, ExternalLink, ArrowUpRight, Globe, CreditCard, Sparkles,
  Loader2, ShieldCheck, ShieldAlert, Eye, FileUp, MessageCircle, Phone, AtSign,
  ReceiptText, AlertCircle, CheckCircle2
} from 'lucide-react';
import { CoinSymbol, NetworkType, EscrowContract, EscrowCondition, EscrowStatus, ContactInfo } from '../types';
import { COINS_BY_NETWORK, AVAILABLE_NETWORKS, MOCK_USER, COIN_LOGOS } from '../constants';

const BALANCES = {
  [CoinSymbol.USDT]: 12500.00,
  [CoinSymbol.ETH]: 2.5,
  [CoinSymbol.BNB]: 10.0,
  [CoinSymbol.TRX]: 5000,
};

const PLATFORM_FEE_PERCENT = 0.5;

const GlowLetter: React.FC<{ char: string; delay?: string; className?: string; isJoin?: boolean }> = ({ char, delay = '0s', className = '', isJoin = false }) => (
  <div 
    className={`text-5xl sm:text-6xl font-black tracking-tighter select-none ${isJoin ? 'animate-letter-join' : 'animate-pop-in'} ${className}`}
    style={{ animationDelay: delay }}
  >
    {char}
  </div>
);

export const EscrowFlow: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<'MY_ESCROWS' | 'MAILBOX'>('MY_ESCROWS');
  const [statusFilter, setStatusFilter] = useState<EscrowStatus>('ACTIVE');
  const [selectedEscrow, setSelectedEscrow] = useState<EscrowContract | null>(null);

  const [escrowList, setEscrowList] = useState<EscrowContract[]>([
    {
      id: 'ESC-9921',
      senderId: MOCK_USER.id,
      senderContact: { name: MOCK_USER.name, email: MOCK_USER.email, phone: MOCK_USER.phone },
      mode: 'DIRECT',
      network: NetworkType.ERC20,
      recipientId: 'U-77210',
      recipientContact: { name: 'Sarah Merchant', email: 'sarah@merchants.com', phone: '+1 234-5678' },
      amount: 1500,
      coin: CoinSymbol.USDT,
      status: 'ACTIVE',
      createdAt: '2023-10-27T10:00:00',
      deadline: '2023-11-15T23:59:59',
      conditions: [
        { id: 'C1', description: 'Hardware Shipment', verifierType: 'RECIPIENT', instructions: 'Upload proof of courier pickup', requireDocument: true, status: 'PENDING' },
        { id: 'C2', description: 'Tech Inspection', verifierType: 'THIRD_PARTY', verifierId: MOCK_USER.id, verifierName: 'Platform Oracle', verifierContact: { name: 'Platform Oracle', email: 'oracle@swiped.io', phone: 'SYSTEM' }, instructions: 'Verify hardware specs', requireDocument: false, status: 'PENDING' }
      ],
      disbursementMode: 'AUTO'
    }
  ]);

  const mailboxItems = useMemo(() => 
    escrowList.filter(e => e.senderId !== MOCK_USER.id && (e.recipientId === MOCK_USER.id || e.conditions.some(c => c.verifierId === MOCK_USER.id))),
    [escrowList]
  );

  const filteredEscrows = useMemo(() => {
    if (activeTab === 'MY_ESCROWS') {
      return escrowList.filter(e => e.senderId === MOCK_USER.id && (statusFilter === 'ACTIVE' ? (e.status === 'ACTIVE' || e.status === 'PENDING') : e.status === statusFilter));
    } else {
      return mailboxItems;
    }
  }, [escrowList, activeTab, statusFilter, mailboxItems]);

  const updateEscrow = (updatedEscrow: EscrowContract) => {
    setEscrowList(prev => prev.map(e => e.id === updatedEscrow.id ? updatedEscrow : e));
    setSelectedEscrow(updatedEscrow);
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'ACTIVE':
      case 'PENDING': return 'Active/Pending';
      case 'COMPLETED': return 'Completed';
      case 'ROLLBACK': return 'Rollsback';
      case 'DRAFT': return 'Draft';
      default: return status;
    }
  };

  if (isCreating) {
    return <EscrowCreate onCancel={() => setIsCreating(false)} onComplete={() => setIsCreating(false)} />;
  }

  if (selectedEscrow) {
    return <EscrowReview escrow={selectedEscrow} onUpdate={updateEscrow} onBack={() => setSelectedEscrow(null)} />;
  }

  return (
    <div className="pb-24 relative min-h-[600px]">
      <div className="flex justify-between items-center mb-6">
        <ScreenHeader title="Escrow Vault" onBack={onBack} />
        <button 
          onClick={() => setIsCreating(true)}
          className="p-3 bg-crypto-accent text-white dark:text-black rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all -mt-8"
        >
          <Plus size={24} strokeWidth={3} />
        </button>
      </div>
      
      <div className="flex gap-2 mb-6 px-1">
        <button 
          onClick={() => setActiveTab('MY_ESCROWS')}
          className={`flex-1 py-3.5 rounded-2xl text-xs font-bold tracking-wide transition-all border-2 ${activeTab === 'MY_ESCROWS' ? 'border-crypto-accent bg-crypto-accent/5 text-crypto-accent shadow-sm' : 'border-gray-100 dark:border-slate-800 text-gray-400'}`}
        >
          Outbound
        </button>
        <button 
          onClick={() => setActiveTab('MAILBOX')}
          className={`flex-1 py-3.5 rounded-2xl text-xs font-bold tracking-wide transition-all border-2 flex items-center justify-center gap-2 ${activeTab === 'MAILBOX' ? 'border-crypto-accent bg-crypto-accent/5 text-crypto-accent shadow-sm' : 'border-gray-100 dark:border-slate-800 text-gray-400'}`}
        >
          <Mail size={14} strokeWidth={2} /> Inbox
          {mailboxItems.length > 0 && <div className="min-w-[18px] h-[18px] px-1 rounded-full bg-crypto-accent text-white dark:text-black flex items-center justify-center text-[9px] font-black animate-pulse">{mailboxItems.length}</div>}
        </button>
      </div>

      {activeTab === 'MY_ESCROWS' && (
        <div className="flex bg-gray-100 dark:bg-slate-900/50 p-1.5 rounded-[1.5rem] mb-6 overflow-x-auto no-scrollbar border border-gray-200 dark:border-slate-800">
          {(['ACTIVE', 'COMPLETED', 'ROLLBACK', 'DRAFT'] as EscrowStatus[]).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`flex-1 py-2.5 px-4 rounded-2xl text-[11px] font-bold tracking-tight whitespace-nowrap transition-all ${statusFilter === tab ? 'bg-white dark:bg-slate-800 shadow-sm text-crypto-accent' : 'text-gray-400 dark:text-slate-500 hover:text-gray-600'}`}
            >
              {getStatusLabel(tab)}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-4 px-1">
        {filteredEscrows.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-16 h-16 bg-gray-50 dark:bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto mb-4 text-gray-200 dark:text-slate-800">
               <Shield size={32} />
            </div>
            <p className="text-xs font-bold text-gray-400 tracking-wide">Protocol Buffer Empty</p>
          </div>
        ) : (
          filteredEscrows.map(escrow => (
            <Card 
              key={escrow.id} 
              onClick={() => setSelectedEscrow(escrow)}
              className="p-5 border-gray-100 dark:border-slate-800/60 bg-white dark:bg-slate-950/40 hover:scale-[1.02] transition-transform cursor-pointer group shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <CoinBadge symbol={escrow.coin} size="md" />
                  <div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white tracking-tight group-hover:text-crypto-accent transition-colors">
                      {escrow.amount} {escrow.coin}
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono tracking-wide">
                      {activeTab === 'MY_ESCROWS' ? `To: ${escrow.recipientContact.name}` : `From: ${escrow.senderContact.name}`}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <NetworkBadge network={escrow.network} />
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    escrow.status === 'ROLLBACK' ? 'text-red-500 border-red-500/20 bg-red-500/5' : 
                    escrow.status === 'PENDING' || escrow.status === 'ACTIVE' ? 'text-amber-500 border-amber-500/20 bg-amber-500/5' :
                    'text-crypto-accent border-crypto-accent/20 bg-crypto-accent/5'
                  }`}>
                    {getStatusLabel(escrow.status)}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-3 border-t border-gray-50 dark:border-slate-800/60">
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 tracking-wide">
                  <Clock size={12} className="text-crypto-accent" /> {new Date(escrow.deadline).toLocaleDateString()}
                </div>
                <button className="bg-crypto-accent/10 px-3 py-1.5 rounded-xl text-[10px] font-bold text-crypto-accent tracking-tight flex items-center gap-1.5 hover:bg-crypto-accent/20 transition-all">
                  <Eye size={12} /> Review
                </button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

const EscrowCreate: React.FC<{ onCancel: () => void, onComplete: () => void }> = ({ onCancel, onComplete }) => {
  const [step, setStep] = useState(1);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentFinished, setDeploymentFinished] = useState(false);
  const [network, setNetwork] = useState<NetworkType | null>(null);
  const [showEscrowWord, setShowEscrowWord] = useState(false);
  const [contract, setContract] = useState<Partial<EscrowContract>>({
    coin: CoinSymbol.USDT,
    amount: 0,
    conditions: [],
    disbursementMode: 'AUTO',
    deadline: '',
    senderContact: { name: MOCK_USER.name, email: MOCK_USER.email, phone: MOCK_USER.phone },
    recipientContact: { name: '', email: '', phone: '' },
  });
  
  const [searchRecipient, setSearchRecipient] = useState('');
  const [foundRecipient, setFoundRecipient] = useState<any>(null);
  const [isRecipientConfirmed, setIsRecipientConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fee = useMemo(() => (contract.amount || 0) * (PLATFORM_FEE_PERCENT / 100), [contract.amount]);
  const totalDeduction = (contract.amount || 0) + fee;
  const calculatedBalance = network ? (BALANCES[contract.coin as CoinSymbol] || 0) : 0;
  const isBalanceEnough = totalDeduction <= calculatedBalance;

  const validateNetworkAmount = () => {
    if (!network) { setError("Network Protocol Required."); return; }
    if (!contract.amount || contract.amount <= 0) { setError("Amount Required."); return; }
    if (!isBalanceEnough) { setError("Insufficient Balance."); return; }
    setError(null);
    setStep(2);
  };

  const handleDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => setShowEscrowWord(true), 1200);
    setTimeout(() => {
        setDeploymentFinished(true);
        setTimeout(() => {
            setIsDeploying(false);
            onComplete();
        }, 2000);
    }, 5500);
  };

  const addCondition = () => {
    const newCond: EscrowCondition = {
      id: `C-${Math.random().toString(36).substr(2, 5)}`,
      description: '',
      verifierType: 'SELF',
      instructions: '',
      requireDocument: false,
      status: 'PENDING',
      verifierContact: { name: '', email: '', phone: '' }
    };
    setContract({ ...contract, conditions: [...(contract.conditions || []), newCond] });
  };

  return (
    <div className="pb-28 relative">
      <ScreenHeader title="Escrow Setup" onBack={step > 1 ? () => setStep(step - 1) : onCancel} />
      <div className="flex justify-between px-2 mb-10 overflow-x-auto no-scrollbar">
        {[1, 2, 3, 4, 5, 6, 7].map(i => (
            <div key={i} className={`h-1.5 min-w-[20px] flex-1 mx-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-crypto-accent shadow-[0_0_10px_var(--accent-glow)]' : 'bg-gray-200 dark:bg-slate-800'}`} />
        ))}
      </div>
      <div className={`space-y-6 px-1 transition-all duration-700 ${isDeploying ? 'opacity-0 blur-xl scale-95' : 'opacity-100 blur-none scale-100'}`}>
        {step === 1 && (
          <div className="animate-in slide-in-from-right duration-300 space-y-6">
             <Card className="p-6 space-y-8 bg-white/50 dark:bg-slate-900/40 shadow-none border-gray-100 dark:border-slate-800">
                <div>
                   <label className="text-xs font-bold text-gray-400 tracking-wide mb-4 block">Deployment Infrastructure</label>
                   <div className="grid grid-cols-3 gap-2.5">
                     {AVAILABLE_NETWORKS.map(net => (
                       <button 
                        key={net}
                        onClick={() => { setNetwork(net); setError(null); }}
                        className={`py-3.5 rounded-2xl border-2 text-[11px] font-bold transition-all flex flex-col items-center gap-1 ${network === net ? 'border-crypto-accent bg-crypto-accent/5 text-crypto-accent shadow-lg shadow-crypto-accent/10' : 'border-gray-100 dark:border-slate-800 text-gray-400'}`}
                       >
                        {net}
                       </button>
                     ))}
                   </div>
                </div>
                <div className="space-y-4">
                  <Input 
                    label="Escrow Capital" 
                    type="number" 
                    placeholder="0.00" 
                    value={contract.amount || ''}
                    onChange={e => setContract({...contract, amount: parseFloat(e.target.value) || 0})}
                    rightElement={
                      <div className="flex items-center gap-2">
                        <select 
                          className="bg-transparent text-[11px] font-bold text-gray-900 dark:text-white focus:outline-none"
                          value={contract.coin}
                          onChange={e => setContract({...contract, coin: e.target.value as CoinSymbol})}
                        >
                          {network && COINS_BY_NETWORK[network].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <CoinBadge symbol={contract.coin as CoinSymbol} size="sm" />
                      </div>
                    }
                  />
                </div>
             </Card>
             <Button className="w-full h-18 rounded-[2rem] font-bold tracking-wide" onClick={validateNetworkAmount}>Continue</Button>
          </div>
        )}
      </div>
    </div>
  );
};

const EscrowReview: React.FC<{ escrow: EscrowContract, onUpdate: (e: EscrowContract) => void, onBack: () => void }> = ({ escrow, onUpdate, onBack }) => {
  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'ACTIVE':
      case 'PENDING': return 'Active/Pending';
      case 'COMPLETED': return 'Completed';
      case 'ROLLBACK': return 'Rollsback';
      case 'DRAFT': return 'Draft';
      default: return status;
    }
  };

  return (
    <div className="pb-28 relative">
      <ScreenHeader title="Evaluate Protocol" onBack={onBack} />
      <div className="space-y-6 px-1">
        <Card className="p-0 overflow-hidden border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
           <div className="p-8 bg-crypto-accent/5 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                 <div className="text-xs font-bold text-gray-400 tracking-tight mb-2">Vault Commitment</div>
                 <div className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">{escrow.amount} <span className="text-lg opacity-40 uppercase">{escrow.coin}</span></div>
              </div>
              <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full border ${escrow.status === 'ACTIVE' ? 'bg-crypto-accent/10 border-crypto-accent/20 text-crypto-accent' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'}`}>{getStatusLabel(escrow.status)}</span>
           </div>
        </Card>
      </div>
    </div>
  );
};
