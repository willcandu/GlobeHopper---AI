import { GoogleGenAI } from "@google/genai";
import type { TripDetails, ItineraryItem } from "../types";

export interface GenerationResult {
    markdown: string;
    events: ItineraryItem[];
    sources: { title: string; uri: string }[];
}

/**
 * Generates a travel itinerary using gemini-3-pro-preview with Google Search grounding.
 */
export async function generateItineraryPlan(details: TripDetails, notes: string): Promise<GenerationResult> {
    const apiKey = process.env.API_KEY;
    
    if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY' || apiKey.length < 10) {
        console.error("API Key missing or invalid. Check your .env.local file.");
        throw new Error("API Key not found. Please ensure API_KEY is set in your .env.local file.");
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-3-pro-preview';
    const destinations = details.destinations.map(d => d.name).join(', ');
    
    const prompt = `
        You are an elite travel concierge. Generate a comprehensive travel plan for ${destinations} from ${details.startDate} to ${details.endDate}.
        User's starting point: ${details.origin}.
        Preferences: "${notes}".
        
        IMPORTANT: Your response MUST be a single JSON object. Do not include extra text like "Here is your plan".
        
        The JSON structure must be:
        {
          "markdown": "A detailed travel guide in Markdown format. Use headers, bold text, and lists.",
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
        1. Use Google Search to find real, current events or popular landmarks.
        2. Provide accurate lat/lon for the map markers.
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            }
        });

        const text = response.text || '';
        if (!text) throw new Error("Empty AI response");

        // Clean any markdown backticks the model might include
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        
        // Extract JSON block
        const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : cleanedText;
        
        let parsed;
        try {
            parsed = JSON.parse(jsonString);
        } catch (e) {
            console.error("Raw response that failed to parse:", text);
            throw new Error("AI returned invalid JSON format. Try again.");
        }
        
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
        console.error("Gemini Generation Error:", error);
        throw error;
    }
}