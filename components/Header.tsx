
import React, { useState, useEffect } from 'react';
import type { Tab, TripDetails } from '../types';

interface HeaderProps {
    activeTab: Tab;
    tripDetails: TripDetails;
}

const Header: React.FC<HeaderProps> = ({ activeTab, tripDetails }) => {
    const [rate, setRate] = useState<number | null>(null);

    useEffect(() => {
        const fetchRate = async () => {
            if (tripDetails.homeCurrency === tripDetails.destCurrency) {
                setRate(1);
                return;
            }
            try {
                const res = await fetch(`https://api.frankfurter.app/latest?amount=1&from=${tripDetails.destCurrency}&to=${tripDetails.homeCurrency}`);
                const data = await res.json();
                setRate(data.rates[tripDetails.homeCurrency]);
            } catch (e) {
                console.error("FX fetch error", e);
                setRate(null);
            }
        };

        fetchRate();
    }, [tripDetails.homeCurrency, tripDetails.destCurrency]);

    const destinationDisplay = tripDetails.destinations.map(d => d.name).filter(Boolean).join(' & ');

    const renderTitle = () => {
        switch (activeTab) {
            case 'home':
                return (
                    <div>
                        <h1 className="text-xl font-bold text-stone-800 italic">GlobeHopper</h1>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400">Trip Settings</p>
                    </div>
                );
            case 'ai-suggestions':
                 return (
                    <div>
                        <h1 className="text-xl font-light text-stone-800 italic">AI <span className="font-medium not-italic">Suggestions</span></h1>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#D4A373]">Curated Guide</p>
                    </div>
                );
            default:
                return (
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-stone-400 font-semibold mb-1 truncate max-w-[150px]">
                            {tripDetails.origin} <span className="text-[#D4A373]">&rarr;</span> {destinationDisplay}
                        </p>
                        <h1 className="text-xl font-light text-stone-800 italic">Hej, <span className="font-medium not-italic">Traveler</span></h1>
                    </div>
                );
        }
    };

    return (
        <header className="p-6 pt-10 flex justify-between items-start sticky top-0 bg-[#FDFBF7]/95 backdrop-blur z-40">
            {renderTitle()}
            {rate !== null && (
                 <div className="bg-white border border-stone-200 rounded-xl px-3 py-2 shadow-sm text-right min-w-[100px]">
                    <p className="text-[10px] font-bold text-[#D4A373] uppercase tracking-wider flex justify-end items-center gap-1">
                        Live FX 
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                    </p>
                    <p className="text-xs font-semibold text-stone-800 mt-0.5">1 {tripDetails.destCurrency} ≈ {rate.toFixed(2)} {tripDetails.homeCurrency}</p>
                </div>
            )}
        </header>
    );
};

export default Header;
