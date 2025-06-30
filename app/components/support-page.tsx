"use client"

import type React from "react"

import { Mail, Phone, MessageCircle, Book, HelpCircle, Search, Clock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import Header from "./header"
import Footer from "./footer"

interface SupportPageProps {
  onBack: () => void
  user?: any
  onAuthClick: () => void
  onProfileClick: () => void
  onLogout: () => void
  onNavigate: (page: string) => void
  darkMode: boolean
  onToggleDarkMode: () => void
}

export default function SupportPage({
  onBack,
  user,
  onAuthClick,
  onProfileClick,
  onLogout,
  onNavigate,
  darkMode,
  onToggleDarkMode,
}: SupportPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const faqs = [
    {
      question: "How accurate is the text extraction?",
      answer:
        "Our AI achieves 98% accuracy on most handwritten and printed text. Accuracy may vary based on image quality and handwriting clarity.",
      category: "General",
    },
    {
      question: "What image formats are supported?",
      answer: "We support JPG, JPEG, and PNG formats. Images can be up to 10MB in size for optimal processing speed.",
      category: "Technical",
    },
    {
      question: "Is my data secure and private?",
      answer:
        "Yes! All images are processed securely with end-to-end encryption. We don't store your images or extracted text unless you explicitly save them to your account.",
      category: "Privacy",
    },
    {
      question: "How is this different from other OCR tools?",
      answer:
        "Notes Extractor is specifically designed for ADHD users with a clean interface, minimal distractions, and features that support organization and focus.",
      category: "ADHD",
    },
    {
      question: "Can I edit the extracted text?",
      answer:
        "Our built-in editor allows you to make corrections, format text, and organize your content before saving or exporting.",
      category: "Features",
    },
    {
      question: "Do you offer bulk processing?",
      answer:
        "Currently, we process one image at a time to maintain quality and speed. Bulk processing is planned for future releases.",
      category: "Features",
    },
    {
      question: "What if the extraction isn't accurate?",
      answer:
        "You can easily edit any mistakes in our text editor. For consistently poor results, try improving image quality - good lighting and clear focus help significantly.",
      category: "Troubleshooting",
    },
    {
      question: "Is there a mobile app?",
      answer:
        "Our web app works great on mobile browsers! A dedicated mobile app is in development and will be available soon.",
      category: "Technical",
    },
  ]

  const supportChannels = [
    {
      icon: <Mail className="h-6 w-6 text-purple-600" />,
      title: "Email Support",
      description: "Get detailed help via email",
      contact: "support@notesextractor.com",
      responseTime: "Within 24 hours",
    },
    {
      icon: <MessageCircle className="h-6 w-6 text-blue-600" />,
      title: "Live Chat",
      description: "Chat with our support team",
      contact: "Available 9 AM - 6 PM EST",
      responseTime: "Immediate",
    },
    {
      icon: <Phone className="h-6 w-6 text-green-600" />,
      title: "Phone Support",
      description: "Speak directly with our team",
      contact: "+1 (555) 012-3456",
      responseTime: "Mon-Fri, 9 AM - 6 PM EST",
    },
  ]

  const resources = [
    {
      icon: <Book className="h-6 w-6 text-purple-600" />,
      title: "User Guide",
      description: "Complete guide to using Notes Extractor",
    },
    {
      icon: <HelpCircle className="h-6 w-6 text-blue-600" />,
      title: "Video Tutorials",
      description: "Step-by-step video instructions",
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      title: "Best Practices",
      description: "Tips for optimal text extraction",
    },
  ]

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Thank you for your message! We'll get back to you within 24 hours.")
    setContactForm({ name: "", email: "", subject: "", message: "" })
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

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in">
            <h1
              className={`text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6`}
            >
              Support Center
            </h1>
            <p className={`text-xl ${darkMode ? "text-gray-300" : "text-gray-600"} max-w-3xl mx-auto leading-relaxed`}>
              We're here to help! Find answers to common questions, access helpful resources, or get in touch with our
              support team.
            </p>
          </div>

          {/* Support Channels */}
          <div className="mb-16 animate-slide-up">
            <h2 className={`text-2xl font-bold text-center mb-8 ${darkMode ? "text-white" : "text-gray-800"}`}>
              Get Help Now
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {supportChannels.map((channel, index) => (
                <Card
                  key={channel.title}
                  className={`border-0 ${darkMode ? "bg-gray-800/70" : "bg-white/70"} backdrop-blur-sm hover:shadow-lg transition-shadow duration-300`}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`p-3 ${darkMode ? "bg-gray-700" : "bg-gray-50"} rounded-full w-fit mx-auto mb-4`}>
                      {channel.icon}
                    </div>
                    <h3 className={`font-semibold text-lg mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
                      {channel.title}
                    </h3>
                    <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-3`}>{channel.description}</p>
                    <p className="font-medium text-purple-600 mb-2">{channel.contact}</p>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      <Clock className="h-3 w-3 mr-1" />
                      {channel.responseTime}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-16 animate-fade-in animation-delay-400">
            <h2 className={`text-2xl font-bold text-center mb-8 ${darkMode ? "text-white" : "text-gray-800"}`}>
              Frequently Asked Questions
            </h2>

            {/* Search */}
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-10 ${darkMode ? "bg-gray-800 border-gray-700 text-white" : ""}`}
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <Card
                  key={index}
                  className={`border-0 ${darkMode ? "bg-gray-800/70" : "bg-white/70"} backdrop-blur-sm`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className={`font-semibold text-lg ${darkMode ? "text-white" : "text-gray-800"}`}>
                        {faq.question}
                      </h3>
                      <Badge variant="secondary" className="ml-4 bg-purple-100 text-purple-700">
                        {faq.category}
                      </Badge>
                    </div>
                    <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} leading-relaxed`}>{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredFaqs.length === 0 && (
              <Card className={`border-0 ${darkMode ? "bg-gray-800/70" : "bg-white/70"} backdrop-blur-sm`}>
                <CardContent className="p-8 text-center">
                  <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    No FAQs found matching your search. Try different keywords or contact our support team.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Resources */}
          <div className="mb-16 animate-slide-up animation-delay-600">
            <h2 className={`text-2xl font-bold text-center mb-8 ${darkMode ? "text-white" : "text-gray-800"}`}>
              Helpful Resources
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {resources.map((resource, index) => (
                <Card
                  key={resource.title}
                  className={`border-0 ${darkMode ? "bg-gray-800/70" : "bg-white/70"} backdrop-blur-sm hover:shadow-lg transition-shadow duration-300`}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`p-3 ${darkMode ? "bg-gray-700" : "bg-gray-50"} rounded-full w-fit mx-auto mb-4`}>
                      {resource.icon}
                    </div>
                    <h3 className={`font-semibold text-lg mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
                      {resource.title}
                    </h3>
                    <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>{resource.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <Card
            className={`mb-16 animate-fade-in animation-delay-800 border-0 ${darkMode ? "bg-gray-800/70" : "bg-white/70"} backdrop-blur-sm`}
          >
            <CardContent className="p-8">
              <h2 className={`text-2xl font-bold text-center mb-8 ${darkMode ? "text-white" : "text-gray-800"}`}>
                Contact Us
              </h2>
              <form onSubmit={handleContactSubmit} className="max-w-2xl mx-auto space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className={darkMode ? "text-gray-300" : ""}>
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className={darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className={darkMode ? "text-gray-300" : ""}>
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className={darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject" className={darkMode ? "text-gray-300" : ""}>
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    className={darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="message" className={darkMode ? "text-gray-300" : ""}>
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className={`min-h-[120px] ${darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}`}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer darkMode={darkMode} />
    </div>
  )
}
