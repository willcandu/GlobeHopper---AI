
import { GoogleGenAI, Type } from "@google/genai";
import type { TripDetails, ItineraryItem } from "../types";

// Vite uses import.meta.env, while some other environments use process.env
// This check makes the app more robust for local development
const API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY not found. Please ensure VITE_GEMINI_API_KEY is set in your .env file.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "" });

export async function generateItineraryPlan(details: TripDetails, notes: string): Promise<{ markdown: string; events: ItineraryItem[] }> {
    const model = "gemini-3-flash-preview";
    const destinations = details.destinations.map(d => d.name).join(', ');
    
    const prompt = `
        You are an expert travel planner with a passion for creating unique and memorable trips.
        A user is planning a trip to ${destinations} from ${details.startDate} to ${details.endDate}.
        Their home location is ${details.origin}.
        
        Their personal preferences are: "${notes}".
        
        Please generate a detailed travel plan. The response must be a single, valid JSON object that strictly adheres to the provided schema.
        
        Your plan should include:
        1.  A "markdown" field: This should be a well-formatted markdown string that serves as a friendly, readable travel guide. Include headers for each day, bullet points for activities, and useful tips. Infuse the guide with personality and excitement.
        2.  An "events" field: This must be an array of event objects. Each event represents a specific activity or meal. For each event, you must provide:
            - "date": The date in YYYY-MM-DD format. This must be within the user's travel dates.
            - "time": The time in HH:MM (24-hour) format.
            - "activity": A concise, descriptive name for the activity (e.g., "Visit the Louvre Museum", "Dinner at Noma").
            - "location": A short, clear name of the location or venue (e.g., "Eiffel Tower", "Tivoli Gardens").
            - "lat": The geographical latitude as a number. This is crucial for map plotting.
            - "lon": The geographical longitude as a number. This is crucial for map plotting.
        
        Ensure you provide events for every single day of the trip. The latitude and longitude must be accurate for each location.
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        markdown: {
                            type: Type.STRING,
                            description: "A comprehensive travel guide formatted in Markdown. It should be engaging and cover the entire trip."
                        },
                        events: {
                            type: Type.ARRAY,
                            description: "A detailed list of all scheduled events and activities for the trip.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    date: { type: Type.STRING, description: "Date of the event (YYYY-MM-DD)." },
                                    time: { type: Type.STRING, description: "Time of the event (HH:MM)." },
                                    activity: { type: Type.STRING, description: "Name of the activity." },
                                    location: { type: Type.STRING, description: "Name of the location/venue." },
                                    lat: { type: Type.NUMBER, description: "Latitude of the location." },
                                    lon: { type: Type.NUMBER, description: "Longitude of the location." }
                                },
                                required: ["date", "time", "activity", "location", "lat", "lon"]
                            }
                        }
                    },
                    required: ["markdown", "events"]
                }
            }
        });

        const jsonString = response.text;
        if (!jsonString) {
            throw new Error("Received an empty response from the AI. Please try a different prompt.");
        }

        const parsedResponse = JSON.parse(jsonString);
        return parsedResponse;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to communicate with the AI. Please check your connection and API key setup.");
    }
}
