
import React from 'react';

interface SuggestionsTabProps {
    markdown: string;
    onBackToHome: () => void;
}

const SuggestionsTab: React.FC<SuggestionsTabProps> = ({ markdown, onBackToHome }) => {
    
    // A simple markdown to HTML converter
    const renderMarkdown = (text: string) => {
        return text
            .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-stone-700 mt-4 mb-2">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-[#D4A373] mt-6 mb-3 border-b border-stone-200 pb-2">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-stone-800 mt-2 mb-4">$1</h1>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/^- (.*$)/gim, '<li class="ml-5 list-disc">$1</li>')
            .replace(/\n/g, '<br />');
    };

    if (!markdown) {
        return (
            <div className="text-center py-20 px-6 animate-in fade-in duration-500">
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                </div>
                <h3 className="text-lg font-medium text-stone-800">No suggestions yet</h3>
                <p className="text-sm text-stone-400 mt-2">Go to Home and click "Generate Itinerary" to get a custom AI travel guide.</p>
                <button onClick={onBackToHome} className="mt-6 px-6 py-2 bg-[#D4A373] text-white rounded-xl text-sm font-medium">Go to Setup</button>
            </div>
        );
    }
    
    return (
        <div className="bg-white p-6 rounded-3xl nordic-shadow border border-stone-100 animate-in fade-in duration-500 prose prose-stone max-w-none">
            <div dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }} />
        </div>
    );
};

export default SuggestionsTab;
