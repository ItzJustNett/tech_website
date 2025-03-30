import { API_BASE_URL } from "./app.js"

// Login function
async function login(username, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })

    const data = await response.json()

    if (response.ok) {
      // Store token and user info
      localStorage.setItem("token", data.token)
      localStorage.setItem("username", username)
      localStorage.setItem("user_id", data.user_id)

      return { success: true }
    } else {
      return {
        success: false,
        error: data.error || "Login failed",
      }
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      error: "Network error. Please try again.",
    }
  }
}

// Register function
async function register(username, password, email) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, email }),
    })

    const data = await response.json()

    if (response.ok) {
      // Show success message and switch to login tab
      return {
        success: true,
        user_id: data.user_id,
      }
    } else {
      return {
        success: false,
        error: data.error || "Registration failed",
      }
    }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      success: false,
      error: "Network error. Please try again.",
    }
  }
}

// Logout function
async function logout(redirectUrl = null) {
  if (confirm("Are you sure you want to logout?")) {
    try {
      const token = localStorage.getItem("token")
      if (token) {
        // Make API request to logout
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      // Clear localStorage
      localStorage.removeItem("token")
      localStorage.removeItem("username")
      localStorage.removeItem("user_id")

      // Redirect if URL provided
      if (redirectUrl) {
        window.location.href = redirectUrl
      }
    }
  }
}

// Export functions
export { login, register, logout }

