/**
 * Utility functions for handling CORS in API requests
 */

// Standard CORS headers to include in requests
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

// Function to add CORS headers to fetch options
export function addCorsToFetchOptions(options: RequestInit = {}): RequestInit {
  return {
    ...options,
    mode: "cors",
    headers: {
      ...corsHeaders,
      ...(options.headers || {}),
    },
  }
}

// Function to create a URL with the correct API base
export function createApiUrl(endpoint: string): string {
  const API_BASE_URL = "http://139.28.37.39:5000/api"

  // Handle different endpoint formats
  if (endpoint.startsWith("http")) {
    return endpoint
  } else if (endpoint.startsWith("/api")) {
    return `http://139.28.37.39:5000${endpoint.substring(4)}`
  } else {
    return `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`
  }
}

// Function to handle CORS preflight for OPTIONS requests
export function handleCorsPreflightResponse(): Response {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  })
}

