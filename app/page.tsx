"use client"

import { useState, useEffect } from "react"
import { Sparkles, Brain, Shield, Zap, CheckCircle, Star, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Header from "./components/header"
import Footer from "./components/footer"
import AuthPage from "./components/auth-page"
import ProfilePage from "./components/profile-page"
import AboutPage from "./components/about-page"
import HowItWorksPage from "./components/how-it-works-page"
import SupportPage from "./components/support-page"
import ADHDPage from "./components/adhd-page"
import MyExtractionsPage from "./components/my-extractions-page"
import BoltBadge from "./../components/ui/Bot_badge";

export default function NotesExtractor() {
  const [currentPage, setCurrentPage] = useState<
    "home" | "auth" | "profile" | "about" | "how-it-works" | "support" | "adhd" | "my-extractions"
  >("home")
  const [user, setUser] = useState<any>(null)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    // Check dark mode preference
    const savedDarkMode = localStorage.getItem("darkMode")
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode))
    }
  }, [])

  const handleLogin = (userData: any) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
    setCurrentPage("home")
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const handleNavigation = (
    page: "home" | "auth" | "profile" | "about" | "how-it-works" | "support" | "adhd" | "my-extractions",
  ) => {
    setCurrentPage(page)
  }

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode))
  }

  if (currentPage === "auth") {
    return <AuthPage onLogin={handleLogin} onBack={() => setCurrentPage("home")} darkMode={darkMode} />
  }

  if (currentPage === "profile") {
    return <ProfilePage user={user} onBack={() => setCurrentPage("home")} onLogout={handleLogout} darkMode={darkMode} />
  }

  if (currentPage === "about") {
    return (
      <AboutPage
        onBack={() => setCurrentPage("home")}
        user={user}
        onAuthClick={() => setCurrentPage("auth")}
        onProfileClick={() => setCurrentPage("profile")}
        onLogout={handleLogout}
        onNavigate={handleNavigation}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />
    )
  }

  if (currentPage === "how-it-works") {
    return (
      <HowItWorksPage
        onBack={() => setCurrentPage("home")}
        user={user}
        onAuthClick={() => setCurrentPage("auth")}
        onProfileClick={() => setCurrentPage("profile")}
        onLogout={handleLogout}
        onNavigate={handleNavigation}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />
    )
  }

  if (currentPage === "support") {
    return (
      <SupportPage
        onBack={() => setCurrentPage("home")}
        user={user}
        onAuthClick={() => setCurrentPage("auth")}
        onProfileClick={() => setCurrentPage("profile")}
        onLogout={handleLogout}
        onNavigate={handleNavigation}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />
    )
  }

  if (currentPage === "adhd") {
    return (
      <ADHDPage
        user={user}
        onBack={() => setCurrentPage("home")}
        onAuthClick={() => setCurrentPage("auth")}
        onProfileClick={() => setCurrentPage("profile")}
        onLogout={handleLogout}
        onNavigate={handleNavigation}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />
    )
  }

  if (currentPage === "my-extractions") {
    return (
      <MyExtractionsPage
        user={user}
        onBack={() => setCurrentPage("home")}
        onAuthClick={() => setCurrentPage("auth")}
        onProfileClick={() => setCurrentPage("profile")}
        onLogout={handleLogout}
        onNavigate={handleNavigation}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />
    )
  }

  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100"} flex flex-col`}
    >
      <Header
        user={user}
        onAuthClick={() => setCurrentPage("auth")}
        onProfileClick={() => setCurrentPage("profile")}
        onLogout={handleLogout}
        onNavigate={handleNavigation}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      <main className="container mx-auto px-4 py-8 flex-1">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Brain className="h-12 w-12 text-purple-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Notes Extractor
            </h1>
          </div>
          <p className={`text-xl ${darkMode ? "text-gray-300" : "text-gray-600"} max-w-3xl mx-auto mb-6`}>
            Transform your handwritten notes into digital text instantly with our AI-powered OCR technology. Designed
            specifically for students and individuals with ADHD who need organized, accessible notes.
          </p>
          <div className="flex items-center justify-center gap-3 mb-8">
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              ADHD Friendly Design
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 px-4 py-2">
              <Brain className="h-4 w-4 mr-2" />
              Instant OCR Processing
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-700 px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              Secure & Private
            </Badge>
          </div>
          {!user ? (
            <Button
              onClick={() => setCurrentPage("auth")}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg mr-4"
            >
              Get Started Free
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentPage("adhd")}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg"
            >
              Start Extracting Notes
            </Button>
          )}
        </div>

        {/* Quick Upload Section - Only on Home Page */}
        <div className="max-w-2xl mx-auto mb-20 animate-slide-up">
          <Card
            className={`border-2 border-dashed ${darkMode ? "border-gray-600 bg-gray-800/70" : "border-purple-200 bg-white/70"} hover:border-purple-300 transition-all duration-300`}
          >
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 justify-center ${darkMode ? "text-white" : ""}`}>
                <Upload className="h-6 w-6 text-purple-600" />
                Quick Upload & Extract
              </CardTitle>
              <CardDescription className={`text-center ${darkMode ? "text-gray-400" : ""}`}>
                Upload your notes and we'll take you to the extraction page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="quick-file-upload"
                  className={`flex flex-col items-center justify-center w-full h-48 border-2 ${darkMode ? "border-gray-600 bg-gray-700" : "border-purple-300 bg-purple-50"} border-dashed rounded-lg cursor-pointer hover:bg-opacity-80 transition-colors duration-300 ${!user ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-12 h-12 mb-4 text-purple-400" />
                    <p className={`mb-2 text-lg ${darkMode ? "text-gray-300" : "text-purple-600"} font-medium`}>
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-purple-500"}`}>
                      PNG, JPG, JPEG (MAX. 10MB)
                    </p>
                    {!user && <p className="text-sm text-red-500 mt-2">Sign in required</p>}
                  </div>
                  <input
                    id="quick-file-upload"
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      if (e.target.files?.[0] && user) {
                        const file = e.target.files[0]

                        // Check file size (50MB limit)
                        const maxSize = 50 * 1024 * 1024 // 50MB in bytes
                        if (file.size > maxSize) {
                          alert("File size must be less than 50MB")
                          return
                        }

                        // Check file type
                        const isImage = file.type.startsWith("image/")
                        const isPDF = file.type === "application/pdf"

                        if (!isImage && !isPDF) {
                          alert("Please select an image file (PNG, JPG, JPEG) or PDF file")
                          return
                        }

                        const reader = new FileReader()
                        reader.onload = () => {
                          sessionStorage.setItem(
                            "uploadedFile",
                            JSON.stringify({
                              name: file.name,
                              size: file.size,
                              type: file.type,
                              data: reader.result,
                            }),
                          )
                          setCurrentPage("adhd")
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                    disabled={!user}
                  />
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        {!user && (
          <Alert className="mb-8 border-amber-200 bg-amber-50">
            <AlertDescription className="text-amber-800">
              Please sign in to use the text extraction feature.
              <Button
                variant="link"
                className="p-0 h-auto text-amber-800 underline ml-1"
                onClick={() => setCurrentPage("auth")}
              >
                Sign in here
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Key Benefits Section */}
        <div className="mb-20 animate-fade-in animation-delay-400">
          <h2 className={`text-3xl font-bold text-center mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
            Why Choose Notes Extractor?
          </h2>
          <p className={`text-center ${darkMode ? "text-gray-300" : "text-gray-600"} mb-12 max-w-2xl mx-auto`}>
            Our platform is specifically designed to help students and individuals with ADHD organize their notes
            efficiently
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card
              className={`text-center hover:shadow-lg transition-shadow duration-300 border-0 ${darkMode ? "bg-gray-800/70" : "bg-white/70"} backdrop-blur-sm`}
            >
              <CardContent className="pt-8 pb-6">
                <Brain className="h-16 w-16 text-purple-600 mx-auto mb-6" />
                <h3 className={`text-xl font-semibold mb-3 ${darkMode ? "text-white" : "text-gray-800"}`}>
                  ADHD Friendly
                </h3>
                <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} leading-relaxed`}>
                  Designed with ADHD users in mind, featuring clear visual hierarchy, minimal distractions, and
                  intuitive workflows that reduce cognitive load.
                </p>
              </CardContent>
            </Card>
            <Card
              className={`text-center hover:shadow-lg transition-shadow duration-300 border-0 ${darkMode ? "bg-gray-800/70" : "bg-white/70"} backdrop-blur-sm`}
            >
              <CardContent className="pt-8 pb-6">
                <Zap className="h-16 w-16 text-blue-600 mx-auto mb-6" />
                <h3 className={`text-xl font-semibold mb-3 ${darkMode ? "text-white" : "text-gray-800"}`}>
                  Lightning Fast
                </h3>
                <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} leading-relaxed`}>
                  Advanced AI-powered OCR technology processes your images in seconds, delivering accurate text
                  extraction with minimal wait time.
                </p>
              </CardContent>
            </Card>
            <Card
              className={`text-center hover:shadow-lg transition-shadow duration-300 border-0 ${darkMode ? "bg-gray-800/70" : "bg-white/70"} backdrop-blur-sm`}
            >
              <CardContent className="pt-8 pb-6">
                <Shield className="h-16 w-16 text-green-600 mx-auto mb-6" />
                <h3 className={`text-xl font-semibold mb-3 ${darkMode ? "text-white" : "text-gray-800"}`}>
                  Secure & Private
                </h3>
                <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} leading-relaxed`}>
                  Your notes are processed securely with end-to-end encryption. We never store your images or extracted
                  text without your permission.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Statistics Section */}
        <div
          className={`mb-20 ${darkMode ? "bg-gray-800/50" : "bg-white/50"} backdrop-blur-sm rounded-2xl p-8 animate-slide-up`}
        >
          <h2 className={`text-3xl font-bold text-center mb-12 ${darkMode ? "text-white" : "text-gray-800"}`}>
            Trusted by Students Worldwide
          </h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">50K+</div>
              <div className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>Notes Processed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">15K+</div>
              <div className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">98%</div>
              <div className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>Accuracy Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
              <div className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>Support Available</div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-20 animate-fade-in">
          <h2 className={`text-3xl font-bold text-center mb-12 ${darkMode ? "text-white" : "text-gray-800"}`}>
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className={`border-0 ${darkMode ? "bg-gray-800/70" : "bg-white/70"} backdrop-blur-sm`}>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-4 italic`}>
                  "As someone with ADHD, organizing my handwritten notes was always a struggle. Notes Extractor has been
                  a game-changer for my studies!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-semibold">
                    S
                  </div>
                  <div>
                    <div className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>Sarah M.</div>
                    <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Psychology Student</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className={`border-0 ${darkMode ? "bg-gray-800/70" : "bg-white/70"} backdrop-blur-sm`}>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-4 italic`}>
                  "The accuracy is incredible! It perfectly captures my messy handwriting and converts it to clean,
                  searchable text."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center text-white font-semibold">
                    M
                  </div>
                  <div>
                    <div className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>Mike R.</div>
                    <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Engineering Student</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className={`border-0 ${darkMode ? "bg-gray-800/70" : "bg-white/70"} backdrop-blur-sm`}>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-4 italic`}>
                  "Finally, a tool that understands the challenges of ADHD. The interface is clean and doesn't overwhelm
                  me with options."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold">
                    A
                  </div>
                  <div>
                    <div className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>Alex T.</div>
                    <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Medical Student</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-white animate-slide-up">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Note-Taking?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students who have already revolutionized their study workflow
          </p>
          {!user ? (
            <Button
              onClick={() => setCurrentPage("auth")}
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
            >
              Start Free Today
            </Button>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="h-6 w-6" />
              <span className="text-lg">You're all set! Click "Start Extracting Notes" above to begin.</span>
            </div>
          )}
        </div>
      </main>
      <BoltBadge />

      <Footer darkMode={darkMode} />
    </div>
  )
}
