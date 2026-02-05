
import React, { useState, useMemo, useEffect } from 'react';
import type { TripDetails, ItineraryItem, Accommodation } from '../../types';
import DailyMap from '../DailyMap';
import HotelIcon from '../icons/HotelIcon';
import MapPinIcon from '../icons/MapPinIcon';

interface ItineraryTabProps {
    tripDetails: TripDetails;
    itinerary: ItineraryItem[];
    setItinerary: React.Dispatch<React.SetStateAction<ItineraryItem[]>>;
    accommodations: Record<string, Accommodation>;
    setAccommodations: React.Dispatch<React.SetStateAction<Record<string, Accommodation>>>;
}

const ItineraryTab: React.FC<ItineraryTabProps> = ({ tripDetails, itinerary, accommodations }) => {

    const tripDays = useMemo(() => {
        if (!tripDetails.startDate || !tripDetails.endDate) return [];
        const days = [];
        let current = new Date(tripDetails.startDate + 'T00:00:00'); // Avoid timezone issues
        const end = new Date(tripDetails.endDate + 'T00:00:00');
        
        while (current <= end) {
            days.push({
                iso: current.toISOString().split('T')[0],
                weekday: current.toLocaleDateString('en-US', { weekday: 'short' }),
                dayNum: current.getDate()
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
        <div className="animate-in fade-in duration-500">
             {/* Date Selector */}
            <div className="mb-6 overflow-x-auto hide-scrollbar -mx-6 px-6 pb-2">
                <div className="flex gap-3 min-w-min">
                    {tripDays.map(day => (
                        <button 
                            key={day.iso}
                            onClick={() => setSelectedDate(day.iso)}
                            className={`flex flex-col items-center justify-center min-w-[70px] h-20 rounded-2xl border transition-all duration-300 ${
                                selectedDate === day.iso 
                                ? 'bg-stone-800 text-white border-stone-800 shadow-lg scale-105' 
                                : 'bg-white text-stone-400 border-stone-200'
                            }`}
                        >
                            <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">{day.weekday}</span>
                            <span className="text-xl font-semibold">{day.dayNum}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Accommodation Card */}
            <div className="mb-6 bg-[#F3F0EB] p-4 rounded-2xl border border-stone-200/50 flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#D4A373] shadow-sm shrink-0">
                    <HotelIcon />
                </div>
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Residing At</p>
                    <p className="text-sm font-medium text-stone-800 truncate max-w-[200px]">
                        {currentAccommodation?.name || 'No accommodation set'}
                    </p>
                </div>
            </div>

            <h2 className="text-xl font-medium mb-4">Daily Plans</h2>
            <div className="space-y-4 mb-8">
                {filteredItinerary.length > 0 ? filteredItinerary.map((item, index) => (
                    <div key={index} className="bg-white p-4 rounded-2xl nordic-shadow border border-stone-100 flex gap-4 items-start animate-in slide-in-from-bottom-2 duration-300">
                        <div className="text-xs font-bold text-[#D4A373] mt-1 w-12 shrink-0">{item.time}</div>
                        <div className="flex-1">
                            <h3 className="font-medium text-stone-800">{item.activity}</h3>
                            <p className="text-xs text-stone-500 flex items-center gap-1.5 mt-1 truncate">
                                <MapPinIcon className="w-3 h-3 text-stone-400 shrink-0" />
                                {item.location}
                            </p>
                        </div>
                    </div>
                )) : (
                     <div className="text-center py-8">
                        <p className="text-stone-400 text-sm mb-2">No activities for this day.</p>
                        <p className="text-xs text-stone-300">Generate a plan from the Home tab!</p>
                    </div>
                )}
            </div>

            <h2 className="text-xl font-medium mb-4">Day Overview</h2>
            <DailyMap items={filteredItinerary} accommodation={currentAccommodation} />
            {googleMapsLink && (
                <a href={googleMapsLink} target="_blank" rel="noopener noreferrer" className="mt-4 block w-full py-3 bg-[#4285F4] text-white rounded-xl text-center font-medium shadow-md hover:bg-[#3367d6] transition-colors flex items-center justify-center gap-2">
                    Open Route in Google Maps
                </a>
            )}
        </div>
    );
};

export default ItineraryTab;
