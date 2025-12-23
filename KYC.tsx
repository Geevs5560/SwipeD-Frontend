
import React, { useState } from 'react';
import { Card, Button, Input, ScreenHeader } from './Shared';
import { ShieldCheck, Upload, FileText, UserCheck, AlertCircle, CheckCircle2, ChevronRight, Landmark, RefreshCw } from 'lucide-react';

export const KYCScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [kycType, setKycType] = useState<'PERSONAL' | 'BUSINESS' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsFinished(true);
    }, 2500);
  };

  if (isFinished) {
    return (
      <div className="pb-24 animate-in zoom-in duration-500">
        <ScreenHeader title="KYC Status" onBack={onBack} />
        <Card className="p-10 text-center space-y-6 bg-crypto-accent/5 border-crypto-accent/20">
          <div className="w-20 h-20 bg-crypto-accent/10 rounded-full flex items-center justify-center mx-auto text-crypto-accent shadow-[0_0_30px_var(--accent-glow)]">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Protocol Under Review</h2>
          <p className="text-[12px] text-gray-500 dark:text-slate-400 font-bold tracking-wide">
            Your identity manifest has been received. Our compliance oracles are currently validating your documentation.
          </p>
          <div className="p-4 bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-800">
            <div className="flex justify-between items-center text-xs font-bold text-gray-400">
              <span>Estimated Wait</span>
              <span className="text-crypto-accent">12 - 24 Hours</span>
            </div>
          </div>
          <Button className="w-full h-16 rounded-2xl font-bold" onClick={onBack}>Return Dashboard</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <ScreenHeader title="Identity Protocol" onBack={onBack} />
      <div className="flex justify-between px-2 mb-10 overflow-x-auto no-scrollbar">
        {[1, 2, 3].map(i => (
            <div key={i} className={`h-1.5 flex-1 mx-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-crypto-accent shadow-[0_0_10px_var(--accent-glow)]' : 'bg-gray-200 dark:bg-slate-800'}`} />
        ))}
      </div>
      <div className="px-1 space-y-6">
        {step === 1 && (
          <div className="animate-in slide-in-from-right duration-300 space-y-6">
            <h3 className="text-xs font-bold text-gray-400 tracking-wide">Step 1: Entity Classification</h3>
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => setKycType('PERSONAL')}
                className={`p-6 rounded-[2rem] border-2 text-left transition-all flex items-center justify-between ${kycType === 'PERSONAL' ? 'border-crypto-accent bg-crypto-accent/5' : 'border-gray-100 dark:border-slate-800'}`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-crypto-accent/10 text-crypto-accent rounded-2xl"><UserCheck size={24} /></div>
                  <div>
                    <div className="text-sm font-bold">Personal Account</div>
                    <div className="text-[10px] text-gray-400 font-bold tracking-tight">Individual identity verification</div>
                  </div>
                </div>
                {kycType === 'PERSONAL' && <CheckCircle2 size={20} className="text-crypto-accent" />}
              </button>
            </div>
            <Button className="w-full h-18 rounded-[2rem] font-bold" disabled={!kycType} onClick={() => setStep(2)}>Next Level</Button>
          </div>
        )}
      </div>
    </div>
  );
};
