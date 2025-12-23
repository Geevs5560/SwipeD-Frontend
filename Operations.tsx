
import React, { useState, useEffect, useMemo } from 'react';
import { NetworkType, CoinSymbol } from '../types';
import { Card, Button, Input, CoinBadge, NetworkBadge, ScreenHeader, Logo } from './Shared';
import { AVAILABLE_NETWORKS, COINS_BY_NETWORK, COIN_LOGOS } from '../constants';
import { 
  Send, ArrowDownLeft, Check, Loader2, ScanLine, QrCode, Wallet, Fuel, 
  Building2, Globe, AlertCircle, ArrowRight, Zap, Info, ChevronRight, 
  Hash, Timer, XCircle, Share2, ExternalLink, Search, User as UserIcon, 
  CheckCircle, ShieldAlert, Sparkles, Copy, Smartphone, ShieldCheck, 
  RefreshCw, CheckCircle2, Lock, ArrowLeftRight, Database, SearchCode, Shield
} from 'lucide-react';

interface OperationProps {
  initialParams?: { coin?: CoinSymbol; network?: NetworkType; destination?: 'SAVINGS' | 'PERSONAL' | 'GAS' };
  onComplete: () => void;
  onBack: () => void;
}

export const SendFlow: React.FC<OperationProps> = ({ initialParams, onComplete, onBack }) => {
  const [step, setStep] = useState(1);
  const [transferMode, setTransferMode] = useState<'INTERNAL' | 'EXTERNAL' | null>(null);
  const [network, setNetwork] = useState<NetworkType>(initialParams?.network || NetworkType.ERC20);
  const [coin, setCoin] = useState<CoinSymbol>(initialParams?.coin || CoinSymbol.USDT);
  const [recipient, setRecipient] = useState(''); // UID or Address
  const [amount, setAmount] = useState('');
  const [gasAsset, setGasAsset] = useState<CoinSymbol>(CoinSymbol.USDT);
  const [mpin, setMpin] = useState<string[]>(Array(6).fill(''));
  const [isProcessing, setIsProcessing] = useState(false);
  const [txStatus, setTxStatus] = useState<'SUCCESS' | 'FAILED' | null>(null);
  const [error, setError] = useState('');

  const balances = {
    [CoinSymbol.USDT]: 12500.00,
    [CoinSymbol.ETH]: 2.5,
    [CoinSymbol.BNB]: 10.0,
    [CoinSymbol.TRX]: 5000,
  };

  const internalFee = 0.50; // Fixed USDT fee for internal
  const externalFee = 2.00; // Mock external fee
  const currentBalance = balances[coin] || 0;

  // Gas Availability Check
  const availableGasOptions = useMemo(() => {
    const nativeMap: Record<NetworkType, CoinSymbol> = {
      [NetworkType.ERC20]: CoinSymbol.ETH,
      [NetworkType.BEP20]: CoinSymbol.BNB,
      [NetworkType.TRC20]: CoinSymbol.TRX,
    };
    const native = nativeMap[network];
    const options = [CoinSymbol.USDT];
    if (balances[native] > 0) options.push(native);
    return options;
  }, [network]);

  useEffect(() => {
    if (!availableGasOptions.includes(gasAsset)) {
      setGasAsset(availableGasOptions[0]);
    }
  }, [availableGasOptions]);

  // Jump to step 2 if initial params exist
  useEffect(() => {
    if (initialParams?.coin) {
      setStep(2);
      setTransferMode('EXTERNAL');
    }
  }, []);

  const handleMpinChange = (val: string, index: number) => {
    if (!/^\d*$/.test(val)) return;
    const newMpin = [...mpin];
    newMpin[index] = val.slice(-1);
    setMpin(newMpin);
    
    // Auto focus next
    if (val && index < 5) {
      const nextInput = document.getElementById(`mpin-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleFinalConfirm = () => {
    if (mpin.join('').length < 6) {
      setError('Please enter full 6-digit MPIN');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setTxStatus('SUCCESS');
    }, 3000);
  };

  if (txStatus === 'SUCCESS') {
    return (
      <div className="h-full flex flex-col p-2 animate-in zoom-in duration-500">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-crypto-accent/10 rounded-full flex items-center justify-center text-crypto-accent mb-6 shadow-xl border border-crypto-accent/20">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Protocol Settled</h2>
          <p className="text-gray-500 text-sm font-bold tracking-widest uppercase mb-8">Transaction Broadcasted</p>
          
          <Card className="w-full p-6 mb-8 border-dashed bg-gray-50 dark:bg-slate-900/40">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black text-gray-400 uppercase">Transfer Result</span>
              <span className="text-sm font-black text-gray-900 dark:text-white">{amount} {coin}</span>
            </div>
            <div className="text-[10px] text-gray-400 font-bold mb-2 text-left uppercase">Tx Hash</div>
            <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-gray-200 dark:border-slate-700 font-mono text-[10px] text-crypto-accent truncate">
              0x7d8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s
            </div>
          </Card>
          
          <Button className="w-full h-14 rounded-2xl font-black uppercase tracking-widest" onClick={onComplete}>Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col pb-6 px-1 relative">
      {/* Processing Overlay */}
      {isProcessing && (
        <div className="absolute inset-0 z-[1000] bg-white/80 dark:bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-crypto-accent border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Lock size={24} className="text-crypto-accent animate-pulse" />
            </div>
          </div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Encrypting Payload</h3>
          <p className="text-[10px] text-gray-400 font-bold tracking-[0.3em] uppercase">Validating 6-Digit MPIN</p>
        </div>
      )}

      <ScreenHeader title="Send Assets" onBack={step > 1 ? () => setStep(step - 1) : onBack} />

      <div className="flex-1 overflow-y-auto px-1 no-scrollbar pb-20">
        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Choose Transfer Mode</h3>
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => { setTransferMode('INTERNAL'); setStep(2); }}
                className={`p-6 rounded-3xl border-2 flex items-center justify-between group transition-all ${transferMode === 'INTERNAL' ? 'border-crypto-accent bg-crypto-accent/5' : 'border-gray-100 dark:border-slate-800'}`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl"><ArrowLeftRight size={24} /></div>
                  <div className="text-left">
                    <div className="text-sm font-black text-gray-900 dark:text-white">Internal Transfer</div>
                    <div className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">Savings to Savings (Fee: ${internalFee})</div>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-300 group-hover:text-crypto-accent" />
              </button>
              <button 
                onClick={() => { setTransferMode('EXTERNAL'); setStep(2); }}
                className={`p-6 rounded-3xl border-2 flex items-center justify-between group transition-all ${transferMode === 'EXTERNAL' ? 'border-crypto-accent bg-crypto-accent/5' : 'border-gray-100 dark:border-slate-800'}`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-crypto-accent/10 text-crypto-accent rounded-2xl"><Globe size={24} /></div>
                  <div className="text-left">
                    <div className="text-sm font-black text-gray-900 dark:text-white">External Wallet</div>
                    <div className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">Direct Block Address (Network Fees Apply)</div>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-300 group-hover:text-crypto-accent" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Protocol Selection</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-2">
                {AVAILABLE_NETWORKS.map(net => (
                  <button key={net} onClick={() => setNetwork(net)} className={`py-3 rounded-xl border-2 text-[10px] font-black transition-all ${network === net ? 'border-crypto-accent bg-crypto-accent/5 text-crypto-accent' : 'border-gray-100 dark:border-slate-800 text-gray-400'}`}>
                    {net}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {COINS_BY_NETWORK[network].map(s => (
                  <button key={s} onClick={() => setCoin(s)} className={`p-5 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all ${coin === s ? 'border-crypto-accent bg-crypto-accent/5' : 'border-gray-100 dark:border-slate-800'}`}>
                    <CoinBadge symbol={s} size="md" />
                    <span className="text-[10px] font-black uppercase">{s} Protocol</span>
                  </button>
                ))}
              </div>
            </div>
            <Button className="w-full h-16 rounded-[2rem] font-black uppercase tracking-widest" onClick={() => setStep(3)}>Configure Payload</Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Payload Details</h3>
            <div className="space-y-4">
              <Input 
                label={transferMode === 'INTERNAL' ? 'Recipient SwipeD UID' : 'Block Address'}
                placeholder={transferMode === 'INTERNAL' ? 'U-88xxx' : '0x...'}
                value={recipient}
                onChange={e => setRecipient(e.target.value)}
                rightElement={transferMode === 'EXTERNAL' ? <ScanLine size={18} className="text-gray-400" /> : <Search size={18} className="text-gray-400" />}
              />
              <Input 
                label="Transfer Amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                rightElement={<span className="text-xs font-black text-crypto-accent uppercase">{coin}</span>}
              />
              <div className="flex justify-between px-1">
                <span className="text-[9px] font-black text-gray-400 uppercase">Available Balance</span>
                <span className="text-[9px] font-black text-gray-900 dark:text-white uppercase">{currentBalance} {coin}</span>
              </div>
            </div>
            <Button className="w-full h-16 rounded-[2rem] font-black uppercase tracking-widest" onClick={() => setStep(4)}>Review Transfer</Button>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Gas Protocol</h3>
            <Card className="p-6 bg-indigo-500/5 border-indigo-500/20">
              <div className="flex items-center gap-3 mb-4">
                <Fuel size={20} className="text-indigo-500" />
                <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">Auto Gas Selection</span>
              </div>
              <div className="space-y-3">
                {availableGasOptions.map(opt => (
                  <button 
                    key={opt}
                    onClick={() => setGasAsset(opt)}
                    className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${gasAsset === opt ? 'border-indigo-500 bg-white dark:bg-slate-800' : 'border-gray-100 dark:border-slate-800 text-gray-400'}`}
                  >
                    <div className="flex items-center gap-3">
                      <CoinBadge symbol={opt} size="sm" />
                      <span className="text-xs font-bold uppercase">{opt === CoinSymbol.USDT ? 'USDT (Flat Fee)' : `${opt} (Native)`}</span>
                    </div>
                    {gasAsset === opt && <Check size={16} className="text-indigo-500" />}
                  </button>
                ))}
              </div>
            </Card>
            <Button className="w-full h-16 rounded-[2rem] font-black uppercase tracking-widest" onClick={() => setStep(5)}>Final Review</Button>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-8 animate-in slide-in-from-right duration-300">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 text-center">Final Protocol Manifest</h3>
            <Card className="p-8 bg-slate-900 text-white text-center relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5"><Zap size={80} /></div>
               <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Total Payload</div>
               <div className="text-4xl font-black text-crypto-accent tracking-tighter mb-4">{amount} {coin}</div>
               <div className="flex flex-col gap-2 border-t border-white/5 pt-4">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-white/40 uppercase">Recipient</span>
                    <span className="truncate ml-4 max-w-[150px] font-mono">{recipient}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-white/40 uppercase">Gas Asset</span>
                    <span>{gasAsset}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-white/40 uppercase">Platform Fee</span>
                    <span>{transferMode === 'INTERNAL' ? internalFee : externalFee} USDT</span>
                  </div>
               </div>
            </Card>
            <Button className="w-full h-20 rounded-[2.5rem] font-black text-xl uppercase tracking-widest shadow-2xl shadow-crypto-accent/20" onClick={() => setStep(6)}>
              Authorize Swipe
            </Button>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-8 animate-in slide-in-from-right duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-crypto-accent/10 rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 text-crypto-accent">
                <Lock size={32} />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Security Lock</h3>
              <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-1">Enter 6-Digit Secure MPIN</p>
            </div>
            
            <div className="flex justify-center gap-2">
              {mpin.map((char, i) => (
                <input
                  key={i}
                  id={`mpin-${i}`}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  value={char}
                  onChange={e => handleMpinChange(e.target.value, i)}
                  className="w-12 h-16 bg-white dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-800 rounded-2xl text-center text-2xl font-black focus:border-crypto-accent focus:outline-none transition-all"
                />
              ))}
            </div>

            {error && <p className="text-center text-[10px] font-black text-rose-500 uppercase">{error}</p>}

            <div className="grid grid-cols-3 gap-4 max-w-[280px] mx-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '←'].map(key => (
                <button 
                  key={key} 
                  onClick={() => {
                    if (key === '←') {
                      const newMpin = [...mpin];
                      const lastIdx = mpin.findLastIndex(v => v !== '');
                      if (lastIdx !== -1) newMpin[lastIdx] = '';
                      setMpin(newMpin);
                    } else if (key === 'C') {
                      setMpin(Array(6).fill(''));
                    } else {
                      const idx = mpin.findIndex(v => v === '');
                      if (idx !== -1) handleMpinChange(key.toString(), idx);
                    }
                  }}
                  className="h-14 bg-gray-50 dark:bg-slate-900 rounded-2xl text-lg font-black hover:bg-gray-100 dark:hover:bg-slate-800 transition-all active:scale-95"
                >
                  {key}
                </button>
              ))}
            </div>

            <Button className="w-full h-16 rounded-[2rem] font-black uppercase tracking-widest" onClick={handleFinalConfirm}>
              Finalize Protocol
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export const ReceiveFlow: React.FC<OperationProps> = ({ initialParams, onBack, onComplete }) => {
    const [step, setStep] = useState(1);
    const [coin, setCoin] = useState<CoinSymbol>(initialParams?.coin || CoinSymbol.USDT);
    const [network, setNetwork] = useState<NetworkType>(initialParams?.network || NetworkType.ERC20);
    const [amount, setAmount] = useState('');
    const [fromAddress, setFromAddress] = useState('');
    const [txHash, setTxHash] = useState('');
    const [isValidatingFrom, setIsValidatingFrom] = useState(false);
    const [isFromValidated, setIsFromValidated] = useState(false);
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [monitorProgress, setMonitorProgress] = useState(0);
    const [error, setError] = useState('');

    const platformAddress = useMemo(() => {
      const addrs: Record<NetworkType, string> = {
        [NetworkType.ERC20]: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
        [NetworkType.BEP20]: '0x99A...B88b0',
        [NetworkType.TRC20]: 'TNVL2v8A3bH7hY9Jz6yX5wM2Q4r8s9t0u1'
      };
      return addrs[network];
    }, [network]);

    const handleValidateFrom = () => {
      if (!fromAddress || fromAddress.length < 20) {
        setError('Enter a valid source address protocol');
        return;
      }
      setError('');
      setIsValidatingFrom(true);
      setTimeout(() => {
        setIsValidatingFrom(false);
        setIsFromValidated(true);
      }, 1500);
    };

    const handleConfirmHash = () => {
      if (!txHash || txHash.length < 32) {
        setError('Provide valid transaction hash manifest');
        return;
      }
      setError('');
      setIsMonitoring(true);
      const interval = setInterval(() => {
        setMonitorProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 600);
    };

    useEffect(() => {
      if (monitorProgress >= 100) {
        setStep(7); // Jump to success
      }
    }, [monitorProgress]);

    // Navigate to step 3 if initial params are there
    useEffect(() => {
        if (initialParams?.coin && initialParams?.network) {
            setStep(3);
        }
    }, []);

    if (step === 7) {
      return (
          <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in duration-500 p-6">
              <div className="w-24 h-24 bg-crypto-accent/10 rounded-full flex items-center justify-center text-crypto-accent mb-6 shadow-2xl shadow-crypto-accent/20 border border-crypto-accent/20">
                  <CheckCircle2 size={48} strokeWidth={2.5} />
              </div>
              <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter mb-2 uppercase">Assets Vaulted</h2>
              <p className="text-[10px] text-gray-500 font-black tracking-[0.3em] mb-12 uppercase">Settlement Finalized on Distributed Ledger</p>
              
              <Card className="w-full p-6 mb-10 bg-gray-50 dark:bg-slate-900/50 border-dashed">
                 <div className="flex justify-between items-center mb-4">
                    <span className="text-[9px] font-black text-gray-400 uppercase">Settled Hash</span>
                    <span className="text-[9px] font-mono text-crypto-accent truncate ml-4 max-w-[120px]">{txHash}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-gray-400 uppercase">Expectation Meta</span>
                    <span className="text-sm font-black text-gray-900 dark:text-white uppercase">{amount} {coin} Secured</span>
                 </div>
              </Card>

              <Button className="w-full h-20 rounded-[2.5rem] font-black text-xl uppercase tracking-widest" onClick={onComplete}>Return to Dashboard</Button>
          </div>
      );
    }

    if (isMonitoring) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-crypto-dark">
           <div className="relative mb-12">
              <div className="w-32 h-32 border-8 border-gray-800 rounded-full"></div>
              <div 
                className="absolute inset-0 border-8 border-crypto-accent rounded-full animate-sync-pulse transition-all duration-500" 
                style={{ clipPath: `inset(${(100-monitorProgress)}% 0 0 0)` }}
              ></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-crypto-accent">{Math.floor(monitorProgress)}%</span>
              </div>
           </div>
           <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                 <Database className="text-crypto-accent animate-pulse" size={20} />
                 <h3 className="text-xl font-black text-white uppercase tracking-tighter">Monitoring Oracle</h3>
              </div>
              <p className="text-[10px] text-gray-400 font-bold tracking-[0.2em] uppercase max-w-xs mx-auto">
                 Scanning {network} Ledger for {amount} {coin} from specified source...
              </p>
           </div>
           <div className="mt-12 w-full max-w-[200px] h-1.5 bg-gray-800 rounded-full overflow-hidden mx-auto shadow-inner">
              <div className="h-full bg-crypto-accent animate-shine" style={{ width: `${monitorProgress}%` }}></div>
           </div>
        </div>
      );
    }

    return (
        <div className="h-full flex flex-col pb-6 px-1 relative">
            <ScreenHeader title="Recieve Assets" onBack={step > 1 ? () => setStep(s => s - 1) : onBack} />
            
            <div className="flex-1 overflow-y-auto px-1 no-scrollbar space-y-8">
                {step === 1 && (
                    <div className="animate-in slide-in-from-right duration-300 space-y-4">
                        <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] px-1">Select Asset Protocol</h3>
                        {[CoinSymbol.USDT, CoinSymbol.ETH, CoinSymbol.BNB].map(symbol => (
                            <button 
                                key={symbol}
                                onClick={() => { setCoin(symbol); setStep(2); }}
                                className="w-full flex items-center justify-between p-6 rounded-[2.5rem] border-2 border-gray-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 hover:border-crypto-accent transition-all group"
                            >
                                <div className="flex items-center gap-5">
                                    <CoinBadge symbol={symbol} size="lg" />
                                    <span className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter group-hover:text-crypto-accent transition-colors">{symbol}</span>
                                </div>
                                <ChevronRight size={24} className="text-gray-300 group-hover:text-crypto-accent group-hover:translate-x-1 transition-all" />
                            </button>
                        ))}
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-in slide-in-from-right duration-300 space-y-6">
                        <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] px-1">Infrastructure Layer</h3>
                        <div className="grid grid-cols-1 gap-4">
                            {AVAILABLE_NETWORKS.filter(n => COINS_BY_NETWORK[n].includes(coin)).map(net => (
                                <button onClick={() => { setNetwork(net); setStep(3); }} className="p-6 rounded-[2.5rem] border-2 border-gray-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 hover:border-crypto-accent transition-all flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                       <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl group-hover:bg-crypto-accent/10 group-hover:text-crypto-accent transition-colors">
                                          <Globe size={24} />
                                       </div>
                                       <span className="font-black text-sm uppercase tracking-widest">{net} Protocol</span>
                                    </div>
                                    <ChevronRight size={20} className="text-gray-300" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-in slide-in-from-right duration-300 space-y-6">
                        <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] px-1">Expectation Magnitude</h3>
                        <div className="space-y-4">
                            <Input 
                                label="Quantity of Coin Sending"
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                rightElement={<span className="text-xs font-black text-crypto-accent uppercase">{coin}</span>}
                            />
                            <div className="p-5 bg-indigo-500/5 rounded-3xl border border-indigo-500/10 flex gap-4">
                                <Info size={20} className="text-indigo-500 shrink-0" />
                                <p className="text-[10px] text-indigo-600 font-bold leading-relaxed uppercase">The monitoring oracle will specifically look for this amount in the transaction log.</p>
                            </div>
                        </div>
                        <Button className="w-full h-18 rounded-[2rem] font-bold tracking-widest uppercase" disabled={!amount || parseFloat(amount) <= 0} onClick={() => setStep(4)}>Define Manifest</Button>
                    </div>
                )}

                {step === 4 && (
                    <div className="animate-in slide-in-from-right duration-300 space-y-8 pb-10">
                        <div className="text-center space-y-2">
                          <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Deposit Protocol</h3>
                          <div className="flex items-center justify-center gap-2">
                             <CoinBadge symbol={coin} size="sm" />
                             <span className="font-black text-gray-900 dark:text-white">{amount} {coin}</span>
                             <span className="text-[10px] text-gray-400">•</span>
                             <span className="text-[10px] font-black text-crypto-accent uppercase">{network}</span>
                          </div>
                        </div>

                        <div className="flex flex-col items-center">
                            <Card className="p-6 bg-white rounded-[2.5rem] shadow-2xl shadow-black/20">
                                <QrCode size={180} className="text-slate-900" />
                            </Card>
                            <div className="mt-8 w-full space-y-6">
                                <div>
                                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 text-center">SwipeD Vault Point</div>
                                    <div className="flex items-center justify-between gap-3 bg-gray-100 dark:bg-slate-900 p-4 rounded-3xl border border-gray-200 dark:border-slate-800">
                                        <span className="font-mono text-[11px] text-gray-600 dark:text-slate-400 break-all">{platformAddress}</span>
                                        <button onClick={() => navigator.clipboard.writeText(platformAddress)} className="p-3 bg-white dark:bg-slate-800 rounded-2xl text-gray-400 hover:text-crypto-accent transition-colors shadow-sm">
                                            <Copy size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                   <Input 
                                      label="Sending From Address"
                                      placeholder="0x... Enter Source Wallet"
                                      value={fromAddress}
                                      onChange={e => { setFromAddress(e.target.value); setIsFromValidated(false); }}
                                      rightElement={
                                         isValidatingFrom ? <Loader2 className="animate-spin text-crypto-accent" size={18} /> : 
                                         isFromValidated ? <CheckCircle2 className="text-crypto-accent" size={18} /> : 
                                         <SearchCode size={18} className="text-gray-400" />
                                      }
                                      className={isFromValidated ? 'border-crypto-accent bg-crypto-accent/5' : ''}
                                   />
                                   {error && <p className="text-[10px] font-black text-rose-500 uppercase text-center">{error}</p>}
                                   
                                   {!isFromValidated ? (
                                      <Button className="w-full h-16 rounded-[2rem] font-black uppercase tracking-widest" onClick={handleValidateFrom}>
                                         Validate Source
                                      </Button>
                                   ) : (
                                      <Button className="w-full h-16 rounded-[2rem] font-black uppercase tracking-widest bg-crypto-accent text-black shadow-lg shadow-crypto-accent/20" onClick={() => setStep(5)}>
                                         Final Confirmation <ArrowRight size={18} />
                                      </Button>
                                   )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 5 && (
                    <div className="animate-in slide-in-from-right duration-300 space-y-8">
                        <div className="text-center">
                            <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Execution Persistence</h3>
                            <Card className="p-6 bg-slate-900 border-indigo-500/20 text-left">
                               <div className="flex items-center gap-3 mb-4">
                                  <ShieldCheck className="text-crypto-accent" size={18} />
                                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Protocol Monitor Armed</span>
                               </div>
                               <div className="space-y-4">
                                  <div className="flex justify-between">
                                     <span className="text-[9px] font-bold text-white/40 uppercase">Target Amount</span>
                                     <span className="text-[9px] font-bold text-white uppercase">{amount} {coin}</span>
                                  </div>
                                  <div className="flex justify-between">
                                     <span className="text-[9px] font-bold text-white/40 uppercase">Source Origin</span>
                                     <span className="text-[9px] font-mono text-white truncate max-w-[150px]">{fromAddress}</span>
                                  </div>
                               </div>
                            </Card>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Execution Hash Manifest</label>
                            <Input 
                                placeholder="0x... Enter Transaction Hash"
                                value={txHash}
                                onChange={e => setTxHash(e.target.value)}
                                rightElement={<Hash size={18} className="text-gray-400" />}
                            />
                            {error && <p className="text-[10px] font-black text-rose-500 uppercase text-center">{error}</p>}
                        </div>

                        <div className="pt-4">
                           <Button className="w-full h-20 rounded-[2.5rem] font-black text-xl uppercase tracking-widest shadow-2xl shadow-crypto-accent/20 bg-crypto-accent text-black" onClick={handleConfirmHash}>
                                Start Syncing
                           </Button>
                           <p className="mt-6 text-[9px] font-bold text-gray-500 text-center uppercase tracking-widest leading-relaxed px-4">
                              Asset monitoring oracle will synchronize with the {network} ledger once hash is broadcasted.
                           </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
