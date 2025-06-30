"use client"

import { useState } from "react"
import { Menu, X, User, Brain, LogOut, Sun, Moon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface HeaderProps {
  user: any
  onAuthClick: () => void
  onProfileClick: () => void
  onLogout: () => void
  onNavigate: (page: "home" | "about" | "how-it-works" | "support" | "notes extractor" | "my-extractions") => void
  darkMode: boolean
  onToggleDarkMode: () => void
}

export default function Header({
  user,
  onAuthClick,
  onProfileClick,
  onLogout,
  onNavigate,
  darkMode,
  onToggleDarkMode,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { name: "Home", action: () => onNavigate("home") },
    { name: "About", action: () => onNavigate("about") },
    { name: "How It Works", action: () => onNavigate("how-it-works") },
    { name: "Notes extraction", action: () => onNavigate("adhd") },
    // { name: "My Extractions", action: () => onNavigate("my-extractions") },
    { name: "Support", action: () => onNavigate("support") },
  ]

  return (
    <header
      className={`${darkMode ? "bg-gray-900/80" : "bg-white/80"} backdrop-blur-md border-b ${darkMode ? "border-gray-700" : "border-purple-100"} sticky top-0 z-50`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-2 animate-slide-right cursor-pointer"
            onClick={() => onNavigate("home")}
          >
            <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              COGNIFY
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <button
                key={item.name}
                onClick={item.action}
                className={`${darkMode ? "text-gray-300 hover:text-purple-400" : "text-gray-600 hover:text-purple-600"} transition-colors duration-300 font-medium animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center gap-4">
            {/* Dark mode toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleDarkMode}
              className={`rounded-full ${darkMode ? "hover:bg-gray-800" : "hover:bg-purple-50"} transition-colors duration-300`}
            >
              {darkMode ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-purple-600" />}
            </Button>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className={`w-56 ${darkMode ? "bg-gray-800 border-gray-700" : ""}`}>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className={`font-medium ${darkMode ? "text-white" : ""}`}>{user.name}</p>
                      <p
                        className={`w-[200px] truncate text-sm ${darkMode ? "text-gray-400" : "text-muted-foreground"}`}
                      >
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className={darkMode ? "bg-gray-700" : ""} />
                  <DropdownMenuItem
                    onClick={onProfileClick}
                    className={darkMode ? "text-gray-300 hover:bg-gray-700" : ""}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onNavigate("my-extractions")}
                    className={darkMode ? "text-gray-300 hover:bg-gray-700" : ""}
                  >
                    My Extractions
                  </DropdownMenuItem>
                  <DropdownMenuItem className={darkMode ? "text-gray-300 hover:bg-gray-700" : ""}>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onNavigate("support")}
                    className={darkMode ? "text-gray-300 hover:bg-gray-700" : ""}
                  >
                    Help & Support
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className={darkMode ? "bg-gray-700" : ""} />
                  <DropdownMenuItem onClick={onLogout} className={darkMode ? "text-gray-300 hover:bg-gray-700" : ""}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={onAuthClick}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white animate-slide-left"
              >
                Sign In
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div
            className={`md:hidden py-4 border-t ${darkMode ? "border-gray-700" : "border-purple-100"} animate-slide-down`}
          >
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    item.action()
                    setIsMenuOpen(false)
                  }}
                  className={`px-4 py-2 ${darkMode ? "text-gray-300 hover:text-purple-400 hover:bg-gray-800" : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"} rounded-lg transition-colors duration-300 text-left`}
                >
                  {item.name}
                </button>
              ))}
              {!user && (
                <Button
                  onClick={() => {
                    onAuthClick()
                    setIsMenuOpen(false)
                  }}
                  className="mx-4 mt-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  Sign In
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
