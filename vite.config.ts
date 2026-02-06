
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  // Pick the first available key from common naming patterns
  const apiKey = env.API_KEY || env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || '';

  return {
    plugins: [react()],
    server: {
      port: 3000,
      host: true, // This makes the server accessible on your local network
      strictPort: true, // Ensures it only runs on 3000 or fails, so you know exactly where it is
    },
    define: {
      // Specifically expose only the API_KEY to satisfy the @google/genai requirements
      'process.env.API_KEY': JSON.stringify(apiKey),
    }
  };
});
