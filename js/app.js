// Global variables
const API_BASE_URL = "http://149.28.37.39:5000" // External server IP and port

// Setup fetch with authentication
async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem("token")
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`

  if (!token && options.requiresAuth !== false) {
    throw new Error("No authentication token found")
  }

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
  }

  // Add authorization header if token exists
  if (token) {
    defaultOptions.headers["Authorization"] = `Bearer ${token}`
  }

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, mergedOptions)

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("token")
        window.location.href = "index.html"
        throw new Error("Authentication failed")
      }

      const error = await response.json().catch(() => ({ message: "API request failed" }))
      throw new Error(error.message || "API request failed")
    }

    return response.json()
  } catch (error) {
    console.error("API request error:", error)
    throw error
  }
}

// Show notification
function showNotification(message, type = "success") {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.textContent = message

  const container = document.querySelector(".notification-container")
  if (!container) {
    const newContainer = document.createElement("div")
    newContainer.className = "notification-container"
    document.body.appendChild(newContainer)
    newContainer.appendChild(notification)
  } else {
    container.appendChild(notification)
  }

  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.classList.add("fade-out")
    setTimeout(() => {
      notification.parentNode.removeChild(notification)
    }, 500)
  }, 5000)
}

// Export functions and variables
export { API_BASE_URL, fetchWithAuth, showNotification }

