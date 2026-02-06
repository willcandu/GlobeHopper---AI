
import type { ElementType } from 'react';

export type Tab = 'home' | 'ai-suggestions' | 'itinerary' | 'ledger' | 'shopping';

export type ExpenseCategory = 'Food' | 'Transport' | 'Stay' | 'Activities' | 'Misc';

export interface TabConfig {
    id: Tab;
    label: string;
    icon: ElementType;
}

export interface TripDetails {
    origin: string;
    destinations: { name: string }[];
    startDate: string;
    endDate: string;
    destCurrency: string;
    homeCurrency: string;
}

export interface ItineraryItem {
    date: string;
    time: string;
    activity: string;
    location: string;
    lat: number;
    lon: number;
    mapLink?: string;
}

export interface Accommodation {
    name: string;
    lat: number;
    lon: number;
}

export interface LedgerEntry {
    id: string;
    note: string;
    amount: number;
    category: ExpenseCategory;
}

export interface ShoppingItem {
    id: string;
    name: string;
    done: boolean;
}
