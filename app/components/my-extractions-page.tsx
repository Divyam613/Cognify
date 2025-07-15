"use client"

import type React from "react"
import { useEffect, useState } from "react"
import {
  FileText,
  Trash2,
  Eye,
  MessageCircle,
  Send,
  Key,
  FileTextIcon,
  Calendar,
  Download,
  Copy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Header from "./header"
import Footer from "./footer"

interface MyExtractionsPageProps {
  user: any
  onBack: () => void
  onAuthClick: () => void
  onProfileClick: () => void
  onLogout: () => void
  onNavigate: (page: string) => void
  darkMode: boolean
  onToggleDarkMode: () => void
}

interface Extraction {
  id: string
  title: string
  image: string
  extractedText: string
  keywords: string[]
  createdAt: string
  chatHistory: Array<{ role: "user" | "assistant"; content: string }>
  publicUrl?: string
  accuracy?: "low" | "medium" | "high"
}

export default function MyExtractionsPage({
  user,
  onBack,
  onAuthClick,
  onProfileClick,
  onLogout,
  onNavigate,
  darkMode,
  onToggleDarkMode,
}: MyExtractionsPageProps) {
  const [selectedExtraction, setSelectedExtraction] = useState<Extraction | null>(null)
  const [activeView, setActiveView] = useState<"text" | "keywords">("text")
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([])
  const [chatInput, setChatInput] = useState("")
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [currentAccuracy, setCurrentAccuracy] = useState<"low" | "medium" | "high">("medium")
  const [extractions, setExtractions] = useState<Extraction[]>([])

  useEffect(() => {
    const fetchExtractions = async () => {
      console.log("Fetching extractions for user:", user.accessToken)
      if (!user) return
      try {
        const response = await fetch("http://20.121.113.248:8000/api/user-sessions/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          },
        })
        if (!response.ok) {
          throw new Error(`Failed to fetch sessions: ${response.status}`)
        }
        const data = await response.json()
        const transformed = data.map((item: any): Extraction => ({
          id: `session-${item.id}`,
          title: JSON.parse(item.session_name),
          image: item.pdf_image_urls?.[0] || "/placeholder.svg?height=200&width=300",
          extractedText: item.document_embeddings,
          keywords: item.session_keywords?.split("  \n").map((kw: string) => kw.trim()).filter(Boolean) || [],
          createdAt: item.last_activity,
          chatHistory: [],
        }))
        setExtractions(transformed)
      } catch (err) {
        console.error("Failed to fetch extractions:", err)
      }
    }
    fetchExtractions()
  }, [user])

  const handleAccuracyChange = (newAccuracy: "low" | "medium" | "high") => {
    if (!selectedExtraction) return
    setCurrentAccuracy(newAccuracy)
    setSelectedExtraction({ ...selectedExtraction, accuracy: newAccuracy })
  }

  const deleteExtraction = (id: string) => {
    alert("This is a sample extraction. In the real app, this would delete the extraction from your account.")
  }

  const openExtraction = (extraction: Extraction) => {
    setSelectedExtraction(extraction)
    setChatMessages(extraction.chatHistory || [])
    setActiveView("text")
    setCurrentAccuracy(extraction.accuracy || "medium")
  }

  const closeExtraction = () => {
    setSelectedExtraction(null)
    setIsChatOpen(false)
    setChatMessages([])
  }

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim() || !selectedExtraction) return
    const userMessage = { role: "user" as const, content: chatInput }
    const newMessages = [...chatMessages, userMessage]
    setChatMessages(newMessages)
    setChatInput("")
    setIsChatLoading(true)
    setTimeout(() => {
      const assistantMessage = {
        role: "assistant" as const,
        content: `I understand you're asking about "${chatInput}". This is a demo response based on your notes: ${selectedExtraction.title}.`,
      }
      const finalMessages = [...newMessages, assistantMessage]
      setChatMessages(finalMessages)
      setIsChatLoading(false)
    }, 1500)
  }

  const copyToClipboard = () => {
    if (!selectedExtraction) return
    const textToCopy = activeView === "text" ? selectedExtraction.extractedText : selectedExtraction.keywords.join(", ")
    navigator.clipboard.writeText(textToCopy)
    alert("Copied to clipboard!")
  }

  const downloadText = () => {
    if (!selectedExtraction) return
    const textToDownload = activeView === "text" ? selectedExtraction.extractedText : selectedExtraction.keywords.join("\n")
    const blob = new Blob([textToDownload], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${selectedExtraction.title}-${activeView === "text" ? "notes" : "keywords"}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Show sign-in required message if user is not authenticated
  if (!user) {
    return (
      <div
        className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100"} flex flex-col`}
      >
        <Header
          user={user}
          onAuthClick={onAuthClick}
          onProfileClick={onProfileClick}
          onLogout={onLogout}
          onNavigate={onNavigate}
          darkMode={darkMode}
          onToggleDarkMode={onToggleDarkMode}
        />
        <div className="container mx-auto px-4 py-8 flex-1 flex items-center justify-center">
          <Card className={`max-w-md ${darkMode ? "bg-gray-800/70" : "bg-white/70"} backdrop-blur-sm`}>
            <CardContent className="p-8 text-center">
              <FileText
                className={`h-16 w-16 mx-auto mb-6 ${darkMode ? "text-gray-400" : "text-gray-500"} opacity-50`}
              />
              <h3 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
                Sign In Required
              </h3>
              <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"} mb-6`}>
                Please sign in to view and manage your note extractions.
              </p>
              <Button
                onClick={onAuthClick}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3"
                size="lg"
              >
                Sign In Now
              </Button>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} mt-4`}>
                Don't have an account? Sign up to get started!
              </p>
            </CardContent>
          </Card>
        </div>
        <Footer darkMode={darkMode} />
      </div>
    )
  }

  // Show detailed view if an extraction is selected
  if (selectedExtraction) {
    return (
      <div
        className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100"} flex flex-col`}
      >
        <Header
          user={user}
          onAuthClick={onAuthClick}
          onProfileClick={onProfileClick}
          onLogout={onLogout}
          onNavigate={onNavigate}
          darkMode={darkMode}
          onToggleDarkMode={onToggleDarkMode}
        />

        <main className="container mx-auto px-4 py-8 flex-1">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <Button
                  variant="ghost"
                  onClick={closeExtraction}
                  className={`mb-4 ${darkMode ? "text-purple-400 hover:text-purple-300" : "text-purple-600 hover:text-purple-700"}`}
                >
                  ← Back to My Extractions
                </Button>
                <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                  {selectedExtraction.title}
                </h1>
                <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} flex items-center gap-2 mt-2`}>
                  <Calendar className="h-4 w-4" />
                  {new Date(selectedExtraction.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <Card className={`${darkMode ? "bg-gray-800/70" : "bg-white/70"} backdrop-blur-sm`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className={`flex items-center gap-2 ${darkMode ? "text-white" : ""}`}>
                        <FileText className="h-6 w-6 text-blue-600" />
                        Extracted Content
                      </CardTitle>

                      <div className="flex items-center gap-2">
                        <Button
                          variant={activeView === "text" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setActiveView("text")}
                          className={activeView === "text" ? "bg-blue-600 hover:bg-blue-700" : ""}
                        >
                          <FileTextIcon className="h-4 w-4 mr-2" />
                          Notes
                        </Button>
                        <Button
                          variant={activeView === "keywords" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setActiveView("keywords")}
                          className={activeView === "keywords" ? "bg-purple-600 hover:bg-purple-700" : ""}
                        >
                          <Key className="h-4 w-4 mr-2" />
                          Keywords
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {activeView === "text" ? (
                        <Textarea
                          value={selectedExtraction.extractedText}
                          readOnly
                          className={`min-h-[500px] resize-none text-base leading-relaxed ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-blue-200"}`}
                        />
                      ) : (
                        <div
                          className={`min-h-[500px] p-4 border rounded-lg ${darkMode ? "bg-gray-700 border-gray-600" : "border-purple-200"}`}
                        >
                          <div className="flex flex-wrap gap-2">
                            {selectedExtraction.keywords.map((keyword, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="bg-purple-100 text-purple-700 text-sm py-1 px-3"
                              >
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-4 justify-center flex-wrap">
                        <Button
                          onClick={copyToClipboard}
                          variant="outline"
                          className={`${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-blue-300 text-blue-600 hover:bg-blue-50"}`}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy {activeView === "text" ? "Text" : "Keywords"}
                        </Button>
                        <Button
                          onClick={downloadText}
                          variant="outline"
                          className={`${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-blue-300 text-blue-600 hover:bg-blue-50"}`}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar with Image and Chat */}
              <div className="space-y-6">
                {/* Accuracy Controls */}
                <Card className={`${darkMode ? "bg-gray-800/70" : "bg-white/70"} backdrop-blur-sm`}>
                  <CardHeader>
                    <CardTitle className={`text-lg ${darkMode ? "text-white" : ""}`}>Accuracy Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          Current: {currentAccuracy.charAt(0).toUpperCase() + currentAccuracy.slice(1)}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          variant={currentAccuracy === "low" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleAccuracyChange("low")}
                          className={`w-full ${currentAccuracy === "low" ? "bg-red-500 text-white" : "text-gray-600"}`}
                        >
                          Low Accuracy
                        </Button>
                        <Button
                          variant={currentAccuracy === "medium" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleAccuracyChange("medium")}
                          className={`w-full ${currentAccuracy === "medium" ? "bg-yellow-500 text-white" : "text-gray-600"}`}
                        >
                          Medium Accuracy
                        </Button>
                        <Button
                          variant={currentAccuracy === "high" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleAccuracyChange("high")}
                          className={`w-full ${currentAccuracy === "high" ? "bg-green-500 text-white" : "text-gray-600"}`}
                        >
                          High Accuracy
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Chat Section */}
                <Card className={`${darkMode ? "bg-gray-800/70" : "bg-white/70"} backdrop-blur-sm`}>
                  <CardHeader>
                    <CardTitle className={`text-lg ${darkMode ? "text-white" : ""}`}>Chat about these notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 flex flex-col">
                      <div className="flex-1 overflow-y-auto space-y-3 mb-4 p-2 border rounded-lg">
                        {chatMessages.length === 0 && (
                          <div className={`text-center ${darkMode ? "text-gray-400" : "text-gray-500"} py-8`}>
                            <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Ask me anything about these notes!</p>
                          </div>
                        )}
                        {chatMessages.map((message, index) => (
                          <div
                            key={index}
                            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[85%] p-2 rounded-lg text-sm ${message.role === "user"
                                ? "bg-blue-600 text-white"
                                : darkMode
                                  ? "bg-gray-700 text-gray-100"
                                  : "bg-gray-100 text-gray-900"
                                }`}
                            >
                              {message.content}
                            </div>
                          </div>
                        ))}
                        {isChatLoading && (
                          <div className="flex justify-start">
                            <div className={`p-2 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                              <div className="flex space-x-1">
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                                <div
                                  className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.1s" }}
                                ></div>
                                <div
                                  className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.2s" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <form onSubmit={handleChatSubmit} className="flex gap-2">
                        <Input
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder="Ask about these notes..."
                          className={`flex-1 text-sm ${darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}`}
                          disabled={isChatLoading}
                        />
                        <Button
                          type="submit"
                          size="icon"
                          disabled={!chatInput.trim() || isChatLoading}
                          className="bg-blue-600 hover:bg-blue-700 h-9 w-9"
                        >
                          <Send className="h-3 w-3" />
                        </Button>
                      </form>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>

        <Footer darkMode={darkMode} />
      </div>
    )
  }

  // Main extractions list view
  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100"} flex flex-col`}
    >
      <Header
        user={user}
        onAuthClick={onAuthClick}
        onProfileClick={onProfileClick}
        onLogout={onLogout}
        onNavigate={onNavigate}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
      />

      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              My Extractions
            </h1>
            <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"} max-w-2xl mx-auto`}>
              View and manage all your previous note extractions. Click on any card to view details and chat about your
              notes.
            </p>
          </div>

          {/* Demo Notice */}
          <Alert className="mb-8 border-blue-200 bg-blue-50">
            <AlertDescription className="text-blue-800">
              <strong>Demo Mode:</strong> These are sample extractions to show how the feature works. When you connect
              your backend API, your real extractions will appear here.
            </AlertDescription>
          </Alert>

          {/* Sample Extractions Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
            {extractions.map((extraction, index) => (
              <Card
                key={extraction.id}
                className={`group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 ${darkMode ? "bg-gray-800/70" : "bg-white/70"} backdrop-blur-sm`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-0">
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <img
                      src={extraction.image || "/placeholder.svg"}
                      alt={extraction.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>
                  <div className="p-4">
                    <h3
                      className={`font-semibold text-lg mb-2 line-clamp-2 ${darkMode ? "text-white" : "text-gray-800"}`}
                    >
                      {extraction.title}
                    </h3>
                    <p
                      className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mb-4 flex items-center gap-2`}
                    >
                      <Calendar className="h-4 w-4" />
                      {new Date(extraction.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => openExtraction(extraction)}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteExtraction(extraction.id)
                          }}
                          variant="outline"
                          size="sm"
                          className={`${darkMode ? "border-red-600 text-red-400 hover:bg-red-600 hover:text-white" : "border-red-300 text-red-600 hover:bg-red-50"}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                        {extraction.keywords.length} keywords
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <Card className={`mt-12 ${darkMode ? "bg-gray-800/70" : "bg-white/70"} backdrop-blur-sm`}>
            <CardContent className="p-8 text-center">
              <h3 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
                Ready to Create Your Own Extractions?
              </h3>
              <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"} mb-6`}>
                Upload your handwritten notes or documents and let our AI extract the text for you.
              </p>
              <Button
                onClick={() => onNavigate("adhd")}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                size="lg"
              >
                Start Extracting Notes
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer darkMode={darkMode} />
    </div>
  )
}
