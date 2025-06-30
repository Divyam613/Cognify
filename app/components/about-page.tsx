"use client"

import { Heart, Lightbulb, Users, Target, CheckCircle, Brain, Zap, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "./header"
import Footer from "./footer"

interface AboutPageProps {
  onBack: () => void
  user?: any
  onAuthClick: () => void
  onProfileClick: () => void
  onLogout: () => void
  onNavigate: (page: string) => void
  darkMode: boolean
  onToggleDarkMode: () => void
}

export default function AboutPage({
  onBack,
  user,
  onAuthClick,
  onProfileClick,
  onLogout,
  onNavigate,
  darkMode,
  onToggleDarkMode,
}: AboutPageProps) {
  const teamMembers = [
    {
      name: "Dr. Sarah Chen",
      role: "Founder & CEO",
      bio: "Neuroscientist specializing in ADHD research with 15+ years of experience in cognitive accessibility.",
      initial: "S",
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO",
      bio: "AI/ML engineer with expertise in OCR technology and a passion for educational tools.",
      initial: "M",
    },
    {
      name: "Emily Watson",
      role: "Head of UX",
      bio: "UX designer focused on creating inclusive interfaces for neurodiverse users.",
      initial: "E",
    },
    {
      name: "Dr. James Park",
      role: "ADHD Consultant",
      bio: "Clinical psychologist specializing in ADHD and learning disabilities.",
      initial: "J",
    },
  ]

  const values = [
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Empathy First",
      description: "We understand the unique challenges faced by individuals with ADHD and design with compassion.",
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-yellow-500" />,
      title: "Innovation",
      description: "We continuously push the boundaries of AI and accessibility to create better solutions.",
    },
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: "Community",
      description: "We build tools that bring people together and support collaborative learning.",
    },
    {
      icon: <Target className="h-8 w-8 text-green-500" />,
      title: "Focus",
      description: "Every feature is designed to reduce distractions and enhance concentration.",
    },
  ]

  const milestones = [
    {
      year: "2023",
      title: "Company Founded",
      description: "Started with a mission to make note-taking accessible for everyone",
    },
    {
      year: "2023",
      title: "First Beta Launch",
      description: "Released our initial OCR technology to a small group of beta testers",
    },
    {
      year: "2024",
      title: "ADHD Focus",
      description: "Pivoted to specifically address the needs of individuals with ADHD",
    },
    {
      year: "2024",
      title: "15K+ Users",
      description: "Reached over 15,000 active users across universities worldwide",
    },
  ]

  const features = [
    {
      icon: <Brain className="h-6 w-6 text-purple-600" />,
      title: "AI-Powered OCR",
      description: "Advanced machine learning algorithms for accurate text extraction",
    },
    {
      icon: <Zap className="h-6 w-6 text-yellow-600" />,
      title: "Lightning Fast",
      description: "Process images in under 3 seconds with 98% accuracy",
    },
    {
      icon: <Shield className="h-6 w-6 text-green-600" />,
      title: "Privacy First",
      description: "Your data is encrypted and never stored without permission",
    },
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
              About Notes Extractor
            </h1>
            <p className={`text-xl ${darkMode ? "text-gray-300" : "text-gray-600"} max-w-3xl mx-auto leading-relaxed`}>
              We're on a mission to make note-taking accessible, organized, and stress-free for students with ADHD and
              learning differences. Our AI-powered platform transforms handwritten notes into digital text, helping you
              focus on what matters most - learning.
            </p>
          </div>

          {/* Mission Statement */}
          <Card
            className={`mb-16 animate-slide-up border-0 ${darkMode ? "bg-gradient-to-r from-purple-900 to-blue-900" : "bg-gradient-to-r from-purple-600 to-blue-600"} text-white`}
          >
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-xl leading-relaxed max-w-4xl mx-auto opacity-95">
                To empower students with ADHD and learning differences by providing intuitive, accessible technology
                that transforms the way they interact with their educational materials. We believe that everyone
                deserves tools that work with their brain, not against it.
              </p>
            </CardContent>
          </Card>

          {/* Key Features */}
          <div className="mb-16 animate-fade-in animation-delay-400">
            <h2 className={`text-3xl font-bold text-center mb-12 ${darkMode ? "text-white" : "text-gray-800"}`}>
              What Makes Us Different
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={feature.title}
                  className={`text-center hover:shadow-lg transition-shadow duration-300 border-0 ${darkMode ? "bg-gray-800/70" : "bg-white/70"} backdrop-blur-sm`}
                >
                  <CardContent className="pt-8 pb-6">
                    <div className={`p-3 ${darkMode ? "bg-gray-700" : "bg-gray-50"} rounded-full w-fit mx-auto mb-4`}>
                      {feature.icon}
                    </div>
                    <h3 className={`font-semibold text-lg mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
                      {feature.title}
                    </h3>
                    <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Our Values */}
          <div className="mb-16 animate-slide-up animation-delay-600">
            <h2 className={`text-3xl font-bold text-center mb-12 ${darkMode ? "text-white" : "text-gray-800"}`}>
              Our Values
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <Card
                  key={value.title}
                  className={`border-0 ${darkMode ? "bg-gray-800/70" : "bg-white/70"} backdrop-blur-sm hover:shadow-lg transition-shadow duration-300`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 ${darkMode ? "bg-gray-700" : "bg-gray-50"} rounded-full`}>{value.icon}</div>
                      <div>
                        <h3 className={`font-semibold text-xl mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
                          {value.title}
                        </h3>
                        <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} leading-relaxed`}>
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-16 animate-fade-in animation-delay-800">
            <h2 className={`text-3xl font-bold text-center mb-12 ${darkMode ? "text-white" : "text-gray-800"}`}>
              Our Journey
            </h2>
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <Card
                  key={milestone.year}
                  className={`border-0 ${darkMode ? "bg-gray-800/70" : "bg-white/70"} backdrop-blur-sm`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      <div className="flex-shrink-0">
                        <Badge
                          variant="secondary"
                          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 text-lg font-bold"
                        >
                          {milestone.year}
                        </Badge>
                      </div>
                      <div>
                        <h3 className={`font-semibold text-xl mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
                          {milestone.title}
                        </h3>
                        <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>{milestone.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-16 animate-slide-up animation-delay-1000">
            <h2 className={`text-3xl font-bold text-center mb-12 ${darkMode ? "text-white" : "text-gray-800"}`}>
              Meet Our Team
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <Card
                  key={member.name}
                  className={`text-center border-0 ${darkMode ? "bg-gray-800/70" : "bg-white/70"} backdrop-blur-sm hover:shadow-lg transition-shadow duration-300`}
                >
                  <CardContent className="pt-8 pb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                      {member.initial}
                    </div>
                    <h3 className={`font-semibold text-lg mb-1 ${darkMode ? "text-white" : "text-gray-800"}`}>
                      {member.name}
                    </h3>
                    <p className="text-purple-600 font-medium mb-3">{member.role}</p>
                    <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} leading-relaxed`}>
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* ADHD Focus Section */}
          <Card
            className={`mb-16 animate-fade-in animation-delay-1200 border-0 ${darkMode ? "bg-gray-800/70" : "bg-white/70"} backdrop-blur-sm`}
          >
            <CardHeader>
              <CardTitle className={`text-3xl text-center ${darkMode ? "text-white" : "text-gray-800"}`}>
                Why ADHD Matters to Us
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"} leading-relaxed mb-6`}>
                    Traditional note-taking tools often create more barriers than they remove for individuals with ADHD.
                    We've experienced these challenges firsthand and built Notes Extractor specifically to address them.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        Reduced cognitive load through simple interfaces
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        Minimal distractions and clear visual hierarchy
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        Fast processing to maintain focus and momentum
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        Organized output that supports better study habits
                      </span>
                    </div>
                  </div>
                </div>
                <div className={`p-6 ${darkMode ? "bg-gray-700" : "bg-purple-50"} rounded-lg`}>
                  <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-purple-800"}`}>
                    Research-Backed Design
                  </h3>
                  <p className={`${darkMode ? "text-gray-300" : "text-purple-700"} leading-relaxed`}>
                    Our design principles are based on cognitive science research about ADHD and learning differences.
                    Every feature is tested with real users to ensure it truly helps rather than hinders.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card className="animate-slide-up animation-delay-1400 border-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
              <p className="text-xl mb-8 opacity-90">
                Be part of a growing community of students who are transforming their note-taking experience
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                {!user ? (
                  <Button
                    onClick={onAuthClick}
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
                  >
                    Get Started Free
                  </Button>
                ) : (
                  <Button
                    onClick={() => onNavigate("adhd")}
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
                  >
                    Start Extracting Notes
                  </Button>
                )}
                <Button
                  onClick={() => onNavigate("support")}
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-3 text-lg font-semibold"
                >
                  Contact Us
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer darkMode={darkMode} />
    </div>
  )
}
