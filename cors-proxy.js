// This is a simple CORS proxy server for local development
const express = require("express")
const cors = require("cors")
const { createProxyMiddleware } = require("http-proxy-middleware")

const app = express()
const PORT = process.env.PORT || 3001

// Enable CORS for all routes
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

// Proxy API requests to the external server
app.use(
  "/api",
  createProxyMiddleware({
    target: "http://139.28.37.39:5000",
    changeOrigin: true,
    pathRewrite: {
      "^/api": "/api", // Keep /api prefix when forwarding
    },
    onProxyReq: (proxyReq, req, res) => {
      // Add any headers needed for the proxy request
      if (req.headers.authorization) {
        proxyReq.setHeader("Authorization", req.headers.authorization)
      }
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
  console.log(`CORS Proxy Server running on port ${PORT}`)
  console.log(`Use http://localhost:${PORT}/api/... to access the API`)
})

