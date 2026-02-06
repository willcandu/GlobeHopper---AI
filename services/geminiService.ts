
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
export async function generateItineraryPlan(details: TripDetails, notes: string): Promise<GenerationResult> {
    const apiKey = process.env.API_KEY;
    
    // Safety check for the API key in the browser environment
    if (!apiKey || apiKey === "" || apiKey.includes("your_actual_key")) {
        throw new Error("API Key is missing. Please connect your Gemini API key using the setup button.");
    }

    // Always create a new instance right before the call to ensure latest key from process.env is used
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
        
        // Handle specific error per guidelines: Reset key selection if entity not found
        if (error.message?.includes("Requested entity was not found")) {
            throw new Error("Requested entity was not found. Your selected API key might be invalid or restricted. Please re-select a valid API key.");
        }
        
        if (error.message?.includes('429')) {
            throw new Error("Quota exceeded. Please wait 1 minute. This often happens on the free tier if multiple requests are sent too quickly.");
        }
        
        if (error instanceof SyntaxError) {
            throw new Error("The AI returned an invalid response format. Please try again.");
        }

        throw new Error(error.message || "An unexpected error occurred while generating the itinerary.");
    }
}
