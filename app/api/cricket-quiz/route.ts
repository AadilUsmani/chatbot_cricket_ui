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
    const response = await fetch(`${API_CONFIG.baseURL}/cricket-quiz`, {
      method: "GET",
      headers: API_CONFIG.headers,
    })

    if (!response.ok) {
      throw new Error(`Cricket API error: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json({
      quiz: data.quiz ||
        data.response || {
          question: "Which country won the first Cricket World Cup?",
          options: ["England", "Australia", "West Indies", "India"],
          answer: "West Indies",
        },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Cricket Quiz API Error:", error)
    return NextResponse.json(
      {
        error: "Unable to fetch cricket quiz at the moment.",
      },
      { status: 500 },
    )
  }
}
