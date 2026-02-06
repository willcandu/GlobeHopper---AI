import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Tab, TripDetails, ItineraryItem, Accommodation, LedgerEntry, ShoppingItem } from './types';
import { TABS } from './constants';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomeTab from './components/tabs/HomeTab';
import SuggestionsTab from './components/tabs/SuggestionsTab';
import ItineraryTab from './components/tabs/ItineraryTab';
import LedgerTab from './components/tabs/LedgerTab';
import ShoppingTab from './components/tabs/ShoppingTab';
import { generateItineraryPlan } from './services/geminiService';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('home');
    const [isLoading, setIsLoading] = useState(false);
    const [tripDetails, setTripDetails] = useState<TripDetails>({
        origin: 'San Francisco',
        destinations: [{ name: 'Copenhagen' }],
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(new Date().setDate(new Date().getDate() + 6)).toISOString().split('T')[0],
        destCurrency: 'DKK',
        homeCurrency: 'USD',
    });
    const [userNotes, setUserNotes] = useState('I love architecture, street food, and finding unique photo spots.');
    const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
    const [accommodations, setAccommodations] = useState<Record<string, Accommodation>>({});
    const [ledger, setLedger] = useState<LedgerEntry[]>([]);
    const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
    const [aiMarkdown, setAiMarkdown] = useState<string>('');
    const [sources, setSources] = useState<{title: string, uri: string}[]>([]);

    const loadState = () => {
      try {
        const savedState = localStorage.getItem('globehopper_data_react');
        if (savedState) {
          const data = JSON.parse(savedState);
          setTripDetails(data.tripDetails);
          setUserNotes(data.userNotes);
          setItinerary(data.itinerary);
          setAccommodations(data.accommodations);
          setLedger(data.ledger);
          setShoppingList(data.shoppingList);
          setAiMarkdown(data.aiMarkdown);
          setSources(data.sources || []);
        }
      } catch (error) {
        console.error("Load state error", error);
      }
    };
    
    const saveState = useCallback(() => {
      try {
          const stateToSave = {
              tripDetails,
              userNotes,
              itinerary,
              accommodations,
              ledger,
              shoppingList,
              aiMarkdown,
              sources
          };
          localStorage.setItem('globehopper_data_react', JSON.stringify(stateToSave));
      } catch (error) {
          console.error("Save state error", error);
      }
    }, [tripDetails, userNotes, itinerary, accommodations, ledger, shoppingList, aiMarkdown, sources]);

    useEffect(() => { loadState(); }, []);
    useEffect(() => { saveState(); }, [saveState]);

    const handleGenerateItinerary = async () => {
        if (!tripDetails.startDate || !tripDetails.endDate || !tripDetails.destinations[0]?.name) {
            alert("Please fill in dates and at least one destination.");
            return;
        }
        setIsLoading(true);
        try {
            const result = await generateItineraryPlan(tripDetails, userNotes);
            if (result) {
                setAiMarkdown(result.markdown);
                setItinerary(result.events);
                setSources(result.sources);
                setActiveTab('ai-suggestions');
            }
        } catch (error: any) {
            console.error(error);
            alert(error.message || `Failed to generate itinerary. Check console for details.`);
        } finally {
            setIsLoading(false);
        }
    };

    const tabContent = useMemo(() => {
        switch (activeTab) {
            case 'home':
                return <HomeTab 
                          tripDetails={tripDetails} 
                          setTripDetails={setTripDetails}
                          userNotes={userNotes}
                          setUserNotes={setUserNotes}
                          onGenerate={handleGenerateItinerary}
                          isLoading={isLoading}
                          />;
            case 'ai-suggestions':
                return <SuggestionsTab markdown={aiMarkdown} sources={sources} onBackToHome={() => setActiveTab('home')} />;
            case 'itinerary':
                return <ItineraryTab 
                          tripDetails={tripDetails} 
                          itinerary={itinerary}
                          setItinerary={setItinerary}
                          accommodations={accommodations}
                          setAccommodations={setAccommodations}
                          onGoToHome={() => setActiveTab('home')}
                          />;
            case 'ledger':
                return <LedgerTab ledger={ledger} setLedger={setLedger} currency={tripDetails.destCurrency} />;
            case 'shopping':
                return <ShoppingTab shoppingList={shoppingList} setShoppingList={setShoppingList} />;
            default:
                return null;
        }
    }, [activeTab, tripDetails, userNotes, isLoading, aiMarkdown, itinerary, accommodations, ledger, shoppingList, sources]);

    return (
        <div className="min-h-screen flex flex-col max-w-md mx-auto bg-[#FDFBF7]">
            <Header activeTab={activeTab} tripDetails={tripDetails} />
            <main className="px-6 flex-grow pb-24">
                {tabContent}
            </main>
            <BottomNav tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    );
};

export default App;