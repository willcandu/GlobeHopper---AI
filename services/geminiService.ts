
import { GoogleGenAI } from "@google/genai";
import type { TripDetails, ItineraryItem } from "../types";

export interface GenerationResult {
    markdown: string;
    events: ItineraryItem[];
    sources: { title: string; uri: string }[];
}

/**
 * Generates a travel itinerary using gemini-3-flash-preview.
 */
export async function generateItineraryPlan(
    details: TripDetails, 
    notes: string, 
    apiKey: string
): Promise<GenerationResult> {
    
    if (!apiKey || apiKey === "") {
        throw new Error("API Key is missing.");
    }

    const ai = new GoogleGenAI({ apiKey });
    const destinations = details.destinations.map(d => d.name).join(', ');
    
    const prompt = `Generate a detailed 5-day travel itinerary for ${destinations} starting from ${details.startDate} and ending on ${details.endDate}.
        Origin: ${details.origin}.
        Preferences: "${notes}".
        
        You MUST return the response as a JSON object with this exact structure:
        {
          "markdown": "A beautiful, long-form travel guide in Markdown with headers, bullet points, and tips.",
          "events": [
            {
              "date": "YYYY-MM-DD",
              "time": "HH:MM",
              "activity": "Name of the activity",
              "location": "Specific location/address",
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
                systemInstruction: "You are an expert travel planner. You provide high-quality, practical itineraries. Output ONLY valid JSON.",
                responseMimeType: "application/json",
                temperature: 0.7
            }
        });

        const text = response.text || '';
        const parsed = JSON.parse(text);
        
        return {
            markdown: parsed.markdown || '',
            events: (parsed.events || []).map((ev: any) => ({
                ...ev,
                lat: parseFloat(ev.lat) || 0,
                lon: parseFloat(ev.lon) || 0
            })),
            sources: []
        };
    } catch (error: any) {
        console.error("Gemini API Error Detail:", error);
        
        if (error.message?.includes("API_KEY_INVALID") || error.message?.includes("403")) {
            throw new Error("API_KEY_INVALID");
        }
        
        if (error.message?.includes('429')) {
            throw new Error("Quota exceeded. Please wait 1 minute.");
        }
        
        throw new Error(error.message || "An unexpected error occurred.");
    }
}
