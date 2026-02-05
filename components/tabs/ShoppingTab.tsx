
import React, { useState } from 'react';
import type { ShoppingItem } from '../../types';
import PlusIcon from '../icons/PlusIcon';
import CheckIcon from '../icons/CheckIcon';
import ShoppingBagIcon from '../icons/ShoppingBagIcon';

interface ShoppingTabProps {
    shoppingList: ShoppingItem[];
    setShoppingList: React.Dispatch<React.SetStateAction<ShoppingItem[]>>;
}

const ShoppingTab: React.FC<ShoppingTabProps> = ({ shoppingList, setShoppingList }) => {
    const [newItem, setNewItem] = useState('');

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (newItem.trim()) {
            const item: ShoppingItem = {
                id: new Date().toISOString(),
                name: newItem.trim(),
                done: false
            };
            setShoppingList(prev => [item, ...prev]);
            setNewItem('');
        }
    };

    const toggleItem = (id: string) => {
        setShoppingList(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
    };

    return (
        <div className="animate-in fade-in duration-500">
            <h2 className="text-xl font-medium mb-6">Shopping List</h2>
            
            <form onSubmit={handleAddItem} className="mb-6 flex gap-3">
                <input 
                    type="text" 
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Add an item..." 
                    className="flex-1 bg-white p-3 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-[#D4A373] text-sm"
                />
                <button type="submit" className="p-3 bg-stone-800 text-white rounded-xl hover:bg-stone-900 transition-colors">
                    <PlusIcon />
                </button>
            </form>
            
            <div className="bg-white rounded-3xl overflow-hidden border border-stone-100 nordic-shadow">
                {shoppingList.length > 0 ? shoppingList.map(item => (
                    <div key={item.id} onClick={() => toggleItem(item.id)} className="p-4 flex items-center gap-4 border-b border-stone-100 last:border-0 cursor-pointer hover:bg-stone-50 transition-colors">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${item.done ? 'bg-stone-800 border-stone-800' : 'border-stone-300'}`}>
                            {item.done && <CheckIcon className="w-3 h-3 text-white" />}
                        </div>
                        <span className={`text-sm transition-all ${item.done ? 'line-through text-stone-400' : 'text-stone-700'}`}>{item.name}</span>
                    </div>
                )) : (
                    <div className="text-center py-12 text-stone-400 flex flex-col items-center gap-3">
                        <ShoppingBagIcon className="w-8 h-8 text-stone-300"/>
                        <span>Your shopping list is empty.</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShoppingTab;
