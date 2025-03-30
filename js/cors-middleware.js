// CORS Middleware
function setupCORS(req, res, next) {
  // Allow requests from any origin
  res.setHeader("Access-Control-Allow-Origin", "*")

  // Allow specific HTTP methods
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

  // Allow specific headers
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")

  // Allow credentials
  res.setHeader("Access-Control-Allow-Credentials", "true")

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  // Continue to the next middleware
  next()
}

// Export the middleware
export { setupCORS }

