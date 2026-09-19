// Central config — all API calls go through this base URL
// In production (Vercel), set VITE_API_BASE_URL env var to your Render backend URL
// e.g. https://your-app.onrender.com
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
