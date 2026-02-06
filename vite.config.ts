import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  // Try common naming patterns
  const apiKey = env.API_KEY || env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || '';

  return {
    plugins: [react()],
    server: {
      port: 3000,
      host: 'localhost',
      strictPort: true,
    },
    define: {
      // Specifically expose only the API_KEY string to the frontend.
      // This avoids the 'process.env' object mapping security warning.
      'process.env.API_KEY': JSON.stringify(apiKey),
    }
  };
});