
# 🌍 GlobeHopper: AI Travel Planner

GlobeHopper is a sophisticated, AI-powered travel planning application that generates personalized itineraries, manages trip expenses, and visualizes routes on an interactive map.

## ✨ Features

- **🤖 AI Itinerary Generation**: Uses Google Gemini to create detailed, day-by-day travel plans based on your specific preferences and destinations.
- **🗺️ Interactive Mapping**: Real-time map plotting using Leaflet, showing your daily activities and accommodation.
- **💱 Live Currency Conversion**: Real-time FX rates via the Frankfurter API.
- **📈 Expense Ledger**: Track your trip spending on the go.
- **📝 Smart Shopping List**: Manage your packing or souvenir lists.
- **📱 Mobile-First Design**: A beautiful, responsive Nordic-inspired UI designed for travelers on the move.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/globehopper-ai-travel-planner.git
   cd globehopper-ai-travel-planner
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   Create a `.env` file in the root directory and add your API key:
   ```env
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 🛠️ Tech Stack

- **React**: Frontend framework.
- **Gemini API (@google/genai)**: For AI itinerary generation.
- **Tailwind CSS**: For styling and responsive design.
- **Leaflet**: For interactive maps.
- **Vite**: Modern build tool.

## 📄 License

This project is open-source and available under the MIT License.
