
import React, { useState, useEffect } from 'react';
import { ViewState, User } from './types';
import { AuthScreen, OwnerAuthScreen } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { SendFlow, ReceiveFlow } from './components/Operations';
import { EscrowFlow } from './components/Escrow';
import { OwnerDashboard, OwnerUsersPage, OwnerKycAuthPage, OwnerProfitPage, OwnerLogsPage } from './components/Owner';
import { HistoryScreen } from './components/History';
import { GasManagementScreen } from './components/GasManagement';
import { KYCScreen } from './components/KYC';
import { ProfileScreen } from './components/Profile';
import { StatementsScreen } from './components/Statements';
import { SavingsAccountScreen } from './components/SavingsAccount';
import { Logo, ScreenHeader, Card } from './components/Shared';
import { Home, ArrowLeftRight, ShieldCheck, User as UserIcon, RefreshCw, FileText, ShieldAlert, LayoutDashboard, Users, BarChart3 } from 'lucide-react';

const THEME_COLORS = [
  { name: 'Emerald', value: '#10B981', glow: 'rgba(16, 185, 129, 0.3)' },
  { name: 'Sapphire', value: '#3B82F6', glow: 'rgba(59, 130, 246, 0.3)' },
  { name: 'Amethyst', value: '#8B5CF6', glow: 'rgba(139, 92, 246, 0.3)' },
  { name: 'Gold', value: '#F59E0B', glow: 'rgba(245, 158, 11, 0.3)' },
  { name: 'Ruby', value: '#EF4444', glow: 'rgba(239, 68, 68, 0.3)' },
];

const TRANSITION_CHARS = [
  { char: 'S', delay: '0.0s' },
  { char: 'w', delay: '0.1s' },
  { char: 'i', delay: '0.2s' },
  { char: 'p', delay: '0.3s' },
  { char: 'e', delay: '0.4s' },
  { char: 'D', delay: '0.5s', special: 'text-crypto-accent drop-shadow-[0_0_15px_var(--accent-glow)]' },
];

export default function App() {
  const [view, setView] = useState<ViewState>('AUTH');
  const [user, setUser] = useState<User | null>(null);
  const [navParams, setNavParams] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [themeColor, setThemeColor] = useState(THEME_COLORS[0]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', themeColor.value);
    document.documentElement.style.setProperty('--accent-glow', themeColor.glow);
  }, [themeColor]);

  const toggleTheme = () => setDarkMode(!darkMode);
  const cycleThemeColor = () => {
    const currentIndex = THEME_COLORS.findIndex(c => c.value === themeColor.value);
    const nextIndex = (currentIndex + 1) % THEME_COLORS.length;
    setThemeColor(THEME_COLORS[nextIndex]);
  };

  const handleLogin = (loggedInUser: User) => {
    triggerTransition('HOME', null);
    setUser(loggedInUser);
  };

  const triggerTransition = (targetView: ViewState, params: any = null) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setView(targetView);
      setNavParams(params);
    }, 1200); 
    setTimeout(() => {
      setIsTransitioning(false);
    }, 2000);
  };

  const handleNavigate = (targetView: string, params?: any) => {
    triggerTransition(targetView as ViewState, params);
  };

  const renderContent = () => {
    switch (view) {
      case 'AUTH': return <AuthScreen onLogin={handleLogin} onOwnerLogin={() => triggerTransition('OWNER_AUTH')} />;
      case 'OWNER_AUTH': return <OwnerAuthScreen onAuth={() => triggerTransition('OWNER')} onBack={() => triggerTransition('AUTH')} />;
      case 'HOME': return <Dashboard onNavigate={handleNavigate} user={user} toggleTheme={toggleTheme} isDarkMode={darkMode} cycleThemeColor={cycleThemeColor} themeColor={themeColor.value} />;
      case 'SEND': return <SendFlow initialParams={navParams} onComplete={() => triggerTransition('HOME')} onBack={() => triggerTransition('HOME')} />;
      case 'RECEIVE': return <ReceiveFlow initialParams={navParams} onComplete={() => triggerTransition('HOME')} onBack={() => triggerTransition('HOME')} />;
      case 'ESCROW': return <EscrowFlow onBack={() => triggerTransition('HOME')} />;
      case 'TRANSACTIONS': return <HistoryScreen onBack={() => triggerTransition('HOME')} />;
      case 'GAS_DEPOSITS': return <GasManagementScreen initialParams={navParams} onBack={() => triggerTransition('HOME')} />;
      case 'OWNER': return <OwnerDashboard onBack={() => triggerTransition('AUTH')} onNavigateSub={(v) => triggerTransition(v as ViewState)} />;
      case 'OWNER_USERS': return <OwnerUsersPage onBack={() => triggerTransition('OWNER')} />;
      case 'OWNER_KYC_AUTH': return <OwnerKycAuthPage onBack={() => triggerTransition('OWNER')} />;
      case 'OWNER_PROFIT': return <OwnerProfitPage onBack={() => triggerTransition('OWNER')} />;
      case 'OWNER_LOGS': return <OwnerLogsPage onBack={() => triggerTransition('OWNER')} />;
      case 'KYC': return <KYCScreen onBack={() => triggerTransition('HOME')} />;
      case 'STATEMENTS': return <StatementsScreen onBack={() => triggerTransition('HOME')} />;
      case 'PROFILE': return <ProfileScreen onBack={() => triggerTransition('HOME')} />;
      case 'SAVINGS_ACCOUNT': return <SavingsAccountScreen initialParams={navParams} onBack={() => triggerTransition('HOME')} />;
      default: return <Dashboard onNavigate={handleNavigate} user={user} toggleTheme={toggleTheme} isDarkMode={darkMode} cycleThemeColor={cycleThemeColor} themeColor={themeColor.value} />;
    }
  };

  const isOwnerView = view.startsWith('OWNER');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-crypto-dark dark:text-white font-sans selection:bg-crypto-accent selection:text-black transition-colors duration-300 relative">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-40 dark:opacity-60">
        <div className="absolute inset-0 premium-3d-grid animate-grid-flow"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-gray-50 dark:from-crypto-dark dark:via-transparent dark:to-crypto-dark"></div>
      </div>
      <div className={`max-w-md mx-auto min-h-screen ${isOwnerView ? 'bg-black/90' : 'bg-white/80 dark:bg-slate-950/80'} backdrop-blur-xl shadow-2xl relative transition-colors duration-300 z-10 border-x border-gray-100 dark:border-slate-900 overflow-hidden flex flex-col`}>
        <div className={`absolute inset-0 z-[500] flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${isTransitioning ? 'opacity-100 pointer-events-auto backdrop-blur-3xl' : 'opacity-0 pointer-events-none backdrop-blur-0 blur-3xl'}`}>
          <div className="absolute inset-0 bg-white/40 dark:bg-black/60"></div>
          <div className={`relative z-10 flex flex-col items-center gap-6 w-full px-8 transition-all duration-700 ${isTransitioning ? 'scale-100 opacity-100 blur-none' : 'scale-110 opacity-0 blur-2xl'}`}>
            <div className="flex items-center justify-center gap-1.5 sm:gap-2">
              {TRANSITION_CHARS.map((t, i) => (
                <div key={i} className={`text-6xl sm:text-7xl font-black animate-dance tracking-tighter ${t.special || 'text-gray-900 dark:text-white'}`} style={{ animationDelay: t.delay }}>
                  {t.char}
                </div>
              ))}
            </div>
            <div className="w-full max-w-xs space-y-4 text-center">
                <div className="relative h-0.5 w-full bg-gray-900/5 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className={`absolute top-0 left-0 h-full bg-crypto-accent transition-all duration-[1200ms] ease-linear ${isTransitioning ? 'w-full' : 'w-0'}`}></div>
                </div>
                <div className="flex items-center justify-center gap-2">
                   <RefreshCw className="text-crypto-accent animate-spin" size={14} />
                   <span className="text-[10px] font-bold text-crypto-accent tracking-widest uppercase">
                     {isOwnerView ? 'Root Synchronization' : 'Syncing Protocol'}
                   </span>
                </div>
            </div>
          </div>
        </div>
        <main className={`flex-1 p-4 relative z-10 transition-all duration-700 ${isTransitioning ? 'opacity-0 blur-2xl scale-95' : 'opacity-100 blur-none scale-100'}`}>
          {renderContent()}
        </main>
        {view !== 'AUTH' && view !== 'OWNER_AUTH' && (
          <div className={`shrink-0 ${isOwnerView ? 'bg-black/95' : 'bg-white/95 dark:bg-slate-900/95'} backdrop-blur-md border-t border-gray-200 dark:border-slate-800 p-4 z-50 transition-all duration-500 ${isTransitioning ? 'opacity-0 blur-md' : 'opacity-100 blur-none'}`}>
            <div className="flex justify-around items-center">
              {isOwnerView ? (
                 <>
                   <NavButton icon={LayoutDashboard} label="Root" active={view === 'OWNER'} onClick={() => handleNavigate('OWNER')} />
                   <NavButton icon={Users} label="Users" active={view === 'OWNER_USERS'} onClick={() => handleNavigate('OWNER_USERS')} />
                   <NavButton icon={ShieldCheck} label="KYC" active={view === 'OWNER_KYC_AUTH'} onClick={() => handleNavigate('OWNER_KYC_AUTH')} />
                   <NavButton icon={BarChart3} label="Profit" active={view === 'OWNER_PROFIT'} onClick={() => handleNavigate('OWNER_PROFIT')} />
                 </>
              ) : (
                <>
                  <NavButton icon={Home} label="Home" active={view === 'HOME'} onClick={() => handleNavigate('HOME')} />
                  <NavButton icon={ArrowLeftRight} label="Transact" active={view === 'SEND' || view === 'RECEIVE'} onClick={() => handleNavigate('SEND')} />
                  <NavButton icon={ShieldCheck} label="Escrow" active={view === 'ESCROW'} onClick={() => handleNavigate('ESCROW')} />
                  <NavButton icon={UserIcon} label="Profile" active={view === 'PROFILE'} onClick={() => handleNavigate('PROFILE')} />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const NavButton: React.FC<{ icon: any, label: string, active: boolean, onClick: () => void }> = ({ icon: Icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-crypto-accent' : 'text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300'}`}>
    <Icon size={24} />
    <span className="text-[10px] font-bold">{label}</span>
  </button>
);
