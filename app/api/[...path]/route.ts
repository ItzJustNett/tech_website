import { type NextRequest, NextResponse } from "next/server"

// Make sure we're using the correct API base URL
const API_BASE_URL = "http://139.28.37.39:5000/api"

// Helper function to add CORS headers to the response
function addCorsHeaders(response: Response | NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*")
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  response.headers.set("Access-Control-Max-Age", "86400")
  return response
}

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  // Make sure params is awaited and path is an array before joining
  const pathParams = await Promise.resolve(params.path)
  const path = Array.isArray(pathParams) ? pathParams.join("/") : pathParams
  const url = new URL(request.url)
  const queryString = url.search

  try {
    console.log(`Proxying GET request to: ${API_BASE_URL}/${path}${queryString}`)

    const response = await fetch(`${API_BASE_URL}/${path}${queryString}`, {
      headers: {
        "Content-Type": "application/json",
        // Forward authorization header if present
        ...(request.headers.get("Authorization")
          ? { Authorization: request.headers.get("Authorization") as string }
          : {}),
      },
      cache: "no-store",
      mode: "cors", // Explicitly enable CORS
    })

    // Check if response is JSON
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json()
      return addCorsHeaders(NextResponse.json(data))
    } else {
      // Return text response if not JSON
      const text = await response.text()
      console.log(`Non-JSON response from ${path}:`, text.substring(0, 200))
      const nextResponse = new NextResponse(text, {
        status: response.status,
        headers: {
          "Content-Type": contentType || "text/plain",
        },
      })
      return addCorsHeaders(nextResponse)
    }
  } catch (error) {
    console.error(`Error proxying GET request to /${path}:`, error)
    return addCorsHeaders(NextResponse.json({ error: "Failed to fetch data from API" }, { status: 500 }))
  }
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  // Make sure params is awaited and path is an array before joining
  const pathParams = await Promise.resolve(params.path)
  const path = Array.isArray(pathParams) ? pathParams.join("/") : pathParams

  try {
    const body = await request.json().catch(() => ({}))

    console.log(`Proxying POST request to: ${API_BASE_URL}/${path}`, body)

    const response = await fetch(`${API_BASE_URL}/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Forward authorization header if present
        ...(request.headers.get("Authorization")
          ? { Authorization: request.headers.get("Authorization") as string }
          : {}),
      },
      body: JSON.stringify(body),
      mode: "cors", // Explicitly enable CORS
    })

    // Check if response is JSON
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json()
      return addCorsHeaders(NextResponse.json(data))
    } else {
      // Return text response if not JSON
      const text = await response.text()
      console.log(`Non-JSON response from ${path}:`, text.substring(0, 200))
      const nextResponse = new NextResponse(text, {
        status: response.status,
        headers: {
          "Content-Type": contentType || "text/plain",
        },
      })
      return addCorsHeaders(nextResponse)
    }
  } catch (error) {
    console.error(`Error proxying POST request to /${path}:`, error)
    return addCorsHeaders(NextResponse.json({ error: "Failed to send data to API" }, { status: 500 }))
  }
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  // Make sure params is awaited and path is an array before joining
  const pathParams = await Promise.resolve(params.path)
  const path = Array.isArray(pathParams) ? pathParams.join("/") : pathParams

  try {
    const body = await request.json().catch(() => ({}))
    const response = await fetch(`${API_BASE_URL}/${path}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(request.headers.get("Authorization")
          ? { Authorization: request.headers.get("Authorization") as string }
          : {}),
      },
      body: JSON.stringify(body),
      mode: "cors", // Explicitly enable CORS
    })

    // Check if response is JSON
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json()
      return addCorsHeaders(NextResponse.json(data))
    } else {
      // Return text response if not JSON
      const text = await response.text()
      const nextResponse = new NextResponse(text, {
        status: response.status,
        headers: {
          "Content-Type": contentType || "text/plain",
        },
      })
      return addCorsHeaders(nextResponse)
    }
  } catch (error) {
    console.error(`Error proxying PUT request to /${path}:`, error)
    return addCorsHeaders(NextResponse.json({ error: "Failed to update data on API" }, { status: 500 }))
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  // Make sure params is awaited and path is an array before joining
  const pathParams = await Promise.resolve(params.path)
  const path = Array.isArray(pathParams) ? pathParams.join("/") : pathParams

  try {
    const response = await fetch(`${API_BASE_URL}/${path}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(request.headers.get("Authorization")
          ? { Authorization: request.headers.get("Authorization") as string }
          : {}),
      },
      mode: "cors", // Explicitly enable CORS
    })

    // Check if response is JSON
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json()
      return addCorsHeaders(NextResponse.json(data))
    } else {
      // Return text response if not JSON
      const text = await response.text()
      const nextResponse = new NextResponse(text, {
        status: response.status,
        headers: {
          "Content-Type": contentType || "text/plain",
        },
      })
      return addCorsHeaders(nextResponse)
    }
  } catch (error) {
    console.error(`Error proxying DELETE request to /${path}:`, error)
    return addCorsHeaders(NextResponse.json({ error: "Failed to delete data on API" }, { status: 500 }))
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }))
}

