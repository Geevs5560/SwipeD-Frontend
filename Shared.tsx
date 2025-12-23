
import React from 'react';
import { NetworkType, CoinSymbol } from '../types';
import { COIN_LOGOS } from '../constants';
import { ChevronRight, Copy, QrCode, ArrowUpRight, ArrowDownLeft, Search } from 'lucide-react';

export const Logo: React.FC<{ className?: string }> = ({ className = "text-xl" }) => (
  <div className={`font-black tracking-tighter flex items-center ${className}`}>
    <span className="text-crypto-accent drop-shadow-[0_0_15px_var(--accent-glow)] transition-colors duration-500">Swipe</span>
    <span className="text-gray-900 dark:text-white animate-dance dancing-d inline-block ml-0.5 drop-shadow-md">D</span>
  </div>
);

export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <div onClick={onClick} className={`bg-white dark:bg-crypto-card border border-gray-200 dark:border-slate-800 rounded-2xl p-4 shadow-xl dark:shadow-none backdrop-blur-sm transition-all duration-300 ${className}`}>
    {children}
  </div>
);

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'danger' }> = 
  ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "px-4 py-3 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 active:scale-95";
  const variants = {
    primary: "bg-crypto-accent text-white dark:text-black hover:opacity-90 shadow-lg shadow-crypto-accent/20 transition-colors duration-500",
    secondary: "bg-gray-100 text-gray-900 dark:bg-slate-700 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-600",
    outline: "border border-gray-300 text-gray-600 dark:border-slate-600 dark:text-slate-300 hover:border-crypto-accent hover:text-crypto-accent dark:hover:border-crypto-accent dark:hover:text-crypto-accent transition-colors duration-500",
    danger: "bg-red-500 text-white hover:bg-red-600 dark:bg-crypto-danger"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className} disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed`} {...props}>
      {children}
    </button>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string; rightElement?: React.ReactNode }> = ({ label, rightElement, className = '', ...props }) => (
  <div className="w-full relative group">
    {label && <label className="block text-[11px] font-bold tracking-wide text-gray-500 dark:text-slate-400 mb-2 ml-1 group-focus-within:text-crypto-accent transition-colors">{label}</label>}
    <div className="relative flex items-center">
      <input 
        className={`w-full bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-gray-900 dark:text-white font-bold placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-crypto-accent dark:focus:border-crypto-accent transition-all duration-300 ${rightElement ? 'pr-16' : ''} ${className}`}
        {...props}
      />
      {rightElement && (
        <div className="absolute right-3 flex items-center justify-center gap-2">
          {rightElement}
        </div>
      )}
    </div>
  </div>
);

export const CoinBadge: React.FC<{ symbol: CoinSymbol; size?: 'sm' | 'md' | 'lg' | 'xl' }> = ({ symbol, size = 'md' }) => {
  const sizes = { 
    sm: 'w-6 h-6', 
    md: 'w-8 h-8', 
    lg: 'w-12 h-12',
    xl: 'w-16 h-16' 
  };
  
  return (
    <div className={`relative ${sizes[size]} rounded-full flex items-center justify-center overflow-hidden border-[2px] border-slate-200 dark:border-slate-700 shadow-[0_4px_12px_rgba(0,0,0,0.4),inset_0_-3px_5px_rgba(0,0,0,0.3),inset_0_3px_5px_rgba(255,255,255,0.2)] group shrink-0 bg-white dark:bg-slate-900 transition-transform duration-500 active:scale-90`}>
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-300/20 via-white/40 to-slate-100/10 dark:from-slate-800/40 dark:via-white/5 dark:to-slate-700/20 pointer-events-none z-20"></div>
      <div className="absolute inset-[2px] rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.3)] pointer-events-none z-10"></div>
      <div className="absolute -inset-2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-30deg] animate-shine pointer-events-none z-30"></div>
      <div className="relative w-full h-full p-[15%] bg-transparent z-10 flex items-center justify-center">
        <img 
          src={COIN_LOGOS[symbol]} 
          alt={symbol} 
          className="w-full h-full object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-500" 
        />
      </div>
    </div>
  );
};

export const NetworkBadge: React.FC<{ network: NetworkType }> = ({ network }) => (
  <span className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 text-[10px] font-bold border border-gray-200 dark:border-slate-700 shadow-sm uppercase tracking-tight">
    {network}
  </span>
);

export const ScreenHeader: React.FC<{ title: string; onBack?: () => void }> = ({ title, onBack }) => (
  <div className="flex items-center justify-between mb-8 px-1">
    <div className="flex items-center gap-4">
      {onBack && (
        <button onClick={onBack} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-gray-500 dark:text-slate-400 hover:text-crypto-accent transition-all shadow-sm active:scale-90">
          <ArrowDownLeft className="rotate-45" size={20} />
        </button>
      )}
      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h1>
    </div>
    <Logo className="text-lg" />
  </div>
);
