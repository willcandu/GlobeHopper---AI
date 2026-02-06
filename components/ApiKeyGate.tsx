
import React, { useState } from 'react';
import SparklesIcon from './icons/SparklesIcon';
import ExternalLinkIcon from './icons/ExternalLinkIcon';

interface ApiKeyGateProps {
    onSubmit: (key: string) => void;
}

const ApiKeyGate: React.FC<ApiKeyGateProps> = ({ onSubmit }) => {
    const [inputKey, setInputKey] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputKey.trim().startsWith('AIza')) {
            onSubmit(inputKey.trim());
        } else {
            alert("Please enter a valid Gemini API key (usually starts with 'AIza').");
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-[#FDFBF7] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700">
            <div className="w-20 h-20 bg-stone-800 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl relative">
                <SparklesIcon className="w-8 h-8 text-[#D4A373]" />
            </div>
            
            <h1 className="text-2xl font-black text-stone-800 italic mb-2">GlobeHopper <span className="not-italic font-light">AI</span></h1>
            
            <p className="text-stone-500 text-sm leading-relaxed max-w-xs mb-8">
                Enter your Gemini API key to start planning. Your key is stored locally in your browser.
            </p>
            
            <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
                <div className="relative">
                    <input 
                        type="password"
                        value={inputKey}
                        onChange={(e) => setInputKey(e.target.value)}
                        placeholder="Paste your API key here..."
                        className="w-full px-5 py-4 bg-white border border-stone-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#D4A373] text-sm font-medium shadow-sm transition-all"
                        required
                    />
                </div>

                <button 
                    type="submit"
                    className="w-full py-5 bg-stone-800 text-white rounded-[2rem] font-bold shadow-xl hover:bg-stone-900 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                    <SparklesIcon className="w-4 h-4 text-[#D4A373]" />
                    Start Planning
                </button>
                
                <div className="pt-4 flex flex-col items-center gap-3">
                    <a 
                        href="https://aistudio.google.dev/app/apikey" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#D4A373] hover:underline"
                    >
                        Get a Free API Key <ExternalLinkIcon className="w-3 h-3" />
                    </a>
                    <a 
                        href="https://ai.google.dev/gemini-api/docs/billing" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[9px] text-stone-400 uppercase tracking-widest hover:underline"
                    >
                        Billing Info
                    </a>
                </div>
            </form>
            
            <p className="absolute bottom-12 text-[10px] text-stone-300 uppercase tracking-[0.2em] font-bold">
                Privacy First • Local Key Storage
            </p>
        </div>
    );
};

export default ApiKeyGate;
