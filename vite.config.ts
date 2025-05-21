import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), "");
  const googleMapsApiKey = env.GOOGLE_MAPS_API_KEY || "Not set";
  
  console.log(`Building Vite config with env vars: { GOOGLE_MAPS_API_KEY: '${googleMapsApiKey}' }`);
  if (googleMapsApiKey === "Not set") {
    console.warn("GOOGLE_MAPS_API_KEY not found in environment variables");
  }
  
  return {
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
    server: {
      host: "::",
      port: 8080,
      open: false,
    },
    preview: {
      port: 8080
    },
    build: {
      outDir: "dist",
      sourcemap: true
    },
    define: {
      "process.env.GOOGLE_MAPS_API_KEY": JSON.stringify(googleMapsApiKey)
    },
    // Disable automatic scroll restoration
    experimental: {
      renderBuiltUrl(filename, { hostType }) {
        return { relative: true };
      }
    }
  };
});
