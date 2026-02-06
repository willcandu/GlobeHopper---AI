
import React, { useState } from 'react';
import type { LedgerEntry, ExpenseCategory } from '../../types';
import { EXPENSE_CATEGORIES } from '../../constants';
import PlusIcon from '../icons/PlusIcon';
import DollarSignIcon from '../icons/DollarSignIcon';
import TrashIcon from '../icons/TrashIcon';

interface LedgerTabProps {
    ledger: LedgerEntry[];
    setLedger: React.Dispatch<React.SetStateAction<LedgerEntry[]>>;
    currency: string;
}

const LedgerTab: React.FC<LedgerTabProps> = ({ ledger, setLedger, currency }) => {
    const [note, setNote] = useState('');
    const [amount, setAmount] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory>('Misc');
    
    const totalSpend = ledger.reduce((sum, item) => sum + item.amount, 0);

    const categoryTotals = EXPENSE_CATEGORIES.map(cat => ({
        ...cat,
        total: ledger.filter(item => item.category === cat.id).reduce((sum, item) => sum + item.amount, 0)
    }));

    const handleAddEntry = (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);
        if (note && !isNaN(numAmount) && numAmount > 0) {
            const newEntry: LedgerEntry = {
                id: Math.random().toString(36).substr(2, 9),
                note,
                amount: numAmount,
                category: selectedCategory
            };
            setLedger(prev => [newEntry, ...prev]);
            setNote('');
            setAmount('');
        }
    };

    const removeEntry = (id: string) => {
        setLedger(prev => prev.filter(entry => entry.id !== id));
    };

    return (
        <div className="animate-in fade-in duration-500 pb-24">
            {/* Spending Summary Card */}
            <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-stone-100 mb-8">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Total Expenditure</span>
                        <h2 className="text-3xl font-black text-stone-800">{totalSpend.toFixed(2)} <span className="text-sm font-bold text-[#D4A373]">{currency}</span></h2>
                    </div>
                    <div className="bg-stone-50 px-3 py-1.5 rounded-full text-[10px] font-bold text-stone-400 uppercase tracking-tighter border border-stone-100">
                        {ledger.length} Transactions
                    </div>
                </div>

                {/* Distribution Bar */}
                <div className="h-3 w-full bg-stone-50 rounded-full flex overflow-hidden mb-6">
                    {categoryTotals.map(cat => (
                        totalSpend > 0 && cat.total > 0 && (
                            <div 
                                key={cat.id} 
                                className={`${cat.color} h-full transition-all duration-1000`} 
                                style={{ width: `${(cat.total / totalSpend) * 100}%` }}
                                title={`${cat.label}: ${cat.total}`}
                            />
                        )
                    ))}
                </div>

                {/* Category Grid */}
                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                    {categoryTotals.map(cat => (
                        <div key={cat.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${cat.color}`}></div>
                                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-tight">{cat.label}</span>
                            </div>
                            <span className="text-xs font-black text-stone-800">{cat.total > 0 ? cat.total.toFixed(0) : '0'}</span>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Quick Add Form */}
            <form onSubmit={handleAddEntry} className="mb-8 space-y-3">
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={note} 
                        onChange={(e) => setNote(e.target.value)} 
                        placeholder="Expense details..." 
                        className="flex-1 bg-white p-4 rounded-2xl border border-stone-200 outline-none focus:ring-2 focus:ring-[#D4A373] text-sm"
                    />
                    <div className="w-24 relative">
                        <input 
                            type="number" 
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)} 
                            placeholder="0.00" 
                            className="w-full bg-white p-4 rounded-2xl border border-stone-200 outline-none focus:ring-2 focus:ring-[#D4A373] text-sm font-bold"
                        />
                    </div>
                </div>
                
                <div className="flex gap-2 items-center">
                    <div className="flex-1 flex gap-1 bg-stone-100 p-1.5 rounded-2xl overflow-x-auto hide-scrollbar">
                        {EXPENSE_CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all whitespace-nowrap ${
                                    selectedCategory === cat.id 
                                    ? 'bg-stone-800 text-white shadow-md' 
                                    : 'text-stone-400 hover:text-stone-600'
                                }`}
                            >
                                {cat.icon} {cat.label}
                            </button>
                        ))}
                    </div>
                    <button type="submit" className="p-4 bg-[#D4A373] text-white rounded-2xl hover:bg-[#c39262] transition-all shadow-md active:scale-95">
                        <PlusIcon className="w-5 h-5" />
                    </button>
                </div>
            </form>

            <div className="space-y-3">
                {ledger.length > 0 ? ledger.map(entry => {
                    const catInfo = EXPENSE_CATEGORIES.find(c => c.id === entry.category);
                    return (
                        <div key={entry.id} className="bg-white p-5 rounded-[2rem] shadow-sm border border-stone-100 flex justify-between items-center group animate-in slide-in-from-bottom-2">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg ${catInfo?.color?.replace('bg-', 'bg-opacity-10 text-') || 'bg-stone-50'}`}>
                                    {catInfo?.icon}
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-sm font-bold text-stone-700">{entry.note}</h3>
                                    <span className="text-[9px] uppercase tracking-widest text-stone-300 font-black mt-0.5">{entry.category}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-sm font-black text-stone-800">{entry.amount.toFixed(2)} <span className="text-[10px] text-stone-400">{currency}</span></div>
                                <button 
                                    onClick={() => removeEntry(entry.id)}
                                    className="p-2 text-stone-200 hover:text-red-400 transition-colors"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="text-center py-20 bg-stone-50/50 rounded-[3rem] border-2 border-dashed border-stone-100 flex flex-col items-center gap-3">
                       <DollarSignIcon className="w-10 h-10 text-stone-200" />
                       <span className="text-sm text-stone-400 font-medium">No expenses logged yet.</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LedgerTab;
