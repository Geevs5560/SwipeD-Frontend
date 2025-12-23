
export enum NetworkType {
  ERC20 = 'ERC-20',
  BEP20 = 'BE-20',
  TRC20 = 'TRC-20'
}

export enum CoinSymbol {
  USDT = 'USDT',
  ETH = 'ETH',
  BNB = 'BNB',
  TRX = 'TRX'
}

export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  telegram?: string;
}

export interface User extends ContactInfo {
  id: string;
  type: 'PERSONAL' | 'BUSINESS';
  isVerified: boolean;
  avatarUrl: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
  kycStatus: 'NOT_STARTED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
  balanceUsdt: number;
}

export type ViewState = 
  | 'AUTH' 
  | 'OWNER_AUTH'
  | 'HOME' 
  | 'SEND' 
  | 'RECEIVE' 
  | 'ESCROW' 
  | 'OWNER' 
  | 'OWNER_USERS'
  | 'OWNER_KYC_AUTH'
  | 'OWNER_PROFIT'
  | 'OWNER_LOGS'
  | 'TRANSACTIONS' 
  | 'GAS_DEPOSITS' 
  | 'KYC' 
  | 'STATEMENTS' 
  | 'PROFILE' 
  | 'SAVINGS_ACCOUNT';

export type EscrowStatus = 'DRAFT' | 'ACTIVE' | 'PENDING' | 'COMPLETED' | 'ROLLBACK' | 'REWORK_REQUIRED';

export interface EscrowCondition {
  id: string;
  description: string;
  verifierType: 'SELF' | 'RECIPIENT' | 'THIRD_PARTY';
  verifierId?: string;
  verifierName?: string;
  verifierContact?: ContactInfo;
  instructions: string;
  requireDocument: boolean;
  proofUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'DISAGREED' | 'REWORK';
  comment?: string;
}

export interface EscrowContract {
  id: string;
  senderId: string;
  senderContact: ContactInfo;
  mode: 'DIRECT' | 'CHAIN';
  network: NetworkType;
  recipientId: string;
  recipientContact: ContactInfo;
  amount: number;
  coin: CoinSymbol;
  conditions: EscrowCondition[];
  disbursementMode: 'AUTO' | 'MANUAL';
  deadline: string; 
  status: EscrowStatus;
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: 'SEND' | 'RECEIVE' | 'DEPOSIT';
  amount: number;
  coin: CoinSymbol;
  network: NetworkType;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  date: string;
  sender?: string;
  receiver?: string;
  hash?: string;
}

export interface GasDeposit {
  id: string;
  coin: CoinSymbol;
  network: NetworkType;
  amount: number;
  initialAmount: number;
  consumedAmount: number;
  maturityDate: string;
  createdAt: string;
}

export interface GasRevenue {
  id: string;
  sourceCoin: CoinSymbol;
  consumedQty: number;
  marketRate: number;
  profitMarkup: number;
  totalUsdtEarned: number;
  timestamp: string;
}

export type DepositActivityType = 'DEPOSIT' | 'CONSUMPTION' | 'REVENUE_CREDIT' | 'REDEEM';

export interface DepositActivity {
  id: string;
  type: DepositActivityType;
  coin: CoinSymbol;
  amount: number;
  timestamp: string;
  sourceCoin?: CoinSymbol;
  marketRate?: number;
  exchangeRate?: number;
  profit?: number;
  balanceAfter?: number;
}

export interface WalletCardProps {
  type: 'SAVINGS' | 'PERSONAL' | 'GAS';
  title: string;
  networks: Partial<Record<NetworkType, CoinSymbol[]>>;
}
