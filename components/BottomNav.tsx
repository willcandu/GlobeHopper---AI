
import React from 'react';
import type { Tab, TabConfig } from '../types';

interface BottomNavProps {
    tabs: TabConfig[];
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ tabs, activeTab, setActiveTab }) => {
    return (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-[calc(24rem-3rem)] h-20 bg-stone-800/95 backdrop-blur-md rounded-[2.5rem] nordic-shadow border border-white/10 flex items-center justify-around px-2 z-50">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300 ${
                        activeTab === tab.id ? 'bg-[#D4A373] text-white shadow-lg' : 'text-stone-400'
                    }`}
                >
                    <tab.icon className="w-5 h-5" />
                    <span className="text-[8px] mt-1 uppercase font-bold tracking-tighter">{tab.label}</span>
                </button>
            ))}
        </nav>
    );
};

export default BottomNav;
