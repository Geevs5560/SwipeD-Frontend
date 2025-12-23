
import { CoinSymbol, NetworkType, Transaction, GasDeposit, GasRevenue, DepositActivity, User } from './types';

export const COIN_LOGOS: Record<CoinSymbol, string> = {
  [CoinSymbol.USDT]: 'https://cryptologos.cc/logos/tether-usdt-logo.png?v=029',
  [CoinSymbol.ETH]: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=029',
  [CoinSymbol.BNB]: 'https://cryptologos.cc/logos/bnb-bnb-logo.png?v=029',
  [CoinSymbol.TRX]: 'https://cryptologos.cc/logos/tron-trx-logo.png?v=029',
};

export const AVAILABLE_NETWORKS = [
  NetworkType.ERC20,
  NetworkType.BEP20,
  NetworkType.TRC20
];

export const COINS_BY_NETWORK: Record<NetworkType, CoinSymbol[]> = {
  [NetworkType.ERC20]: [CoinSymbol.USDT, CoinSymbol.ETH],
  [NetworkType.BEP20]: [CoinSymbol.USDT, CoinSymbol.BNB],
  [NetworkType.TRC20]: [CoinSymbol.USDT, CoinSymbol.TRX],
};

// Mock user for initial state if needed
// Fixed missing properties for User type
export const MOCK_USER: User = {
  id: 'U-88293',
  name: 'Alex Crypto',
  email: 'alex@swiped.io',
  phone: '+1 555-0199',
  telegram: '@alexcrypto',
  type: 'PERSONAL',
  isVerified: true,
  avatarUrl: 'https://i.pravatar.cc/150?u=swipeD',
  status: 'ACTIVE',
  kycStatus: 'VERIFIED',
  balanceUsdt: 12500
};

export const MOCK_GAS_DEPOSITS: GasDeposit[] = [
  {
    id: 'GD-002',
    coin: CoinSymbol.ETH,
    network: NetworkType.ERC20,
    amount: 0.5,
    initialAmount: 0.5,
    consumedAmount: 0.1,
    maturityDate: '2024-05-15T00:00:00',
    createdAt: '2023-10-25T00:00:00'
  },
  {
    id: 'GD-003',
    coin: CoinSymbol.BNB,
    network: NetworkType.BEP20,
    amount: 5,
    initialAmount: 5,
    consumedAmount: 4.8,
    maturityDate: '2023-10-10T00:00:00', // Matured
    createdAt: '2023-09-10T00:00:00'
  }
];

export const MOCK_GAS_REVENUE: GasRevenue[] = [
  {
    id: 'REV-001',
    sourceCoin: CoinSymbol.ETH,
    consumedQty: 0.05,
    marketRate: 2450.50,
    profitMarkup: 12.25,
    totalUsdtEarned: 134.77,
    timestamp: '2023-10-26T14:30:00'
  },
  {
    id: 'REV-002',
    sourceCoin: CoinSymbol.BNB,
    consumedQty: 1.2,
    marketRate: 310.20,
    profitMarkup: 5.40,
    totalUsdtEarned: 377.64,
    timestamp: '2023-10-25T09:15:00'
  }
];

export const MOCK_DEPOSIT_ACTIVITIES: DepositActivity[] = [
  {
    id: 'DA-001',
    type: 'DEPOSIT',
    coin: CoinSymbol.ETH,
    amount: 0.5,
    timestamp: '2023-10-25T10:00:00'
  },
  {
    id: 'DA-002',
    type: 'CONSUMPTION',
    coin: CoinSymbol.ETH,
    amount: 0.05,
    marketRate: 2450.50,
    exchangeRate: 2465.20,
    profit: 12.25,
    timestamp: '2023-10-26T14:30:00'
  },
  {
    id: 'DA-003',
    type: 'REVENUE_CREDIT',
    coin: CoinSymbol.USDT,
    amount: 134.77,
    sourceCoin: CoinSymbol.ETH,
    marketRate: 2450.50,
    exchangeRate: 2465.20,
    profit: 12.25,
    timestamp: '2023-10-26T14:30:00'
  },
  {
    id: 'DA-004',
    type: 'REDEEM',
    coin: CoinSymbol.USDT,
    amount: 50.00,
    balanceAfter: 84.77,
    timestamp: '2023-10-27T11:00:00'
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'TX-99281',
    type: 'SEND',
    amount: 120.50,
    coin: CoinSymbol.USDT,
    network: NetworkType.TRC20,
    status: 'COMPLETED',
    date: '2023-10-25T14:30:00',
    sender: '0x71C...8976F',
    receiver: '0x33A...B221C',
    hash: '0x8f2d...33a1'
  },
  {
    id: 'TX-99282',
    type: 'RECEIVE',
    amount: 0.5,
    coin: CoinSymbol.ETH,
    network: NetworkType.ERC20,
    status: 'COMPLETED',
    date: '2023-10-24T09:15:00',
    sender: '0x12B...C445D',
    receiver: '0x71C...8976F',
    hash: '0x9a1b...22c3'
  },
  {
    id: 'TX-99283',
    type: 'DEPOSIT',
    amount: 50.00,
    coin: CoinSymbol.USDT,
    network: NetworkType.BEP20,
    status: 'PENDING',
    date: '2023-10-26T10:00:00',
    sender: 'Bank Transfer',
    receiver: '0x71C...8976F',
    hash: '0x7e3f...11d2'
  },
  {
    id: 'TX-99284',
    type: 'SEND',
    amount: 100.00,
    coin: CoinSymbol.BNB,
    network: NetworkType.BEP20,
    status: 'FAILED',
    date: '2023-10-20T18:45:00',
    sender: '0x71C...8976F',
    receiver: '0x99Z...X112A',
    hash: '0x6c4d...88e5'
  },
  {
    id: 'TX-99285',
    type: 'RECEIVE',
    amount: 500.00,
    coin: CoinSymbol.USDT,
    network: NetworkType.TRC20,
    status: 'COMPLETED',
    date: '2023-10-26T11:20:00',
    sender: '0x55Q...W331B',
    receiver: '0x71C...8976F',
    hash: '0x1b2a...99f0'
  }
];
