"use client"

import type React from "react"
require('dotenv').config();
import { useState, useEffect } from "react"
import {
  Upload,
  FileText,
  Sparkles,
  Brain,
  Download,
  Copy,
  Trash2,
  MessageCircle,
  X,
  Send,
  Key,
  FileTextIcon,
  File,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Header from "./header"
import Footer from "./footer"
import { Client, Storage, ID, Permission, Role } from 'appwrite';



interface ADHDPageProps {
  user: any
  onBack: () => void
  onAuthClick: () => void
  onProfileClick: () => void
  onLogout: () => void
  onNavigate: (page: string) => void
  darkMode: boolean
  onToggleDarkMode: () => void
}

interface ExtractionResult {
  id?: string
  extractedText: string
  keywords: string[]
  chatHistory: Array<{ role: "user" | "assistant"; content: string }>
  accuracy?: "low" | "medium" | "high"
  publicUrl?: string
}

export default function ADHDPage({
  user,
  onBack,
  onAuthClick,
  onProfileClick,
  onLogout,
  onNavigate,
  darkMode,
  onToggleDarkMode,
}: ADHDPageProps) {
  const [accuracy, setAccuracy] = useState<"low" | "medium" | "high">("medium")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [extractionResult, setExtractionResult] = useState<ExtractionResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [activeView, setActiveView] = useState<"text" | "keywords">("text")
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([])
  const [chatInput, setChatInput] = useState("")
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [fileType, setFileType] = useState<"image" | "pdf" | null>(null)
  const [publicUrl, setpublicUrl] = useState("")

  useEffect(() => {
    // Check if there's a file from home page upload
    const storedFile = sessionStorage.getItem("uploadedFile")
    if (storedFile) {
      const fileData = JSON.parse(storedFile)
      // Create a File object from the stored data
      fetch(fileData.data)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], fileData.name, { type: fileData.type })
          setSelectedFile(file)
          setPreviewUrl(fileData.data)
          setFileType(file.type.startsWith("image/") ? "image" : "pdf")
          // Auto-start extraction
          if (user) {
            handleTextExtraction(file)
          }
        })
      // Clear the stored file
      sessionStorage.removeItem("uploadedFile")
    }
  }, [user])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file size (50MB limit)
      const maxSize = 50 * 1024 * 1024 // 50MB in bytes
      if (file.size > maxSize) {
        alert("File size must be less than 50MB")
        return
      }

      // Check file type (images and PDFs)
      const isImage = file.type.startsWith("image/")
      const isPDF = file.type === "application/pdf"

      if (!isImage && !isPDF) {
        alert("Please select an image file (PNG, JPG, JPEG) or PDF file")
        return
      }

      setSelectedFile(file)
      setFileType(isImage ? "image" : "pdf")

      if (isImage) {
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
      } else {
        setPreviewUrl(null) // PDFs don't have preview
      }

      setExtractionResult(null)
      setChatMessages([])

      // Auto-start extraction when file is selected
      if (user) {
        handleTextExtraction(file)
      }
    }
  }


  const handleTextExtraction = async (file: File, selectedAccuracy: string = accuracy) => {
    if (!user) return

    setIsProcessing(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 seconds timeout

    try {

      // Step 1: Upload file to get public URL (you'll need to implement this)
      const formData = new FormData()
      formData.append("file", file)

      const client = new Client()
        .setEndpoint("https://fra.cloud.appwrite.io/v1") // Replace with your Appwrite endpoint
        .setProject("685d78c7002e37b728f0") // Replace with your project ID

      const storage = new Storage(client);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 seconds timeout

      try {
        // Upload the file to a public bucket
        const uploadedFile = await storage.createFile(
          "685d7903000bc04300b5", // Replace with your bucket ID
          ID.unique(),
          file,
          [
            Permission.read(Role.any()) // Make the file publicly readable
          ]
        );

        const public_url = `https://fra.cloud.appwrite.io/v1/storage/buckets/685d7903000bc04300b5/files/${uploadedFile.$id}/view?project=685d78c7002e37b728f0`;
        setpublicUrl(public_url);

        console.log("public_url", public_url);

      } catch (error) {
        console.error('Upload failed:', error);
        throw error;
      }


      // TODO: Replace with your file upload endpoint to get public URL
      // const uploadResponse = await fetch("http://127.0.0.1:8000/api/upload-file/", {
      //   method: "POST",
      //   headers: {
      //     Authorization: `Bearer ${user.accessToken}`,
      //   },
      //   body: formData,
      // })

      // if (!uploadResponse.ok) {
      //   throw new Error(`Upload failed: ${uploadResponse.status}`)
      // }

      // const uploadData = await uploadResponse.json()
      // const publicUrl = uploadData.public_url || uploadData.url

      // Step 2: Create user session with the new API
      console.log("token", user.accessToken)
      const sessionResponse = await fetch("http://20.121.113.248:8000/api/user-sessions/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify({
          pdf_public_url: publicUrl,
          specifications: {
            Accuracy: selectedAccuracy,
            text_highlight: "true",
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      // console.log("sessionResponse", sessionResponse.json());

      if (!sessionResponse.ok) {
        throw new Error(`Session creation failed: ${sessionResponse.status}`)
      }

      const sessionData = await sessionResponse.json()
      console.log("sessionData", sessionData)

      // Validate the response structure
      // if (!sessionData || typeof sessionData.extracted_text !== "string" || !Array.isArray(sessionData.keywords)) {
      //   throw new Error("Invalid response format from server")
      // }

      const result = {
        id: sessionData.id || sessionData.session_id || Date.now().toString(),
        extractedText: sessionData.document_embeddings,
        keywords: sessionData.session_keywords,
        // chatHistory: sessionData.chat_history || [],
        // accuracy: selectedAccuracy,
        // publicUrl: publicUrl,
      }

      setExtractionResult(result)
    } catch (error) {
      console.error("Error extracting text:", error)
      // Fallback to demo data when API is not available
      simulateTextExtraction()
    } finally {
      setIsProcessing(false)
    }
  }

  const handleAccuracyChange = async (newAccuracy: "low" | "medium" | "high") => {
    if (!extractionResult || !selectedFile) return

    setAccuracy(newAccuracy)
    await handleTextExtraction(selectedFile, newAccuracy)
  }

  const simulateTextExtraction = () => {
    setTimeout(() => {
      const sampleText =
        fileType === "pdf"
          ? extractionResult?.extractedText : extractionResult?.extractedText

      const sampleKeywords =
        fileType === "pdf"
          ? [
            "Research Methods",
            "Psychology",
            "Experimental Research",
            "Correlational Research",
            "Observational Research",
            "Survey Research",
            "Variables",
            "Random Assignment",
            "Causation",
            "Statistical Analysis",
            "Ethical Guidelines",
            "Informed Consent",
            "Descriptive Statistics",
            "Inferential Statistics",
            "Effect Size",
          ]
          : [
            "Photosynthesis",
            "Chloroplasts",
            "Thylakoids",
            "Calvin cycle",
            "Chlorophyll",
            "ATP",
            "NADPH",
            "Light reactions",
            "Dark reactions",
            "Glucose",
            "Oxygen",
            "Carbon dioxide",
            "Water",
            "Light energy",
            "Stroma",
          ]

      // setExtractionResult({
      //   // id: "demo-" + Date.now(),
      //   extractedText: sampleText,
      //   keywords: sampleKeywords,
      //   chatHistory: [],
      //   accuracy: "medium",
      // })

      setIsProcessing(false)
    }, 2000)
  }

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim() || !extractionResult) return

    const userMessage = { role: "user" as const, content: chatInput }
    const newMessages = [...chatMessages, userMessage]
    setChatMessages(newMessages)
    setChatInput("")
    setIsChatLoading(true)

    try {
      // TODO: Replace with your actual chatbot API endpoint
      const response = await fetch("https://your-backend-api.com/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify({
          message: chatInput,
          extractionId: extractionResult.id,
          context: extractionResult.extractedText,
          userId: user.id,
          history: chatMessages,
        }),
      })

      if (!response.ok) {
        throw new Error(`Chat API failed: ${response.status}`)
      }

      const data = await response.json()

      if (!data || typeof data.response !== "string") {
        throw new Error("Invalid chat response format")
      }

      const assistantMessage = { role: "assistant" as const, content: data.response }
      const finalMessages = [...newMessages, assistantMessage]
      setChatMessages(finalMessages)

      // Update extraction with new chat history in backend
      // TODO: Replace with your actual update chat history API endpoint
      await fetch(`https://your-backend-api.com/api/update-chat-history/${extractionResult.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify({
          chatHistory: finalMessages,
          userId: user.id,
        }),
      })
    } catch (error) {
      console.error("Error in chat:", error)
      // Fallback response
      const assistantMessage = {
        role: "assistant" as const,
        content: `I understand you're asking about "${chatInput}". Based on your ${fileType === "pdf" ? "PDF document" : "notes"}, I can help explain the concepts. Could you be more specific about what you'd like to know?`,
      }
      setChatMessages([...newMessages, assistantMessage])
    } finally {
      setIsChatLoading(false)
    }
  }

  const clearAll = () => {
    setSelectedFile(null)
    setExtractionResult(null)
    setPreviewUrl(null)
    setFileType(null)
    setChatMessages([])
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
  }

  const copyToClipboard = () => {
    const textToCopy =
      activeView === "text" ? extractionResult?.extractedText || "" : extractionResult?.keywords.join(", ") || ""
    navigator.clipboard.writeText(textToCopy)
  }

  const downloadText = () => {
    const textToDownload =
      activeView === "text" ? extractionResult?.extractedText || "" : extractionResult?.keywords.join("\n") || ""
    const blob = new Blob([textToDownload], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${activeView === "text" ? "extracted-text" : "keywords"}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

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
        {/* Hero Section */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              ADHD-Friendly Text Extraction
            </h1>
          </div>
          <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"} max-w-2xl mx-auto`}>
            Upload your images or PDF documents and let our AI extract the text for you. Designed to minimize
            distractions and maximize focus.
          </p>
        </div>

        {!user && (
          <Alert className="mb-8 border-amber-200 bg-amber-50">
            <AlertDescription className="text-amber-800">
              Please sign in to use the text extraction feature.
              <Button variant="link" className="p-0 h-auto text-amber-800 underline ml-1" onClick={onAuthClick}>
                Sign in here
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="max-w-4xl mx-auto space-y-12">
          {/* Upload Section */}
          <Card
            className={`border-2 border-dashed ${darkMode ? "border-gray-600 bg-gray-800/70" : "border-purple-200 bg-white/70"} hover:border-purple-300 transition-all duration-300 animate-slide-up`}
          >
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 justify-center ${darkMode ? "text-white" : ""}`}>
                <Upload className="h-6 w-6 text-purple-600" />
                Upload Your Files
              </CardTitle>
              <CardDescription className={`text-center ${darkMode ? "text-gray-400" : ""}`}>
                Select an image or PDF document to extract text from
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="file-upload"
                  className={`flex flex-col items-center justify-center w-full h-80 border-2 ${darkMode ? "border-gray-600 bg-gray-700" : "border-purple-300 bg-purple-50"} border-dashed rounded-lg cursor-pointer hover:bg-opacity-80 transition-colors duration-300 ${!user ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {previewUrl && fileType === "image" ? (
                      <img
                        src={previewUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="max-h-64 max-w-full object-contain rounded-lg shadow-md"
                      />
                    ) : selectedFile && fileType === "pdf" ? (
                      <div className="flex flex-col items-center">
                        <File className="w-16 h-16 mb-4 text-red-500" />
                        <p className={`text-lg font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          {selectedFile.name}
                        </p>
                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                          PDF Document • {formatFileSize(selectedFile.size)}
                        </p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-16 h-16 mb-6 text-purple-400" />
                        <p className={`mb-3 text-xl ${darkMode ? "text-gray-300" : "text-purple-600"} font-medium`}>
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className={`text-lg ${darkMode ? "text-gray-400" : "text-purple-500"} text-center`}>
                          Images: PNG, JPG, JPEG
                          <br />
                          Documents: PDF
                          <br />
                          (MAX. 50MB)
                        </p>
                        {!user && <p className="text-lg text-red-500 mt-3">Sign in required</p>}
                      </>
                    )}
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={handleFileSelect}
                    disabled={!user}
                  />
                </label>
              </div>

              {selectedFile && user && (
                <div className="space-y-4 animate-fade-in">
                  <div
                    className={`flex items-center justify-between p-4 ${darkMode ? "bg-gray-700" : "bg-purple-50"} rounded-lg`}
                  >
                    <div className="flex items-center gap-3">
                      {fileType === "pdf" ? (
                        <File className="h-8 w-8 text-red-500" />
                      ) : (
                        <FileText className="h-8 w-8 text-blue-500" />
                      )}
                      <div>
                        <span className={`text-lg font-medium ${darkMode ? "text-gray-300" : "text-purple-700"}`}>
                          {selectedFile.name}
                        </span>
                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-purple-500"}`}>
                          {formatFileSize(selectedFile.size)} • {fileType?.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Ready to extract
                    </Badge>
                  </div>

                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={() => handleTextExtraction(selectedFile)}
                      disabled={isProcessing || !user}
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 px-8"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5 mr-2" />
                          Extract Text
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={clearAll}
                      size="lg"
                      className={`${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-purple-300 text-purple-600 hover:bg-purple-50"} px-6`}
                    >
                      <Trash2 className="h-5 w-5 mr-2" />
                      Clear
                    </Button>
                  </div>
                </div>
              )}

              {isProcessing && (
                <div className={`text-center p-6 ${darkMode ? "bg-gray-700" : "bg-blue-50"} rounded-lg animate-pulse`}>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className={`text-lg ${darkMode ? "text-gray-300" : "text-blue-600"} font-medium`}>
                    Extracting text from your {fileType}...
                  </p>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-blue-500"} mt-2`}>
                    {fileType === "pdf"
                      ? "This may take a few moments for PDF files"
                      : "This usually takes 2-3 seconds"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Extracted Content Section */}
          <Card
            className={`animate-slide-up animation-delay-200 ${darkMode ? "bg-gray-800/70" : "bg-white/70"} backdrop-blur-sm`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className={`flex items-center gap-2 ${darkMode ? "text-white" : ""}`}>
                  <FileText className="h-6 w-6 text-blue-600" />
                  Extracted Content
                </CardTitle>

                {extractionResult && (
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Accuracy:
                    </span>
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                      <Button
                        variant={accuracy === "low" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => handleAccuracyChange("low")}
                        className={`text-xs px-3 py-1 ${accuracy === "low" ? "bg-red-500 text-white" : "text-gray-600"}`}
                      >
                        Low
                      </Button>
                      <Button
                        variant={accuracy === "medium" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => handleAccuracyChange("medium")}
                        className={`text-xs px-3 py-1 ${accuracy === "medium" ? "bg-yellow-500 text-white" : "text-gray-600"}`}
                      >
                        Medium
                      </Button>
                      <Button
                        variant={accuracy === "high" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => handleAccuracyChange("high")}
                        className={`text-xs px-3 py-1 ${accuracy === "high" ? "bg-green-500 text-white" : "text-gray-600"}`}
                      >
                        High
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <CardDescription className={darkMode ? "text-gray-400" : ""}>
                {activeView === "text"
                  ? "Your content converted to editable text - edit, organize, and save as needed"
                  : "Key terms and concepts extracted from your content"}
              </CardDescription>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Button
                  variant={activeView === "text" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveView("text")}
                  className={activeView === "text" ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  <FileTextIcon className="h-4 w-4 mr-2" />
                  Text
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
            </CardHeader>
            <CardContent>
              {extractionResult ? (
                <div className="space-y-6 animate-fade-in">
                  {activeView === "text" ? (
                    <Textarea
                      value={extractionResult.extractedText}
                      onChange={(e) =>
                        setExtractionResult({
                          ...extractionResult,
                          extractedText: e.target.value,
                        })
                      }
                      className={`min-h-[600px] resize-none text-base leading-relaxed ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-blue-200 focus:border-blue-400"} transition-colors duration-300`}
                      placeholder="Extracted text will appear here..."
                    />
                  ) : (
                    <div
                      className={`min-h-[600px] p-4 border rounded-lg ${darkMode ? "bg-gray-700 border-gray-600" : "border-purple-200"}`}
                    >
                      <div className="flex flex-wrap gap-2">
                        {extractionResult.keywords}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 justify-center flex-wrap">
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      size="lg"
                      className={`${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-blue-300 text-blue-600 hover:bg-blue-50"} px-8`}
                    >
                      <Copy className="h-5 w-5 mr-2" />
                      Copy {activeView === "text" ? "Text" : "Keywords"}
                    </Button>
                    <Button
                      onClick={downloadText}
                      variant="outline"
                      size="lg"
                      className={`${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-blue-300 text-blue-600 hover:bg-blue-50"} px-8`}
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[600px] text-gray-400">
                  <FileText className="h-24 w-24 mb-8 opacity-50" />
                  <h3 className={`text-2xl font-medium mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    No content extracted yet
                  </h3>
                  <p className={`text-center max-w-md text-lg ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {user
                      ? "Upload an image or PDF document above to get started. The text will automatically be extracted and appear here for editing."
                      : "Sign in to start extracting text from your files"}
                  </p>
                  {user && !selectedFile && (
                    <Button
                      onClick={() => document.getElementById("file-upload")?.click()}
                      className="mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      size="lg"
                    >
                      <Upload className="h-5 w-5 mr-2" />
                      Upload Your First File
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        <div className="mt-12 animate-fade-in animation-delay-600">
          <Card
            className={`${darkMode ? "bg-gradient-to-r from-purple-900 to-blue-900" : "bg-gradient-to-r from-purple-600 to-blue-600"} text-white`}
          >
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Brain className="h-5 w-5" />
                ADHD-Friendly Tips for Better Results
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">📸 File Quality</h4>
                  <ul className="space-y-1 opacity-90">
                    <li>• Use good lighting for images</li>
                    <li>• Ensure text is clearly visible</li>
                    <li>• Keep file size under 50MB</li>
                    <li>• PDFs work great for documents</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">✏️ After Extraction</h4>
                  <ul className="space-y-1 opacity-90">
                    <li>• Review and edit the text</li>
                    <li>• Use keywords for quick reference</li>
                    <li>• Chat with AI about your content</li>
                    <li>• Save or copy for later use</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Chatbot Button */}
      {extractionResult && (
        <Button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg z-40"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chatbot Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className={`w-full max-w-md h-[600px] flex flex-col ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-lg ${darkMode ? "text-white" : ""}`}>Chat about your {fileType}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setIsChatOpen(false)} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-4">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {chatMessages.length === 0 && (
                  <div className={`text-center ${darkMode ? "text-gray-400" : "text-gray-500"} py-8`}>
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Ask me anything about your {fileType === "pdf" ? "PDF document" : "notes"}!</p>
                  </div>
                )}
                {chatMessages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${message.role === "user"
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
                    <div className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
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
                  placeholder={`Ask about your ${fileType === "pdf" ? "PDF" : "notes"}...`}
                  className={`flex-1 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}`}
                  disabled={isChatLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!chatInput.trim() || isChatLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      <Footer darkMode={darkMode} />
    </div>
  )
}
