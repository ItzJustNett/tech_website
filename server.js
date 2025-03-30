import express from "express"
import { createProxyMiddleware } from "http-proxy-middleware"
import cors from "cors"

const app = express()
const PORT = process.env.PORT || 3000

// Enable CORS for all routes
app.use(cors())

// Serve static files
app.use(express.static("./"))

// Proxy API requests to the external server
app.use(
  "/api",
  createProxyMiddleware({
    target: "http://149.28.37.39:5000",
    changeOrigin: true,
    pathRewrite: {
      "^/api": "", // Remove /api prefix when forwarding
    },
    onProxyRes: (proxyRes, req, res) => {
      // Add CORS headers to the proxied response
      proxyRes.headers["Access-Control-Allow-Origin"] = "*"
      proxyRes.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
      proxyRes.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    },
  }),
)

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

