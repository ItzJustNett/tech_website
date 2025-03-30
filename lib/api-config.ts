// Use direct API URL for requests
import { createApiUrl } from "./cors-utils"

export const API_BASE_URL = "http://139.28.37.39:5000/api"

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  // Get token from localStorage on client side only
  let token = ""
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token") || ""
  }

  // Make sure endpoint has the correct format
  const apiEndpoint = createApiUrl(endpoint)

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    ...options.headers,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  try {
    console.log(`Fetching: ${apiEndpoint}`)
    console.log("Request options:", {
      method: options.method || "GET",
      headers,
      body: options.body ? JSON.parse(options.body as string) : undefined,
    })

    const response = await fetch(apiEndpoint, {
      ...options,
      headers,
      mode: "cors",
    })

    // Check if the response is ok (status in the range 200-299)
    if (!response.ok) {
      if (response.status === 401 && typeof window !== "undefined") {
        // Token expired or invalid
        localStorage.removeItem("token")
        window.location.href = "/login"
        throw new Error("Authentication failed")
      }

      // Try to get error message from response
      let errorMessage = "API request failed"
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorData.error || `API request failed with status: ${response.status}`
      } catch (e) {
        // If we can't parse JSON, use text or status
        try {
          errorMessage = (await response.text()) || `API request failed with status: ${response.status}`
        } catch (textError) {
          errorMessage = `API request failed with status: ${response.status}`
        }
      }

      throw new Error(errorMessage)
    }

    // Try to parse as JSON, fall back to text if not JSON
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      return await response.json()
    } else {
      const text = await response.text()
      try {
        return JSON.parse(text)
      } catch (e) {
        return { text }
      }
    }
  } catch (error) {
    console.error("API request error:", error)
    throw error
  }
}

