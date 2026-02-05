
import type { TabConfig } from './types';
import HomeIcon from './components/icons/HomeIcon';
import BulbIcon from './components/icons/BulbIcon';
import PlanIcon from './components/icons/PlanIcon';
import LedgerIcon from './components/icons/LedgerIcon';
import ListIcon from './components/icons/ListIcon';

export const TABS: TabConfig[] = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'ai-suggestions', label: 'AI Tips', icon: BulbIcon },
    { id: 'itinerary', label: 'Plan', icon: PlanIcon },
    { id: 'ledger', label: 'Ledger', icon: LedgerIcon },
    { id: 'shopping', label: 'List', icon: ListIcon },
];

export const CURRENCIES = ['USD', 'EUR', 'GBP', 'DKK', 'SEK', 'NOK', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'KRW'];
