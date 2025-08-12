import { type NextRequest, NextResponse } from "next/server"

const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://cricket-chatbot-fyty.onrender.com",
  apiKey: process.env.NEXT_PUBLIC_API_KEY || "363de2d67a4682ccad32f87a398973014e499edc9ee82dca4f9c3ed6e6bf3829",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "363de2d67a4682ccad32f87a398973014e499edc9ee82dca4f9c3ed6e6bf3829",
  },
}

export async function POST(request: NextRequest) {
  try {
    const { question, query_type = "general" } = await request.json()

    if (!question || typeof question !== "string") {
      return NextResponse.json({ error: "Question is required and must be a string" }, { status: 400 })
    }

    const response = await fetch(`${API_CONFIG.baseURL}/ask`, {
      method: "POST",
      headers: API_CONFIG.headers,
      body: JSON.stringify({
        question: question.trim(),
        query_type: query_type,
      }),
    })

    if (!response.ok) {
      // Handle rate limiting specifically
      if (response.status === 429) {
        return NextResponse.json(
          {
            error: "Rate limit exceeded. Please wait a moment before asking another question.",
            rateLimited: true,
          },
          { status: 429 },
        )
      }

      throw new Error(`Cricket API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    return NextResponse.json({
      response: data.response || data.answer || "I couldn't find an answer to that cricket question.",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Cricket API Error:", error)

    // Provide cricket-themed error messages
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"

    if (errorMessage.includes("fetch")) {
      return NextResponse.json(
        {
          error: "Unable to connect to the cricket knowledge base. Please check your connection and try again.",
        },
        { status: 503 },
      )
    }

    return NextResponse.json(
      {
        error: "The cricket AI is temporarily unavailable. Please try again in a moment.",
      },
      { status: 500 },
    )
  }
}
