
import React from 'react';
import { Card, ScreenHeader, Button, NetworkBadge } from './Shared';
import { User, Settings, Shield, Bell, Globe, ChevronRight, Lock, LogOut, Mail, Phone, MapPin, UserCheck, Smartphone } from 'lucide-react';
import { MOCK_USER } from '../constants';

export const ProfileScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="pb-24 animate-in fade-in duration-300">
      <ScreenHeader title="Account Identity" onBack={onBack} />
      <div className="px-1 space-y-8">
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="relative">
            <div className="w-28 h-28 rounded-[2.5rem] bg-gray-200 dark:bg-slate-800 overflow-hidden border-4 border-white dark:border-slate-900 shadow-2xl">
              <img src={MOCK_USER.avatarUrl} alt="User" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-crypto-accent p-2 rounded-2xl shadow-xl border-4 border-white dark:border-slate-900">
              <UserCheck size={20} className="text-black" />
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{MOCK_USER.name}</h2>
            <div className="flex items-center justify-center gap-2 mt-1">
              <div className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-widest">{MOCK_USER.id}</div>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span className="text-[10px] font-bold text-crypto-accent tracking-wider">Verified</span>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-400 tracking-widest px-1">Identity Manifest</h3>
          <Card className="p-0 overflow-hidden border-gray-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40">
            {[
              { icon: Mail, label: 'Secure Email', value: MOCK_USER.email },
              { icon: Phone, label: 'Mobile Link', value: MOCK_USER.phone },
              { icon: Smartphone, label: 'Telegram Alias', value: MOCK_USER.telegram },
              { icon: MapPin, label: 'Jurisdiction', value: 'United Kingdom' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-5 border-b last:border-0 border-gray-100 dark:border-slate-800/60">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-gray-50 dark:bg-slate-800 rounded-xl text-gray-400">
                    <item.icon size={18} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 tracking-wide">{item.label}</div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white">{item.value}</div>
                  </div>
                </div>
                <button className="text-[11px] font-bold text-crypto-accent tracking-wide">Edit</button>
              </div>
            ))}
          </Card>
        </div>
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-400 tracking-widest px-1">Security Protocols</h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              { label: '2FA Authentication', icon: Smartphone, desc: 'Biometric & SMS Layer', status: 'Active', color: 'text-crypto-accent' },
              { label: 'Vault Lockdown', icon: Lock, desc: 'Instant account suspension', status: 'Inactive', color: 'text-gray-400' },
            ].map((item, i) => (
              <Card key={i} className="p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors cursor-pointer group shadow-sm">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl bg-current/10 ${item.color}`}>
                    <item.icon size={22} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">{item.label}</div>
                    <div className="text-[10px] text-gray-400 font-bold tracking-tight">{item.desc}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-bold ${item.color}`}>{item.status}</span>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500" />
                </div>
              </Card>
            ))}
          </div>
        </div>
        <button className="w-full p-6 rounded-[2rem] bg-rose-500/10 border-2 border-rose-500/20 flex items-center justify-center gap-3 text-rose-500 font-bold tracking-widest hover:bg-rose-500/20 transition-all group">
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          Terminate Session
        </button>
      </div>
    </div>
  );
};
