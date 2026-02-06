import { GoogleGenAI } from "@google/genai";
import type { TripDetails, ItineraryItem } from "../types";

export interface GenerationResult {
    markdown: string;
    events: ItineraryItem[];
    sources: { title: string; uri: string }[];
}

/**
 * Generates a travel itinerary using gemini-3-flash-preview.
 * This model has higher rate limits for the free tier than the Pro version.
 */
export async function generateItineraryPlan(details: TripDetails, notes: string): Promise<GenerationResult> {
    const apiKey = process.env.API_KEY;
    
    if (!apiKey || apiKey.includes('YOUR_ACTUAL_KEY') || apiKey.length < 10) {
        throw new Error("API Key is missing or invalid. Please check your .env.local file.");
    }

    const ai = new GoogleGenAI({ apiKey });
    const destinations = details.destinations.map(d => d.name).join(', ');
    
    const prompt = `Generate a comprehensive travel plan for ${destinations} from ${details.startDate} to ${details.endDate}.
        User's starting point: ${details.origin}.
        Preferences: "${notes}".
        
        IMPORTANT: Your response MUST be a single JSON object with the following structure:
        {
          "markdown": "A detailed travel guide in Markdown format.",
          "events": [
            {
              "date": "YYYY-MM-DD",
              "time": "HH:MM",
              "activity": "Activity name",
              "location": "Specific location",
              "lat": 0.0,
              "lon": 0.0,
              "mapLink": "Google Maps URL"
            }
          ]
        }`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                systemInstruction: "You are an elite travel concierge. Always provide high-quality, efficient travel advice. You must return only valid JSON.",
                tools: [{ googleSearch: {} }],
                responseMimeType: "application/json"
            }
        });

        const text = response.text || '';
        const parsed = JSON.parse(text);
        
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources = groundingChunks
            .filter(chunk => chunk.web)
            .map(chunk => ({
                title: chunk.web?.title || 'Source',
                uri: chunk.web?.uri || ''
            }));

        return {
            markdown: parsed.markdown || '',
            events: parsed.events || [],
            sources: sources
        };
    } catch (error: any) {
        console.error("Gemini Generation Error:", error);
        if (error.message?.includes('429')) {
            throw new Error("Quota exceeded. The free tier has limits on how many requests you can make per minute. Please wait 60 seconds and try again.");
        }
        throw error;
    }
}