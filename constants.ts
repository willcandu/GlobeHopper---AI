
import type { TabConfig, ExpenseCategory } from './types';
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

export const EXPENSE_CATEGORIES: { id: ExpenseCategory; label: string; icon: string; color: string }[] = [
    { id: 'Food', label: 'Dining', icon: '🍕', color: 'bg-orange-400' },
    { id: 'Transport', label: 'Transit', icon: '🚗', color: 'bg-blue-400' },
    { id: 'Stay', label: 'Lodging', icon: '🏨', color: 'bg-stone-800' },
    { id: 'Activities', label: 'Fun', icon: '🎡', color: 'bg-[#D4A373]' },
    { id: 'Misc', label: 'Other', icon: '🛒', color: 'bg-stone-300' },
];

export const SHOPPING_ESSENTIALS = [
    'Passport', 'Universal Adapter', 'Power Bank', 'First Aid Kit', 'Umbrella', 'Sunscreen'
];
