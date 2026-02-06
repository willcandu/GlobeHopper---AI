
import React from 'react';
import SparklesIcon from './icons/SparklesIcon';
import ExternalLinkIcon from './icons/ExternalLinkIcon';

interface ApiKeyGateProps {
    onConnect: () => void;
}

const ApiKeyGate: React.FC<ApiKeyGateProps> = ({ onConnect }) => {
    return (
        <div className="fixed inset-0 z-[100] bg-[#FDFBF7] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700">
            <div className="w-24 h-24 bg-stone-800 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl relative">
                <SparklesIcon className="w-10 h-10 text-[#D4A373]" />
                <div className="absolute -right-2 -top-2 w-6 h-6 bg-green-500 rounded-full border-4 border-[#FDFBF7] animate-pulse"></div>
            </div>
            
            <h1 className="text-3xl font-black text-stone-800 italic mb-4">GlobeHopper <span className="not-italic font-light">AI</span></h1>
            
            <p className="text-stone-500 text-sm leading-relaxed max-w-xs mb-10">
                To generate your personalized Nordic-inspired itineraries, please connect your Gemini API key from a paid project.
            </p>
            
            <div className="w-full max-w-xs space-y-4">
                <button 
                    onClick={onConnect}
                    className="w-full py-5 bg-stone-800 text-white rounded-[2rem] font-bold shadow-xl hover:bg-stone-900 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                    <SparklesIcon className="w-5 h-5 text-[#D4A373]" />
                    Connect Gemini API
                </button>
                
                <a 
                    href="https://ai.google.dev/gemini-api/docs/billing" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#D4A373] hover:underline"
                >
                    Billing Documentation <ExternalLinkIcon className="w-3 h-3" />
                </a>
            </div>
            
            <p className="absolute bottom-12 text-[10px] text-stone-300 uppercase tracking-[0.2em] font-bold">
                Securely handled by Google AI Studio
            </p>
        </div>
    );
};

export default ApiKeyGate;
