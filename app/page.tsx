"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Send, Trophy, User, Bot, Moon, Sun, Lightbulb, HelpCircle, Smile } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

export default function CricketChatbot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentQuestion, setCurrentQuestion] = useState("")
  const [queryType, setQueryType] = useState("general")
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const sampleQuestions = [
    {
      title: "Cricket Rules",
      question: "What is the LBW rule in cricket?",
      icon: "📏",
    },
    {
      title: "Player Stats",
      question: "Tell me about Virat Kohli's career highlights",
      icon: "🏏",
    },
    {
      title: "Game Formats",
      question: "What's the difference between Test and ODI cricket?",
      icon: "⏱️",
    },
    {
      title: "Scoring System",
      question: "How is cricket scoring calculated?",
      icon: "📊",
    },
    {
      title: "Field Positions",
      question: "What are the basic cricket fielding positions?",
      icon: "🎯",
    },
    {
      title: "Records",
      question: "Who holds the record for most runs in Test cricket?",
      icon: "🏆",
    },
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const hasMessages = messages.length > 0

  const handleQuickAction = async (action: "fact" | "joke" | "quiz") => {
    setIsLoading(true)
    setIsTyping(true)

    try {
      const endpoint =
        action === "fact" ? "/api/quick-fact" : action === "joke" ? "/api/cricket-joke" : "/api/cricket-quiz"
      const res = await fetch(endpoint, { method: "GET", headers: { "Content-Type": "application/json" } })

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      const data = await res.json()

      setTimeout(() => {
        const content =
          action === "fact"
            ? data.fact
            : action === "joke"
              ? data.joke
              : typeof data.quiz === "string"
                ? data.quiz
                : `${data.quiz.question}\n\nOptions:\n${data.quiz.options?.map((opt: string, i: number) => `${i + 1}. ${opt}`).join("\n")}`

        const aiMessage: Message = {
          id: Date.now().toString(),
          content: content || "Sorry, couldn't fetch that right now!",
          sender: "ai",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, aiMessage])
        setIsTyping(false)
      }, 1000)
    } catch (err) {
      setTimeout(() => {
        const errorMessage: Message = {
          id: Date.now().toString(),
          content: `Oops! Couldn't fetch that cricket ${action}. Please try again!`,
          sender: "ai",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
        setIsTyping(false)
      }, 1000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentQuestion.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: currentQuestion.trim(),
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setCurrentQuestion("")
    setIsLoading(true)
    setIsTyping(true)

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMessage.content, query_type: queryType }),
      })

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      const data = await res.json()

      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response || "Sorry, I couldn't process that question. Please try again!",
          sender: "ai",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiMessage])
        setIsTyping(false)
      }, 1000)
    } catch (err) {
      setTimeout(() => {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `Oops! Something went wrong. Please try asking again!`,
          sender: "ai",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
        setIsTyping(false)
      }, 1000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSampleQuestion = (question: string) => {
    setCurrentQuestion(question)
    inputRef.current?.focus()
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-green-900 to-gray-800"
          : "bg-gradient-to-br from-green-50 via-emerald-50 to-green-100"
      }`}
    >
      <header
        className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
          isDarkMode
            ? "bg-gray-900/95 border-gray-700 backdrop-blur-sm"
            : "bg-white/95 border-green-200 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Trophy className={`h-8 w-8 ${isDarkMode ? "text-amber-400" : "text-amber-500"}`} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-green-800"}`}>
                Cricket AI Assistant
              </h1>
              <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-green-600"}`}>Your cricket companion</p>
            </div>
          </div>

          <Button
            onClick={() => setIsDarkMode(!isDarkMode)}
            variant="ghost"
            size="sm"
            className={`rounded-full p-2 transition-colors ${
              isDarkMode ? "hover:bg-gray-800 text-gray-300" : "hover:bg-green-100 text-green-700"
            }`}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto h-[calc(100vh-80px)] flex flex-col">
        {!hasMessages && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
            <div className="text-center space-y-4">
              <div className="relative">
                <div
                  className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
                    isDarkMode ? "bg-green-800" : "bg-green-100"
                  }`}
                >
                  <Trophy className={`h-10 w-10 ${isDarkMode ? "text-green-400" : "text-green-600"}`} />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-orange-400 to-red-500 rounded-full"></div>
              </div>
              <h2 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-green-800"}`}>
                Welcome to Cricket AI
              </h2>
              <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-green-600"} max-w-md`}>
                Ask me anything about cricket - from rules and stats to player histories and match analysis!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
              {sampleQuestions.map((item, index) => (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
                      : "bg-white border-green-200 hover:bg-green-50"
                  }`}
                  onClick={() => handleSampleQuestion(item.question)}
                >
                  <CardContent className="p-4 text-center space-y-3">
                    <div className="text-2xl">{item.icon}</div>
                    <h3 className={`font-semibold ${isDarkMode ? "text-white" : "text-green-800"}`}>{item.title}</h3>
                    <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-green-600"}`}>{item.question}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                onClick={() => handleQuickAction("fact")}
                disabled={isLoading}
                className={`${isDarkMode ? "bg-green-700 hover:bg-green-600" : "bg-green-600 hover:bg-green-700"} text-white`}
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Quick Fact
              </Button>
              <Button
                onClick={() => handleQuickAction("joke")}
                disabled={isLoading}
                className={`${isDarkMode ? "bg-orange-700 hover:bg-orange-600" : "bg-orange-600 hover:bg-orange-700"} text-white`}
              >
                <Smile className="h-4 w-4 mr-2" />
                Cricket Joke
              </Button>
              <Button
                onClick={() => handleQuickAction("quiz")}
                disabled={isLoading}
                className={`${isDarkMode ? "bg-blue-700 hover:bg-blue-600" : "bg-blue-600 hover:bg-blue-700"} text-white`}
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Cricket Quiz
              </Button>
            </div>
          </div>
        )}

        {hasMessages && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    message.sender === "user"
                      ? isDarkMode
                        ? "bg-green-700 text-white"
                        : "bg-green-600 text-white"
                      : isDarkMode
                        ? "bg-gray-800 text-gray-100 border border-gray-700"
                        : "bg-white text-green-800 border border-green-200 shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {message.sender === "ai" && (
                      <Bot
                        className={`h-5 w-5 mt-0.5 flex-shrink-0 ${isDarkMode ? "text-green-400" : "text-green-600"}`}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="whitespace-pre-wrap break-words">{message.content}</p>
                      <p
                        className={`text-xs mt-2 ${
                          message.sender === "user" ? "text-green-100" : isDarkMode ? "text-gray-400" : "text-green-500"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                    {message.sender === "user" && <User className="h-5 w-5 mt-0.5 text-green-100 flex-shrink-0" />}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div
                  className={`rounded-2xl p-4 max-w-[80%] ${
                    isDarkMode
                      ? "bg-gray-800 text-gray-100 border border-gray-700"
                      : "bg-white text-green-800 border border-green-200 shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Bot className={`h-5 w-5 ${isDarkMode ? "text-green-400" : "text-green-600"}`} />
                    <div className="flex space-x-1">
                      <div
                        className={`w-2 h-2 rounded-full animate-bounce ${
                          isDarkMode ? "bg-green-400" : "bg-green-500"
                        }`}
                      ></div>
                      <div
                        className={`w-2 h-2 rounded-full animate-bounce ${
                          isDarkMode ? "bg-green-400" : "bg-green-500"
                        }`}
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className={`w-2 h-2 rounded-full animate-bounce ${
                          isDarkMode ? "bg-green-400" : "bg-green-500"
                        }`}
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-green-600"}`}>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        <div
          className={`sticky bottom-0 border-t p-4 ${
            isDarkMode
              ? "bg-gray-900/95 border-gray-700 backdrop-blur-sm"
              : "bg-white/95 border-green-200 backdrop-blur-sm"
          }`}
        >
          <div className="max-w-4xl mx-auto space-y-3">
            {/* Query type selector */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-green-700"}`}>Topic:</span>
              <Select value={queryType} onValueChange={setQueryType}>
                <SelectTrigger
                  className={`w-40 ${
                    isDarkMode ? "border-gray-600 bg-gray-800 text-gray-100" : "border-green-200 focus:border-green-400"
                  }`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="rules">Rules</SelectItem>
                  <SelectItem value="players">Players</SelectItem>
                  <SelectItem value="history">History</SelectItem>
                  <SelectItem value="statistics">Statistics</SelectItem>
                  <SelectItem value="techniques">Techniques</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Input form */}
            <form onSubmit={handleSubmit} className="flex gap-3">
              <Input
                ref={inputRef}
                placeholder="Ask me anything about cricket..."
                value={currentQuestion}
                onChange={(e) => setCurrentQuestion(e.target.value)}
                className={`flex-1 rounded-full px-6 py-3 ${
                  isDarkMode
                    ? "border-gray-600 bg-gray-800 text-gray-100 placeholder:text-gray-400"
                    : "border-green-200 focus:border-green-400 focus:ring-green-400"
                }`}
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={isLoading || !currentQuestion.trim()}
                className={`rounded-full px-6 py-3 ${
                  isDarkMode ? "bg-green-700 hover:bg-green-600" : "bg-green-600 hover:bg-green-700"
                } text-white`}
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
