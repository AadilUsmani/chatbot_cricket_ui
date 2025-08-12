import { type NextRequest, NextResponse } from "next/server"

const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://cricket-chatbot-fyty.onrender.com",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "363de2d67a4682ccad32f87a398973014e499edc9ee82dca4f9c3ed6e6bf3829",
  },
}

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}/quick-fact`, {
      method: "GET",
      headers: API_CONFIG.headers,
    })

    if (!response.ok) {
      throw new Error(`Cricket API error: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json({
      fact: data.fact || data.response || "Cricket is played in over 100 countries worldwide!",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Quick Fact API Error:", error)
    return NextResponse.json(
      {
        error: "Unable to fetch cricket fact at the moment.",
      },
      { status: 500 },
    )
  }
}
