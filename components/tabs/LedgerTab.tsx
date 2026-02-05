
import React, { useState } from 'react';
import type { LedgerEntry } from '../../types';
import PlusIcon from '../icons/PlusIcon';
import DollarSignIcon from '../icons/DollarSignIcon';

interface LedgerTabProps {
    ledger: LedgerEntry[];
    setLedger: React.Dispatch<React.SetStateAction<LedgerEntry[]>>;
    currency: string;
}

const LedgerTab: React.FC<LedgerTabProps> = ({ ledger, setLedger, currency }) => {
    const [note, setNote] = useState('');
    const [amount, setAmount] = useState('');
    
    const totalSpend = ledger.reduce((sum, item) => sum + item.amount, 0);

    const handleAddEntry = (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);
        if (note && !isNaN(numAmount) && numAmount > 0) {
            const newEntry: LedgerEntry = {
                id: new Date().toISOString(),
                note,
                amount: numAmount,
                category: 'Misc'
            };
            setLedger(prev => [newEntry, ...prev]);
            setNote('');
            setAmount('');
        }
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-medium">Ledger</h2>
                    <p className="text-xs text-stone-500">Total Spent: <span className="text-stone-800 font-bold">{totalSpend.toFixed(2)} {currency}</span></p>
                </div>
            </div>
            
            <form onSubmit={handleAddEntry} className="mb-6 flex gap-3">
                <input 
                    type="text" 
                    value={note} 
                    onChange={(e) => setNote(e.target.value)} 
                    placeholder="Expense name" 
                    className="flex-1 bg-white p-3 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-[#D4A373] text-sm"
                />
                <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)} 
                    placeholder="Amount" 
                    className="w-28 bg-white p-3 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-[#D4A373] text-sm"
                />
                <button type="submit" className="p-3 bg-stone-800 text-white rounded-xl hover:bg-stone-900 transition-colors">
                    <PlusIcon />
                </button>
            </form>

            <div className="space-y-3">
                {ledger.length > 0 ? ledger.map(entry => (
                    <div key={entry.id} className="bg-white p-4 rounded-2xl nordic-shadow border border-stone-100 flex justify-between items-center">
                        <div>
                            <h3 className="text-sm font-medium text-stone-800">{entry.note}</h3>
                            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">{entry.category}</span>
                        </div>
                        <div className="text-stone-800 font-semibold">{entry.amount.toFixed(2)} {currency}</div>
                    </div>
                )) : (
                    <div className="text-center py-12 text-stone-400 flex flex-col items-center gap-3">
                       <DollarSignIcon className="w-8 h-8 text-stone-300" />
                       <span>No expenses logged yet.</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LedgerTab;
