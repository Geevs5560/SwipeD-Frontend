
import React, { useState } from 'react';
import { Card, Button, Input, Logo } from './Shared';
import { User } from '../types';
import { MOCK_USER } from '../constants';
import { Upload, CheckCircle2, ShieldCheck, ChevronLeft, UserCheck, KeyRound, Mail, Smartphone, ArrowRight, ShieldAlert, Fingerprint, Shield as AdminShield } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
  onOwnerLogin?: () => void;
}

export const AuthScreen: React.FC<AuthProps> = ({ onLogin, onOwnerLogin }) => {
  const [mode, setMode] = useState<'LOGIN' | 'ESTABLISH' | 'FORGOT'>('LOGIN');
  const [regStep, setRegStep] = useState(1);
  const [forgotStep, setForgotStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    mobile: '',
    type: 'PERSONAL',
    name: '',
    country: '',
    doc: null as File | null
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Secret Owner Credentials
    if (formData.username === 'kingfishblad' && formData.password === 'kingfishblad9567263346') {
      onOwnerLogin?.();
    } else {
      // Normal User Login
      onLogin(MOCK_USER as unknown as User);
    }
  };

  const handleRegisterNext = () => {
    if (regStep < 4) setRegStep(regStep + 1);
  };

  const renderLogin = () => (
    <div className="max-w-md mx-auto mt-20 p-6 animate-in fade-in duration-700">
      <div className="text-center mb-10 flex flex-col items-center">
        <Logo className="text-6xl mb-4" />
        <div className="h-1 w-12 bg-crypto-accent rounded-full mb-4 shadow-[0_0_10px_var(--accent-glow)]"></div>
        <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.4em]">Protocol Gateway</p>
      </div>
      
      <form onSubmit={handleLogin}>
        <Card className="space-y-6 p-8 border-gray-100 dark:border-slate-800 shadow-2xl shadow-crypto-accent/5">
          <Input 
            label="UID / Managed Email" 
            placeholder="Enter credentials"
            value={formData.username} 
            onChange={e => setFormData({...formData, username: e.target.value})}
          />
          <Input 
            label="Secure Password" 
            type="password"
            placeholder="••••••••"
            value={formData.password} 
            onChange={e => setFormData({...formData, password: e.target.value})}
          />
          
          <div className="flex justify-end items-center">
            <button 
              type="button"
              onClick={() => setMode('FORGOT')}
              className="text-[10px] font-black text-gray-400 dark:text-slate-500 hover:text-crypto-accent transition-colors uppercase tracking-widest"
            >
              Forgot Passcode?
            </button>
          </div>

          <Button type="submit" className="w-full h-14 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-crypto-accent/20">
            Authorize Login
          </Button>

          <div className="text-center">
            <p className="text-[10px] font-black text-gray-400 dark:text-slate-600 uppercase tracking-widest">
              New Entity? <button type="button" onClick={() => setMode('ESTABLISH')} className="text-crypto-accent hover:underline ml-1">Establish Account</button>
            </p>
          </div>
        </Card>
      </form>
      
      <div className="mt-12 text-center">
         <p className="text-[9px] font-bold text-gray-400 dark:text-slate-700 uppercase tracking-widest leading-relaxed">
            Encrypted by SwipeD Cryptographic Protocol v3.1<br/>
            Securing Digital Assets via Distributed Ledger
         </p>
      </div>
    </div>
  );

  const renderForgotPassword = () => (
    <div className="max-w-md mx-auto mt-16 p-6 animate-in slide-in-from-left duration-500">
      <div className="text-center mb-10 flex flex-col items-center">
        <Logo className="text-4xl mb-4" />
        <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Account Recovery</h2>
        <div className="h-1 w-8 bg-amber-500 rounded-full mt-2 shadow-[0_0_10px_rgba(245,158,11,0.3)]"></div>
      </div>

      <Card className="p-8 border-gray-100 dark:border-slate-800 min-h-[400px] flex flex-col">
        {forgotStep === 1 && (
          <div className="space-y-6 flex-1 animate-in fade-in duration-300">
            <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 flex gap-4">
              <ShieldAlert className="text-amber-500 shrink-0" size={20} />
              <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold leading-relaxed uppercase">
                Initiating security override. Enter your registered UID or Managed Email to receive an authentication packet.
              </p>
            </div>
            <Input label="Identity Identifier" placeholder="UID or Email Address" />
            <Button className="w-full h-14 rounded-2xl font-black uppercase tracking-widest bg-amber-500 text-white" onClick={() => setForgotStep(2)}>
              Request Packet
            </Button>
          </div>
        )}

        {forgotStep === 2 && (
          <div className="space-y-6 flex-1 animate-in fade-in duration-300">
            <div className="text-center">
               <div className="w-12 h-12 bg-crypto-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-crypto-accent">
                 <Mail size={24} />
               </div>
               <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase">Authentication Required</h3>
               <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Enter the 6-digit verification sequence</p>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {[1,2,3,4,5,6].map(i => (
                <input key={i} maxLength={1} className="w-full aspect-square bg-gray-50 dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-800 rounded-xl text-center font-black text-lg focus:border-crypto-accent outline-none" />
              ))}
            </div>
            <Button className="w-full h-14 rounded-2xl font-black uppercase tracking-widest" onClick={() => setForgotStep(3)}>
              Verify Packet
            </Button>
            <p className="text-center text-[9px] font-black text-gray-400 uppercase tracking-widest">Resend Sequence in 00:59</p>
          </div>
        )}

        {forgotStep === 3 && (
          <div className="space-y-6 flex-1 animate-in fade-in duration-300">
            <div className="space-y-4">
               <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase">New Security Key</h3>
               <Input label="New Passcode" type="password" placeholder="••••••••" />
               <Input label="Confirm Passcode" type="password" placeholder="••••••••" />
            </div>
            <Button className="w-full h-14 rounded-2xl font-black uppercase tracking-widest" onClick={() => setForgotStep(4)}>
              Update Registry
            </Button>
          </div>
        )}

        {forgotStep === 4 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
             <div className="w-20 h-20 bg-crypto-accent/10 rounded-[2rem] flex items-center justify-center mb-6 text-crypto-accent border border-crypto-accent/20">
               <CheckCircle2 size={40} />
             </div>
             <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase">Registry Updated</h3>
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2 px-4 leading-relaxed">
               Security keys have been successfully re-encrypted. You may now access your vault.
             </p>
             <Button className="w-full mt-10 h-14 rounded-2xl font-black uppercase tracking-widest" onClick={() => setMode('LOGIN')}>
               Authorize Return
             </Button>
          </div>
        )}

        {forgotStep < 4 && (
          <button onClick={() => setMode('LOGIN')} className="mt-6 text-[10px] font-black text-gray-400 hover:text-crypto-accent uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-colors">
            <ChevronLeft size={14} /> Abort Recovery
          </button>
        )}
      </Card>
    </div>
  );

  const renderEstablishAccount = () => (
    <div className="max-w-md mx-auto mt-10 p-4 animate-in slide-in-from-right duration-500">
       <div className="text-center mb-8 flex flex-col items-center">
        <Logo className="text-4xl mb-4" />
        <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Establish Account</h2>
        <div className="flex gap-2 justify-center mt-4">
            {[1,2,3,4].map(s => (
                <div key={s} className={`h-1 w-10 rounded-full transition-all duration-500 ${s <= regStep ? 'bg-crypto-accent shadow-[0_0_8px_var(--accent-glow)]' : 'bg-gray-200 dark:bg-slate-800'}`} />
            ))}
        </div>
      </div>

      <Card className="p-8 min-h-[480px] flex flex-col border-gray-100 dark:border-slate-800">
        {regStep === 1 && (
            <div className="space-y-6 flex-1 animate-in fade-in duration-300">
                <div className="space-y-1">
                    <h3 className="text-sm font-black text-crypto-accent uppercase tracking-widest">Entity Classification</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Define your protocol participation</p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    <button 
                        onClick={() => setFormData({...formData, type: 'PERSONAL'})}
                        className={`p-6 rounded-3xl border-2 flex items-center justify-between transition-all group ${formData.type === 'PERSONAL' ? 'border-crypto-accent bg-crypto-accent/5' : 'border-gray-100 dark:border-slate-800 hover:border-gray-200'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-2xl transition-colors ${formData.type === 'PERSONAL' ? 'bg-crypto-accent text-black' : 'bg-gray-100 dark:bg-slate-800 text-gray-400'}`}>
                                <UserCheck size={24} />
                            </div>
                            <div className="text-left">
                                <span className="font-black text-sm text-gray-900 dark:text-white uppercase tracking-tight">Personal Vault</span>
                                <div className="text-[9px] text-gray-400 font-bold uppercase">Individual Node</div>
                            </div>
                        </div>
                        {formData.type === 'PERSONAL' && <CheckCircle2 size={20} className="text-crypto-accent" />}
                    </button>
                    <button 
                         onClick={() => setFormData({...formData, type: 'BUSINESS'})}
                         className={`p-6 rounded-3xl border-2 flex items-center justify-between transition-all group ${formData.type === 'BUSINESS' ? 'border-crypto-accent bg-crypto-accent/5' : 'border-gray-100 dark:border-slate-800 hover:border-gray-200'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-2xl transition-colors ${formData.type === 'BUSINESS' ? 'bg-crypto-accent text-black' : 'bg-gray-100 dark:bg-slate-800 text-gray-400'}`}>
                                <ShieldCheck size={24} />
                            </div>
                            <div className="text-left">
                                <span className="font-black text-sm text-gray-900 dark:text-white uppercase tracking-tight">Corporate Node</span>
                                <div className="text-[9px] text-gray-400 font-bold uppercase">Multi-user compliance</div>
                            </div>
                        </div>
                        {formData.type === 'BUSINESS' && <CheckCircle2 size={20} className="text-crypto-accent" />}
                    </button>
                </div>
            </div>
        )}

        {regStep === 2 && (
            <div className="space-y-4 flex-1 animate-in fade-in duration-300">
                <div className="space-y-1 mb-4">
                    <h3 className="text-sm font-black text-crypto-accent uppercase tracking-widest">Profile Identity</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Enter legal name as per ID</p>
                </div>
                 <Input label="Full Identity Name" placeholder="John Doe" />
                 <Input label="Protocol Mobile" placeholder="+1 (555) 000-0000" />
                 <Input label="Country Code" placeholder="Select Jurisdiction" />
                 <Input label="Managed Email" placeholder="identity@provider.com" />
            </div>
        )}

        {regStep === 3 && (
             <div className="space-y-4 flex-1 animate-in fade-in duration-300">
                <div className="space-y-1 mb-4">
                    <h3 className="text-sm font-black text-crypto-accent uppercase tracking-widest">Security Layer</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Define authentication keys</p>
                </div>
                <Input label="Create Access Key" type="password" placeholder="••••••••" />
                <Input label="Confirm Access Key" type="password" placeholder="••••••••" />
                
                <div className="mt-4 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-[2rem] p-8 text-center hover:border-crypto-accent cursor-pointer transition-all group bg-gray-50/50 dark:bg-slate-900/30">
                    <Upload className="mx-auto mb-3 text-gray-400 dark:text-slate-600 group-hover:text-crypto-accent transition-colors" size={32} />
                    <p className="text-[10px] font-black text-gray-500 dark:text-slate-400 uppercase tracking-widest">Upload Identity Manifest</p>
                    <p className="text-[8px] text-gray-400 mt-2 uppercase">(Passport / National ID / Driving License)</p>
                    <input type="file" className="hidden" />
                </div>
             </div>
        )}

        {regStep === 4 && (
             <div className="space-y-4 flex-1 text-center flex flex-col items-center justify-center animate-in zoom-in duration-500">
                <div className="w-20 h-20 bg-crypto-accent/10 rounded-[2rem] flex items-center justify-center mb-6 shadow-xl shadow-crypto-accent/10 border border-crypto-accent/20">
                    <ShieldCheck className="w-10 h-10 text-crypto-accent" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Manifest In-Review</h3>
                <p className="text-[10px] text-gray-500 dark:text-slate-400 font-black tracking-widest uppercase max-w-xs leading-relaxed">
                    Identity payload successfully broadcasted.<br/>Compliance oracles will validate within 24 hours.
                </p>
                <div className="w-full mt-10">
                    <Button onClick={() => onLogin(MOCK_USER as unknown as User)} className="w-full h-16 rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-crypto-accent/20">
                        Enter Ecosystem
                    </Button>
                </div>
             </div>
        )}

        {regStep < 4 && (
            <div className="mt-8 flex gap-3">
                <Button variant="outline" className="flex-1 rounded-2xl h-14 font-black uppercase tracking-widest" onClick={() => regStep > 1 ? setRegStep(regStep - 1) : setMode('LOGIN')}>
                    Back
                </Button>
                <Button className="flex-1 rounded-2xl h-14 font-black uppercase tracking-widest" onClick={handleRegisterNext}>
                    {regStep === 3 ? 'Finalize' : 'Proceed'}
                </Button>
            </div>
        )}
      </Card>
    </div>
  );

  return mode === 'LOGIN' ? renderLogin() : mode === 'ESTABLISH' ? renderEstablishAccount() : renderForgotPassword();
};

export const OwnerAuthScreen: React.FC<{ onAuth: () => void, onBack: () => void }> = ({ onAuth, onBack }) => {
  const [pin, setPin] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '000000') onAuth();
    else alert('Invalid Administrator Credentials');
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 animate-in zoom-in duration-700">
      <div className="text-center mb-10 flex flex-col items-center">
        <Logo className="text-6xl mb-4" />
        <div className="h-1 w-12 bg-indigo-500 rounded-full mb-4 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Administrator Portal</p>
      </div>

      <Card className="p-8 border-indigo-500/20 bg-slate-950/80 shadow-2xl shadow-indigo-500/10">
        <div className="flex flex-col items-center mb-8">
           <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 mb-4 border border-indigo-500/20">
              <KeyRound size={32} />
           </div>
           <h3 className="text-lg font-black text-white uppercase tracking-tighter">Root Authorization</h3>
           <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">Enter 6-Digit System Key</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
           <Input 
              type="password" 
              maxLength={6} 
              placeholder="••••••" 
              value={pin}
              onChange={e => setPin(e.target.value)}
              className="text-center text-2xl tracking-[0.5em]"
           />
           <Button className="w-full h-14 bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest">
              Unlock Root
           </Button>
        </form>

        <button onClick={onBack} className="w-full mt-6 text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
           <ChevronLeft size={14} /> Exit to Gateway
        </button>
      </Card>
    </div>
  );
};
