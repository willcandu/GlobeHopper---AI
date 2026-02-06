
import React, { useState } from 'react';
import type { ShoppingItem } from '../../types';
import { SHOPPING_ESSENTIALS } from '../../constants';
import PlusIcon from '../icons/PlusIcon';
import CheckIcon from '../icons/CheckIcon';
import ShoppingBagIcon from '../icons/ShoppingBagIcon';
import TrashIcon from '../icons/TrashIcon';

interface ShoppingTabProps {
    shoppingList: ShoppingItem[];
    setShoppingList: React.Dispatch<React.SetStateAction<ShoppingItem[]>>;
}

const ShoppingTab: React.FC<ShoppingTabProps> = ({ shoppingList, setShoppingList }) => {
    const [newItem, setNewItem] = useState('');

    const handleAddItem = (name: string) => {
        if (name.trim()) {
            const item: ShoppingItem = {
                id: Math.random().toString(36).substr(2, 9),
                name: name.trim(),
                done: false
            };
            setShoppingList(prev => [item, ...prev]);
            setNewItem('');
        }
    };

    const toggleItem = (id: string) => {
        setShoppingList(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
    };

    const deleteItem = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setShoppingList(prev => prev.filter(item => item.id !== id));
    };

    return (
        <div className="animate-in fade-in duration-500 pb-24">
            <h2 className="text-xl font-bold text-stone-800 mb-6 px-1">Checklist</h2>
            
            <form onSubmit={(e) => { e.preventDefault(); handleAddItem(newItem); }} className="mb-6 flex gap-3">
                <input 
                    type="text" 
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Add item..." 
                    className="flex-1 bg-white p-4 rounded-2xl border border-stone-200 outline-none focus:ring-2 focus:ring-[#D4A373] text-sm"
                />
                <button type="submit" className="p-4 bg-stone-800 text-white rounded-2xl hover:bg-stone-900 transition-all shadow-md active:scale-95">
                    <PlusIcon className="w-5 h-5" />
                </button>
            </form>

            {/* Quick Add Suggestions */}
            <div className="mb-10">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-3 px-1">Essentials Tray</h3>
                <div className="flex flex-wrap gap-2">
                    {SHOPPING_ESSENTIALS.filter(e => !shoppingList.some(item => item.name === e)).map(essential => (
                        <button 
                            key={essential}
                            onClick={() => handleAddItem(essential)}
                            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl text-xs font-bold transition-all border border-stone-200/50"
                        >
                            + {essential}
                        </button>
                    ))}
                    {SHOPPING_ESSENTIALS.filter(e => !shoppingList.some(item => item.name === e)).length === 0 && (
                        <span className="text-[10px] text-stone-300 italic px-1">All essentials added!</span>
                    )}
                </div>
            </div>
            
            <div className="bg-white rounded-[2.5rem] overflow-hidden border border-stone-100 shadow-sm">
                {shoppingList.length > 0 ? shoppingList.map(item => (
                    <div 
                        key={item.id} 
                        onClick={() => toggleItem(item.id)} 
                        className="p-5 flex items-center justify-between border-b border-stone-50 last:border-0 cursor-pointer hover:bg-stone-50/50 transition-colors group"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${item.done ? 'bg-[#D4A373] border-[#D4A373]' : 'border-stone-200'}`}>
                                {item.done && <CheckIcon className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <span className={`text-sm font-medium transition-all ${item.done ? 'line-through text-stone-300' : 'text-stone-700'}`}>{item.name}</span>
                        </div>
                        <button 
                            onClick={(e) => deleteItem(e, item.id)}
                            className="opacity-0 group-hover:opacity-100 p-2 text-stone-300 hover:text-red-400 transition-all"
                        >
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                )) : (
                    <div className="text-center py-20 text-stone-300 flex flex-col items-center gap-3">
                        <ShoppingBagIcon className="w-10 h-10 text-stone-100"/>
                        <span className="text-sm font-medium">Your shopping list is empty.</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShoppingTab;
