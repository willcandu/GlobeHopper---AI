
import React from 'react';
import type { TripDetails } from '../../types';
import { CURRENCIES } from '../../constants';
import PlusCircleIcon from '../icons/PlusCircleIcon';
import TrashIcon from '../icons/TrashIcon';
import SparklesIcon from '../icons/SparklesIcon';
import SpinnerIcon from '../icons/SpinnerIcon';

interface HomeTabProps {
    tripDetails: TripDetails;
    setTripDetails: React.Dispatch<React.SetStateAction<TripDetails>>;
    userNotes: string;
    setUserNotes: React.Dispatch<React.SetStateAction<string>>;
    onGenerate: () => void;
    isLoading: boolean;
}

const HomeTab: React.FC<HomeTabProps> = ({ tripDetails, setTripDetails, userNotes, setUserNotes, onGenerate, isLoading }) => {
    
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

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Removed file upload/download for simplicity and focus on core AI flow */}
            
            {/* Route & Dates Section */}
            <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-stone-400 ml-1">Route & Dates</label>
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <input value={tripDetails.startDate} onChange={(e) => handleDetailChange('startDate', e.target.value)} type="date" className="w-full bg-white p-4 rounded-2xl border border-stone-200 outline-none focus:ring-2 focus:ring-[#D4A373] text-sm text-stone-600"/>
                        <input value={tripDetails.endDate} onChange={(e) => handleDetailChange('endDate', e.target.value)} type="date" className="w-full bg-white p-4 rounded-2xl border border-stone-200 outline-none focus:ring-2 focus:ring-[#D4A373] text-sm text-stone-600"/>
                    </div>
                    
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 uppercase">From</span>
                        <input value={tripDetails.origin} onChange={(e) => handleDetailChange('origin', e.target.value)} type="text" placeholder="Origin City" className="w-full bg-white pl-16 pr-4 py-4 rounded-2xl border border-stone-200 outline-none focus:ring-2 focus:ring-[#D4A373] text-sm"/>
                    </div>
                    
                    {tripDetails.destinations.map((dest, index) => (
                        <div key={index} className="relative flex gap-2">
                            <div className="relative flex-1">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#D4A373] uppercase">To</span>
                                <input value={dest.name} onChange={(e) => handleDestinationChange(index, e.target.value)} type="text" placeholder="Destination City" className="w-full bg-white pl-12 pr-4 py-4 rounded-2xl border border-stone-200 outline-none focus:ring-2 focus:ring-[#D4A373] text-sm"/>
                            </div>
                            <button onClick={() => removeDestination(index)} className="px-4 text-stone-300 hover:text-red-500 transition-colors bg-white rounded-2xl border border-stone-200">
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                    <button onClick={addDestination} className="text-sm text-stone-500 font-medium hover:text-[#D4A373] flex items-center gap-2 pl-1 transition-colors">
                        <PlusCircleIcon className="w-5 h-5" />
                        Add another destination
                    </button>
                </div>
            </div>

            {/* Currency Section */}
            <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-stone-400 ml-1">Currency</label>
                <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                        <select value={tripDetails.destCurrency} onChange={(e) => handleDetailChange('destCurrency', e.target.value)} className="w-full bg-white px-4 py-4 rounded-2xl border border-stone-200 outline-none focus:ring-2 focus:ring-[#D4A373] appearance-none cursor-pointer text-sm">
                            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                         <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">▼</div>
                    </div>
                     <div className="relative">
                        <select value={tripDetails.homeCurrency} onChange={(e) => handleDetailChange('homeCurrency', e.target.value)} className="w-full bg-white px-4 py-4 rounded-2xl border border-stone-200 outline-none focus:ring-2 focus:ring-[#D4A373] appearance-none cursor-pointer text-sm">
                            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                         <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">▼</div>
                    </div>
                </div>
            </div>

            {/* AI Planning Section */}
            <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-stone-400 ml-1">AI Trip Planner</label>
                <textarea 
                    value={userNotes} 
                    onChange={(e) => setUserNotes(e.target.value)}
                    placeholder="E.g., I love museums, vegan food, and hiking. Prefer a relaxed pace." 
                    className="w-full bg-white p-4 rounded-2xl border border-stone-200 outline-none focus:ring-2 focus:ring-[#D4A373] min-h-[120px] text-sm text-stone-600 resize-none">
                </textarea>
                <p className="text-[10px] text-stone-400 px-4 mt-1">
                    Your API key is securely accessed from the environment.
                </p>
                <button 
                    onClick={onGenerate} 
                    disabled={isLoading} 
                    className="w-full py-5 mt-4 bg-stone-800 text-white rounded-2xl font-semibold shadow-lg hover:bg-stone-900 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed">
                    {isLoading ? (
                        <>
                            <SpinnerIcon />
                            Generating...
                        </>
                    ) : (
                        <>
                            <SparklesIcon />
                            Generate Itinerary with AI
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default HomeTab;
