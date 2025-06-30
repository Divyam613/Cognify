"use client"

import { Upload, Brain, FileText, Download, CheckCircle, Clock, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "./header"
import Footer from "./footer"

interface HowItWorksPageProps {
  onBack: () => void
  user?: any
  onAuthClick: () => void
  onProfileClick: () => void
  onLogout: () => void
  onNavigate: (page: string) => void
  darkMode: boolean
  onToggleDarkMode: () => void
}

export default function HowItWorksPage({
  onBack,
  user,
  onAuthClick,
  onProfileClick,
  onLogout,
  onNavigate,
  darkMode,
  onToggleDarkMode,
}: HowItWorksPageProps) {
  const steps = [
    {
      number: "01",
      icon: <Upload className="h-8 w-8 text-purple-600" />,
      title: "Upload Your Image",
      description:
        "Simply drag and drop or click to upload an image of your handwritten or printed notes. We support JPG, PNG, and JPEG formats up to 10MB.",
      details: ["Supports multiple image formats", "Drag & drop interface", "Up to 10MB file size", "Instant preview"],
    },
    {
      number: "02",
      icon: <Brain className="h-8 w-8 text-blue-600" />,
      title: "AI Processing",
      description:
        "Our advanced AI analyzes your image using state-of-the-art OCR technology, carefully extracting text while preserving formatting and structure.",
      details: [
        "Advanced OCR technology",
        "Preserves formatting",
        "Handles various handwriting styles",
        "98% accuracy rate",
      ],
    },
    {
      number: "03",
      icon: <FileText className="h-8 w-8 text-green-600" />,
      title: "Review & Edit",
      description:
        "Review the extracted text in our user-friendly editor. Make any necessary corrections and organize your content exactly how you want it.",
      details: ["Built-in text editor", "Real-time editing", "Format preservation", "Easy corrections"],
    },
    {
      number: "04",
      icon: <Download className="h-8 w-8 text-orange-600" />,
      title: "Save & Export",
      description:
        "Copy your text to clipboard or download it as a text file. Your organized notes are now ready for studying, sharing, or further processing.",
      details: ["One-click copy", "Download as .txt", "Share with others", "Cloud sync available"],
    },
  ]

  const features = [
    {
      icon: <Clock className="h-6 w-6 text-purple-600" />,
      title: "Lightning Fast",
      description: "Process images in under 3 seconds",
    },
    {
      icon: <Shield className="h-6 w-6 text-blue-600" />,
      title: "Secure Processing",
      description: "Your data is encrypted and never stored",
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      title: "High Accuracy",
      description: "98% accuracy rate across all text types",
    },
  ]

  const supportedContent = [
    "Handwritten notes",
    "Printed documents",
    "Lecture slides",
    "Textbook pages",
    "Whiteboard content",
    "Mathematical equations",
    "Diagrams with text",
    "Mixed content types",
  ]

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

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
              How Notes Extractor Works
            </h1>
            <p className={`text-xl ${darkMode ? "text-gray-300" : "text-gray-600"} max-w-3xl mx-auto leading-relaxed`}>
              Transform your handwritten notes into digital text in just four simple steps. Our AI-powered platform
              makes it easy, fast, and accurate.
            </p>
          </div>

          {/* Process Steps */}
          <div className="mb-20">
            <h2 className={`text-2xl font-bold text-center mb-12 ${darkMode ? "text-white" : "text-gray-800"}`}>
              Simple 4-Step Process
            </h2>
            <div className="space-y-8">
              {steps.map((step, index) => (
                <Card
                  key={step.number}
                  className={`border-0 bg-white/70 backdrop-blur-sm animate-slide-up`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <CardContent className="p-8">
                    <div className="flex flex-col lg:flex-row items-start gap-8">
                      <div className="flex items-center gap-4 lg:flex-col lg:text-center">
                        <div className="text-4xl font-bold text-gray-300">{step.number}</div>
                        <div className="p-3 bg-gray-50 rounded-full">{step.icon}</div>
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
                          {step.title}
                        </h3>
                        <p
                          className={`text-gray-600 mb-6 leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                        >
                          {step.description}
                        </p>
                        <div className="grid md:grid-cols-2 gap-3">
                          {step.details.map((detail, detailIndex) => (
                            <div key={detailIndex} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                {detail}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Key Features */}
          <div className="mb-20 animate-fade-in animation-delay-800">
            <h2 className={`text-2xl font-bold text-center mb-8 ${darkMode ? "text-white" : "text-gray-800"}`}>
              Why Choose Our Platform?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card
                  key={feature.title}
                  className="border-0 bg-white/70 backdrop-blur-sm text-center hover:shadow-lg transition-shadow duration-300"
                >
                  <CardContent className="pt-8 pb-6">
                    <div className="p-3 bg-gray-50 rounded-full w-fit mx-auto mb-4">{feature.icon}</div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Supported Content */}
          <Card className="mb-20 animate-slide-up animation-delay-1000 border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-center">What Can You Extract?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-center ${darkMode ? "text-gray-300" : "text-gray-600"} mb-8`}>
                Our AI can handle a wide variety of content types with high accuracy
              </p>
              <div className="grid md:grid-cols-4 gap-4">
                {supportedContent.map((content, index) => (
                  <Badge
                    key={content}
                    variant="secondary"
                    className="justify-center py-2 px-4 bg-purple-100 text-purple-700"
                  >
                    {content}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ADHD-Specific Features */}
          <Card className="mb-20 animate-fade-in animation-delay-1200 border-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-center mb-8">Designed for ADHD Success</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Cognitive Load Reduction</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Clean, distraction-free interface</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Simple 4-step process</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Clear visual feedback</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Minimal decision points</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Organization Support</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Automatic text formatting</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Easy editing and corrections</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Multiple export options</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Searchable digital format</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="animate-slide-up animation-delay-1400 border-0 bg-white/70 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
                Ready to Get Started?
              </h2>
              <p className={`text-gray-600 mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                Experience the power of AI-driven note extraction. Transform your handwritten notes in seconds.
              </p>
              <Button
                onClick={onBack}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3"
              >
                Try It Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer darkMode={darkMode} />
    </div>
  )
}
