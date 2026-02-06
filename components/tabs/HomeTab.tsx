
import React, { useState, useEffect } from 'react';
import type { TripDetails } from '../../types';
import { CURRENCIES } from '../../constants';
import PlusCircleIcon from '../icons/PlusCircleIcon';
import TrashIcon from '../icons/TrashIcon';
import SparklesIcon from '../icons/SparklesIcon';
import SpinnerIcon from '../icons/SpinnerIcon';
import MapPinIcon from '../icons/MapPinIcon';
import CheckIcon from '../icons/CheckIcon';

interface HomeTabProps {
    tripDetails: TripDetails;
    setTripDetails: React.Dispatch<React.SetStateAction<TripDetails>>;
    userNotes: string;
    setUserNotes: React.Dispatch<React.SetStateAction<string>>;
    onGenerate: () => void;
    isLoading: boolean;
    isApiKeySet: boolean;
    onConnectKey: () => void;
}

const LOADING_MESSAGES = [
    "Scouting the best local spots...",
    "Consulting the travel gods...",
    "Finding hidden gems...",
    "Optimizing your route...",
    "Checking for the best views...",
    "Packing your virtual bags..."
];

const HomeTab: React.FC<HomeTabProps> = ({ 
    tripDetails, 
    setTripDetails, 
    userNotes, 
    setUserNotes, 
    onGenerate, 
    isLoading,
    isApiKeySet,
    onConnectKey
}) => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        let interval: number;
        if (isLoading) {
            interval = window.setInterval(() => {
                setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
            }, 2500);
        }
        return () => clearInterval(interval);
    }, [isLoading]);
    
    const handleDetailChange = <K extends keyof TripDetails>(key: K, value: TripDetails[K]) => {
        setTripDetails(prev => ({ ...prev, [key]: value }));
    };

    const handleDestinationChange = (index: number, name: string) => {
        const newDestinations = [...tripDetails.destinations];
        newDestinations[index] = { name };
        handleDetailChange('destinations', newDestinations);
    };

    const addDestination = () => {
        if (tripDetails.destinations.length < 5) {
            handleDetailChange('destinations', [...tripDetails.destinations, { name: '' }]);
        }
    };

    const removeDestination = (index: number) => {
        if (tripDetails.destinations.length > 1) {
            const newDestinations = tripDetails.destinations.filter((_, i) => i !== index);
            handleDetailChange('destinations', newDestinations);
        }
    };

    const destinationDisplay = tripDetails.destinations.map(d => d.name).filter(Boolean).join(' & ');

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* API Status Card */}
            <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-sm flex items-center justify-between group">
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${isApiKeySet ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                        {isApiKeySet ? <CheckIcon className="w-5 h-5" /> : <SparklesIcon className="w-5 h-5" />}
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-stone-800">Gemini AI Session</h4>
                        <p className="text-[10px] uppercase font-black tracking-widest text-stone-400">
                            {isApiKeySet ? 'Connected & Ready' : 'Key Required'}
                        </p>
                    </div>
                </div>
                <button 
                    onClick={onConnectKey}
                    className="text-[10px] font-black uppercase tracking-widest text-[#D4A373] hover:underline px-3 py-2"
                >
                    {isApiKeySet ? 'Update Key' : 'Connect'}
                </button>
            </div>

            {/* Status Card */}
            {destinationDisplay && !isLoading && (
                <div className="bg-gradient-to-br from-stone-800 to-stone-900 text-white p-6 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                    <div className="absolute right-[-5%] top-[-10%] opacity-10 group-hover:scale-110 transition-transform duration-1000">
                        <MapPinIcon className="w-40 h-40" />
                    </div>
                    <div className="relative z-10">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4A373]">Active Plan</span>
                        <h2 className="text-2xl font-bold mt-1 leading-tight">{destinationDisplay}</h2>
                        <div className="flex items-center gap-4 mt-4">
                            <div className="flex flex-col">
                                <span className="text-[9px] uppercase text-stone-400 font-bold">Start</span>
                                <span className="text-xs font-medium">{tripDetails.startDate}</span>
                            </div>
                            <div className="w-px h-6 bg-white/10"></div>
                            <div className="flex flex-col">
                                <span className="text-[9px] uppercase text-stone-400 font-bold">End</span>
                                <span className="text-xs font-medium">{tripDetails.endDate}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Route & Dates Section */}
            <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Route & Timeline</label>
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                            <span className="absolute left-4 top-2 text-[8px] font-bold text-stone-400 uppercase">Check In</span>
                            <input value={tripDetails.startDate} onChange={(e) => handleDetailChange('startDate', e.target.value)} type="date" className="w-full bg-white pt-6 pb-3 px-4 rounded-2xl border border-stone-200 outline-none focus:ring-2 focus:ring-[#D4A373] text-sm text-stone-800 font-medium"/>
                        </div>
                        <div className="relative">
                            <span className="absolute left-4 top-2 text-[8px] font-bold text-stone-400 uppercase">Check Out</span>
                            <input value={tripDetails.endDate} onChange={(e) => handleDetailChange('endDate', e.target.value)} type="date" className="w-full bg-white pt-6 pb-3 px-4 rounded-2xl border border-stone-200 outline-none focus:ring-2 focus:ring-[#D4A373] text-sm text-stone-800 font-medium"/>
                        </div>
                    </div>
                    
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-stone-300 uppercase">From</span>
                        <input value={tripDetails.origin} onChange={(e) => handleDetailChange('origin', e.target.value)} type="text" placeholder="Origin City" className="w-full bg-white pl-16 pr-4 py-5 rounded-2xl border border-stone-200 outline-none focus:ring-2 focus:ring-[#D4A373] text-sm font-medium"/>
                    </div>
                    
                    {tripDetails.destinations.map((dest, index) => (
                        <div key={index} className="relative flex gap-2 animate-in slide-in-from-left duration-300">
                            <div className="relative flex-1">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#D4A373] uppercase">To</span>
                                <input value={dest.name} onChange={(e) => handleDestinationChange(index, e.target.value)} type="text" placeholder="Destination City" className="w-full bg-white pl-12 pr-4 py-5 rounded-2xl border border-stone-200 outline-none focus:ring-2 focus:ring-[#D4A373] text-sm font-medium"/>
                            </div>
                            <button onClick={() => removeDestination(index)} className="px-4 text-stone-300 hover:text-red-500 transition-colors bg-white rounded-2xl border border-stone-200">
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                    <button onClick={addDestination} className="text-xs text-stone-400 font-bold uppercase tracking-widest hover:text-[#D4A373] flex items-center gap-2 pl-2 transition-colors py-2">
                        <PlusCircleIcon className="w-4 h-4" />
                        Add Destination
                    </button>
                </div>
            </div>

            {/* Currency Section */}
            <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Finances</label>
                <div className="grid grid-cols-2 gap-3">
                    <div className="relative group">
                        <span className="absolute left-4 top-2 text-[8px] font-bold text-stone-400 uppercase">Local</span>
                        <select value={tripDetails.destCurrency} onChange={(e) => handleDetailChange('destCurrency', e.target.value)} className="w-full bg-white px-4 pt-6 pb-3 rounded-2xl border border-stone-200 outline-none focus:ring-2 focus:ring-[#D4A373] appearance-none cursor-pointer text-sm font-bold text-stone-800">
                            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                         <div className="absolute right-4 bottom-4 pointer-events-none text-stone-300 text-[10px]">▼</div>
                    </div>
                     <div className="relative group">
                        <span className="absolute left-4 top-2 text-[8px] font-bold text-stone-400 uppercase">Home</span>
                        <select value={tripDetails.homeCurrency} onChange={(e) => handleDetailChange('homeCurrency', e.target.value)} className="w-full bg-white px-4 pt-6 pb-3 rounded-2xl border border-stone-200 outline-none focus:ring-2 focus:ring-[#D4A373] appearance-none cursor-pointer text-sm font-bold text-stone-800">
                            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                         <div className="absolute right-4 bottom-4 pointer-events-none text-stone-300 text-[10px]">▼</div>
                    </div>
                </div>
            </div>

            {/* AI Planning Section */}
            <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">AI Personalization</label>
                <textarea 
                    value={userNotes} 
                    onChange={(e) => setUserNotes(e.target.value)}
                    placeholder="E.g., I love architecture, hidden cafes, and unique street photography spots. Low budget but high quality food." 
                    className="w-full bg-white p-5 rounded-[2rem] border border-stone-200 outline-none focus:ring-2 focus:ring-[#D4A373] min-h-[140px] text-sm text-stone-600 resize-none leading-relaxed">
                </textarea>
                <button 
                    onClick={onGenerate} 
                    disabled={isLoading} 
                    className="w-full py-6 mt-2 bg-stone-800 text-white rounded-[2rem] font-bold shadow-xl hover:bg-stone-900 transition-all flex flex-col items-center justify-center gap-1 disabled:opacity-90 disabled:cursor-not-allowed">
                    {isLoading ? (
                        <>
                            <div className="flex items-center gap-3">
                                <SpinnerIcon className="w-5 h-5 text-[#D4A373]" />
                                <span className="text-lg">Creating Magic...</span>
                            </div>
                            <span className="text-[10px] font-normal text-stone-400 animate-pulse uppercase tracking-[0.2em] mt-1">
                                {LOADING_MESSAGES[messageIndex]}
                            </span>
                        </>
                    ) : (
                        <div className="flex items-center gap-3">
                            <SparklesIcon className="w-5 h-5 text-[#D4A373]" />
                            <span className="text-lg">Generate Itinerary</span>
                        </div>
                    )}
                </button>
            </div>
        </div>
    );
};

export default HomeTab;
