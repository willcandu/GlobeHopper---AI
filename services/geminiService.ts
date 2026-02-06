import { GoogleGenAI } from "@google/genai";
import type { TripDetails, ItineraryItem } from "../types";

// Always initialize with named parameter and process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface GenerationResult {
    markdown: string;
    events: ItineraryItem[];
    sources: { title: string; uri: string }[];
}

/**
 * Generates a travel itinerary using gemini-3-pro-preview with Google Search grounding.
 * Note: Grounding tools (search/maps) prohibit the use of responseMimeType and responseSchema.
 */
export async function generateItineraryPlan(details: TripDetails, notes: string): Promise<GenerationResult> {
    // Complex reasoning task: use gemini-3-pro-preview
    const model = 'gemini-3-pro-preview';
    const destinations = details.destinations.map(d => d.name).join(', ');
    
    const prompt = `
        You are an elite travel concierge. Generate a comprehensive travel plan for ${destinations} from ${details.startDate} to ${details.endDate}.
        User's starting point: ${details.origin}.
        Preferences: "${notes}".
        
        IMPORTANT: Your response MUST be a single JSON object. Do not include extra text.
        
        The JSON structure must be:
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
              "mapLink": "Optional Google Maps URL"
            }
          ]
        }
        
        INSTRUCTIONS:
        1. Use Google Search to find real, current events happening during these dates.
        2. Provide accurate lat/lon for the map.
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                // When using googleSearch, only googleSearch is permitted as a tool.
                tools: [{ googleSearch: {} }],
                // Prohibited to set responseMimeType or responseSchema when using grounding tools.
            }
        });

        // Use the .text property (not a method) to get response content.
        const text = response.text || '';
        if (!text) throw new Error("Empty AI response");

        // Grounding responses might not be pure JSON, so we extract it.
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : text;
        
        let parsed;
        try {
            parsed = JSON.parse(jsonString);
        } catch (e) {
            console.error("Failed to parse JSON from grounded response:", text);
            throw new Error("AI response was not in expected JSON format");
        }
        
        // Grounding URLs must always be extracted and displayed.
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources = groundingChunks
            .filter(chunk => chunk.web)
            .map(chunk => ({
                title: chunk.web?.title || 'Source',
                uri: chunk.web?.uri || ''
            }));

        return {
            markdown: parsed.markdown || 'No guide generated.',
            events: parsed.events || [],
            sources: sources
        };

    } catch (error) {
        console.error("Gemini Error:", error);
        throw error;
    }
}
