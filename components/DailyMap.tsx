
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { ItineraryItem, Accommodation } from '../types';

interface DailyMapProps {
    items: ItineraryItem[];
    accommodation: Accommodation | null;
}

const DailyMap: React.FC<DailyMapProps> = ({ items, accommodation }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markersRef = useRef<L.Marker[]>([]);
    const polylinesRef = useRef<L.Polyline[]>([]);

    useEffect(() => {
        if (mapContainerRef.current && !mapInstanceRef.current) {
            const map = L.map(mapContainerRef.current).setView([51.505, -0.09], 13);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                maxZoom: 19,
            }).addTo(map);
            mapInstanceRef.current = map;
        }

        const map = mapInstanceRef.current;
        if (!map) return;
        
        // Clear previous layers
        markersRef.current.forEach(marker => map.removeLayer(marker));
        markersRef.current = [];
        polylinesRef.current.forEach(polyline => map.removeLayer(polyline));
        polylinesRef.current = [];

        const bounds = L.latLngBounds([]);
        const routePoints: L.LatLngExpression[] = [];
        
        if (accommodation && accommodation.lat && accommodation.lon) {
            const point: L.LatLngExpression = [accommodation.lat, accommodation.lon];
            routePoints.push(point);
            const hotelIcon = L.divIcon({
                className: 'custom-div-icon',
                html: `<div class="bg-[#44403C] w-[14px] h-[14px] rounded-full border-2 border-white shadow-lg"></div>`,
                iconSize: [14, 14],
                iconAnchor: [7, 7]
            });
            const marker = L.marker(point, { icon: hotelIcon }).addTo(map).bindPopup(`<b>Stay:</b> ${accommodation.name}`);
            markersRef.current.push(marker);
            bounds.extend(point);
        }

        items.forEach((item, index) => {
            if (item.lat && item.lon) {
                const point: L.LatLngExpression = [item.lat, item.lon];
                routePoints.push(point);
                const numberedIcon = L.divIcon({
                    className: 'custom-div-icon',
                    html: `<div class="bg-[#D4A373] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg">${index + 1}</div>`,
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                });
                const marker = L.marker(point, { icon: numberedIcon }).addTo(map).bindPopup(`<b>${item.time}</b><br>${item.activity}`);
                markersRef.current.push(marker);
                bounds.extend(point);
            }
        });

        if (routePoints.length > 1) {
            const polyline = L.polyline(routePoints, { color: '#44403C', weight: 3, opacity: 0.6, dashArray: '5, 5' }).addTo(map);
            polylinesRef.current.push(polyline);
        }

        if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
        } else if (items.length === 1 && items[0].lat && items[0].lon) {
            map.setView([items[0].lat, items[0].lon], 14);
        }

        // Invalidate size to ensure it renders correctly after tab switch
        setTimeout(() => map.invalidateSize(), 100);

    }, [items, accommodation]);

    return (
      <div className="rounded-3xl overflow-hidden bg-stone-100 h-[250px] relative nordic-shadow border-4 border-white z-0">
          <div ref={mapContainerRef} className="w-full h-full" />
      </div>
    );
};

export default DailyMap;
