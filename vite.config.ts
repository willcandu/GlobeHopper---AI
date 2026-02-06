import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  // Try common naming patterns to be helpful
  const apiKey = env.API_KEY || env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || '';

  return {
    plugins: [react()],
    server: {
      port: 3000,
      host: 'localhost',
      strictPort: true,
    },
    define: {
      // Expose only the specific key required by the Gemini SDK
      'process.env.API_KEY': JSON.stringify(apiKey),
    }
  };
});