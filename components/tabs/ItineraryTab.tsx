
import React, { useState, useMemo, useEffect } from 'react';
import type { TripDetails, ItineraryItem, Accommodation } from '../../types';
import DailyMap from '../DailyMap';
import HotelIcon from '../icons/HotelIcon';
import MapPinIcon from '../icons/MapPinIcon';
import ExternalLinkIcon from '../icons/ExternalLinkIcon';
import ClockIcon from '../icons/ClockIcon';

interface ItineraryTabProps {
    tripDetails: TripDetails;
    itinerary: ItineraryItem[];
    setItinerary: React.Dispatch<React.SetStateAction<ItineraryItem[]>>;
    accommodations: Record<string, Accommodation>;
    setAccommodations: React.Dispatch<React.SetStateAction<Record<string, Accommodation>>>;
    onGoToHome?: () => void;
}

const ItineraryTab: React.FC<ItineraryTabProps> = ({ tripDetails, itinerary, accommodations, onGoToHome }) => {

    const tripDays = useMemo(() => {
        if (!tripDetails.startDate || !tripDetails.endDate) return [];
        const days = [];
        let current = new Date(tripDetails.startDate + 'T00:00:00'); 
        const end = new Date(tripDetails.endDate + 'T00:00:00');
        
        while (current <= end) {
            days.push({
                iso: current.toISOString().split('T')[0],
                weekday: current.toLocaleDateString('en-US', { weekday: 'short' }),
                dayNum: current.getDate(),
                month: current.toLocaleDateString('en-US', { month: 'short' })
            });
            current.setDate(current.getDate() + 1);
        }
        return days;
    }, [tripDetails.startDate, tripDetails.endDate]);

    const [selectedDate, setSelectedDate] = useState<string>(tripDays[0]?.iso || '');

    useEffect(() => {
        if (tripDays.length > 0 && !tripDays.find(d => d.iso === selectedDate)) {
            setSelectedDate(tripDays[0].iso);
        }
    }, [tripDays, selectedDate]);
    
    const filteredItinerary = useMemo(() => {
        return itinerary
            .filter(item => item.date === selectedDate)
            .sort((a, b) => a.time.localeCompare(b.time));
    }, [itinerary, selectedDate]);

    const currentAccommodation = useMemo(() => {
        return accommodations[selectedDate] || null;
    }, [accommodations, selectedDate]);

     const googleMapsLink = useMemo(() => {
        const itemsForLink = filteredItinerary;
        if (itemsForLink.length === 0 && !currentAccommodation) return null;
        
        const waypoints = itemsForLink.map(i => `${i.lat},${i.lon}`);
        const origin = currentAccommodation ? `${currentAccommodation.lat},${currentAccommodation.lon}` : waypoints.shift();
        const destination = waypoints.pop() || origin;

        if (!origin) return null;

        const url = new URL("https://www.google.com/maps/dir/?api=1");
        url.searchParams.append('origin', origin);
        url.searchParams.append('destination', destination);
        if (waypoints.length > 0) {
            url.searchParams.append('waypoints', waypoints.join('|'));
        }

        return url.toString();
    }, [filteredItinerary, currentAccommodation]);


    return (
        <div className="animate-in fade-in duration-500 pb-20">
             {/* Calendar Ribbon */}
            <div className="mb-8 -mx-6 px-6 overflow-x-auto hide-scrollbar">
                <div className="flex gap-4 min-w-max py-2">
                    {tripDays.map(day => (
                        <button 
                            key={day.iso}
                            onClick={() => setSelectedDate(day.iso)}
                            className={`flex flex-col items-center justify-center w-14 h-20 rounded-2xl transition-all duration-300 ${
                                selectedDate === day.iso 
                                ? 'bg-stone-800 text-white shadow-xl -translate-y-1' 
                                : 'bg-white text-stone-400 border border-stone-100 hover:border-[#D4A373]/30'
                            }`}
                        >
                            <span className="text-[9px] font-bold uppercase tracking-tighter mb-1">{day.weekday}</span>
                            <span className="text-lg font-bold leading-none">{day.dayNum}</span>
                            <span className="text-[8px] uppercase mt-1 opacity-50">{day.month}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Map Preview */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-3 px-1">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400">Route Overview</h2>
                    {googleMapsLink && (
                        <a href={googleMapsLink} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-[#D4A373] flex items-center gap-1 hover:underline">
                            OPEN IN GOOGLE MAPS <ExternalLinkIcon className="w-3 h-3" />
                        </a>
                    )}
                </div>
                <DailyMap items={filteredItinerary} accommodation={currentAccommodation} />
            </div>

            {/* Accommodation Context */}
            {currentAccommodation && (
                <div className="mb-8 bg-stone-800 text-white p-5 rounded-3xl shadow-lg relative overflow-hidden group">
                    <div className="absolute right-[-10%] top-[-20%] opacity-10 group-hover:scale-110 transition-transform duration-700">
                        <HotelIcon className="w-32 h-32" />
                    </div>
                    <div className="relative z-10">
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#D4A373]">Home Base</span>
                        <h3 className="text-lg font-bold mt-1">{currentAccommodation.name}</h3>
                        <p className="text-xs text-stone-400 mt-2 flex items-center gap-2">
                            <MapPinIcon className="w-3 h-3" /> Centrally located for today's activities
                        </p>
                    </div>
                </div>
            )}

            {/* Daily Timeline */}
            <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-4 px-1">Daily Schedule</h2>
            <div className="space-y-6 relative ml-4 border-l border-stone-200 pl-8 pb-4">
                {filteredItinerary.length > 0 ? filteredItinerary.map((item, index) => (
                    <div key={index} className="relative animate-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                        {/* Timeline Connector Dot */}
                        <div className="absolute left-[-37px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-[#D4A373] shadow-sm z-10"></div>
                        
                        <div className="bg-white p-5 rounded-3xl nordic-shadow border border-stone-100 flex flex-col gap-3">
                            <div className="flex justify-between items-start">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-50 text-[10px] font-bold text-stone-500 border border-stone-100 uppercase tracking-tighter">
                                    <ClockIcon className="w-3 h-3" /> {item.time}
                                </span>
                                {item.mapLink && (
                                    <a href={item.mapLink} target="_blank" rel="noopener noreferrer" className="p-2 text-stone-300 hover:text-[#D4A373] bg-stone-50 rounded-xl transition-all">
                                        <ExternalLinkIcon className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                            
                            <div>
                                <h3 className="text-base font-bold text-stone-800 leading-tight">{item.activity}</h3>
                                <p className="text-xs text-stone-500 mt-2 flex items-center gap-1.5">
                                    <MapPinIcon className="w-3 h-3 text-[#D4A373]" />
                                    {item.location}
                                </p>
                            </div>
                        </div>
                    </div>
                )) : (
                     <div className="relative">
                        <div className="absolute left-[-37px] top-1.5 w-4 h-4 rounded-full bg-stone-100 border-2 border-stone-200 z-10"></div>
                        <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-stone-100">
                            <p className="text-stone-300 text-sm font-medium">No plans for this date.</p>
                            <button onClick={onGoToHome} className="text-[10px] font-black text-[#D4A373] uppercase mt-2 tracking-widest hover:underline">Setup Your Trip</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ItineraryTab;
