
import React, { useState } from 'react';
import CopyIcon from '../icons/CopyIcon';
import CheckIcon from '../icons/CheckIcon';

interface SuggestionsTabProps {
    markdown: string;
    sources?: { title: string; uri: string }[];
    onBackToHome: () => void;
}

const SuggestionsTab: React.FC<SuggestionsTabProps> = ({ markdown, sources = [], onBackToHome }) => {
    const [copied, setCopied] = useState(false);
    
    const renderMarkdown = (text: string) => {
        return text
            .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-stone-700 mt-6 mb-2">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 class="text-xl font-black text-[#D4A373] mt-8 mb-4 border-b border-stone-100 pb-3 uppercase tracking-tight">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-black text-stone-800 mt-4 mb-6 leading-tight">$1</h1>')
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-stone-800">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="italic text-stone-600">$1</em>')
            .replace(/^- (.*$)/gim, '<li class="ml-5 list-disc mb-2 text-stone-600">$1</li>')
            .replace(/\n/g, '<br />');
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(markdown);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!markdown) {
        return (
            <div className="text-center py-24 px-8 animate-in fade-in duration-700">
                <div className="w-24 h-24 bg-stone-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-stone-200 shadow-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12 a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                </div>
                <h3 className="text-xl font-bold text-stone-800">Your guide is empty</h3>
                <p className="text-sm text-stone-400 mt-3 leading-relaxed">Let AI build your dream trip. Go to the Home tab and share your preferences to start.</p>
                <button onClick={onBackToHome} className="mt-8 px-10 py-4 bg-stone-800 text-white rounded-2xl text-sm font-bold shadow-lg hover:bg-stone-900 transition-all">Setup My Trip</button>
            </div>
        );
    }
    
    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-24">
            <div className="flex items-center justify-between px-1">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">Curated Intelligence</h2>
                <button 
                    onClick={handleCopy}
                    className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${copied ? 'text-green-500' : 'text-[#D4A373]'}`}
                >
                    {copied ? <><CheckIcon className="w-3 h-3" /> Copied!</> : <><CopyIcon className="w-3 h-3" /> Copy Guide</>}
                </button>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-stone-100 prose prose-stone max-w-none relative">
                <div className="absolute top-0 right-10 w-20 h-1 bg-[#D4A373] rounded-b-full"></div>
                <div className="text-stone-700 leading-relaxed text-sm selection:bg-[#D4A373]/20" dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }} />
            </div>

            {sources.length > 0 && (
                <div className="bg-stone-50 p-8 rounded-[2.5rem] border border-stone-100">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4A373] mb-6">Verified References</h4>
                    <ul className="space-y-4">
                        {sources.map((source, idx) => (
                            <li key={idx}>
                                <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-sm text-stone-500 hover:text-stone-800 flex items-start gap-3 group">
                                    <span className="w-2 h-2 rounded-full bg-stone-200 mt-1.5 group-hover:bg-[#D4A373] transition-colors shrink-0"></span>
                                    <span className="font-medium underline decoration-stone-200 underline-offset-8 transition-colors group-hover:decoration-[#D4A373]">{source.title}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SuggestionsTab;
