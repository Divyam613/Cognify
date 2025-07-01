"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AuthPageProps {
  onLogin: (user: any) => void
  onBack: () => void
}

export default function AuthPage({ onLogin, onBack }: AuthPageProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState("")
  const [resetLink, setResetLink] = useState("")
  const [otpFromBackend, setOtpFromBackend] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    username: "", // Changed from email to username
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (isSignUp) {
        // Sign Up Flow
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords don't match")
          setIsLoading(false)
          return
        }
        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters")
          setIsLoading(false)
          return
        }

        // Use the actual Django registration API
        const signUpResponse = await fetch("http://20.121.113.248:8000/api/register/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
          }),
        })

        if (!signUpResponse.ok) {
          const errorData = await signUpResponse.json()

          // Handle Django validation errors
          if (errorData.username && Array.isArray(errorData.username)) {
            throw new Error(errorData.username[0])
          } else if (errorData.email && Array.isArray(errorData.email)) {
            throw new Error(errorData.email[0])
          } else if (errorData.password && Array.isArray(errorData.password)) {
            throw new Error(errorData.password[0])
          } else if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
            throw new Error(errorData.non_field_errors[0])
          } else {
            throw new Error(errorData.message || errorData.error || errorData.detail || "Sign up failed")
          }
        }

        const signUpData = await signUpResponse.json()

        // Redirect to sign in after successful sign up
        setIsSignUp(false)
        setError("")
        setFormData({ name: "", username: "", email: "", password: "", confirmPassword: "" })

        // Show success message
        alert("Account created successfully! Please sign in with your username and password.")
      } else {
        // Sign In Flow
        // Use the actual Django backend API
        const signInResponse = await fetch("http://20.121.113.248:8000/api/login/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
          }),
        })
        console.log("ye hai data:", signInResponse)

        if (!signInResponse.ok) {
          if (signInResponse.status === 401 || signInResponse.status === 404) {
            throw new Error("Invalid username or password")
          }
          const errorData = await signInResponse.json()
          throw new Error(errorData.message || errorData.error || errorData.detail || "Sign in failed")
        }

        const signInData = await signInResponse.json()

        // Handle your Django JWT response format
        if (!signInData.access || !signInData.user_id) {
          throw new Error("Invalid response from server")
        }

        // Create user data object from your API response
        const userData = {
          id: signInData.user_id,
          name:
            signInData.first_name && signInData.last_name
              ? `${signInData.first_name} ${signInData.last_name}`
              : signInData.username, // Fallback to username if no name provided
          username: signInData.username,
          email: signInData.email,
          phone: signInData.phone || "",
          bio: signInData.bio || "",
          avatar: signInData.avatar || null,
          createdAt: signInData.date_joined || new Date().toISOString(),
          accessToken: signInData.access,
          refreshToken: signInData.refresh,
        }
        console.log("access token", signInData.access);

        onLogin(userData)
      }
    } catch (error) {
      console.error("Authentication error:", error)
      setError(error.message || "An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("http://20.121.113.248:8000/api/password-reset/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: forgotEmail,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to send reset link")
      }

      const data = await response.json()

      if (data.message && data.reset_link && data.otp) {
        setResetLink(data.reset_link)
        setOtpFromBackend(data.otp)
        setShowForgotPassword(false)
        setShowResetPassword(true)
        setError("")
      } else {
        throw new Error("Invalid response format")
      }
    } catch (error) {
      console.error("Forgot password error:", error)
      setError(error.message || "Failed to send reset link. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Verify OTP first
      if (otp !== otpFromBackend) {
        setError("Invalid OTP. Please check the OTP sent to your email.")
        setIsLoading(false)
        return
      }

      if (newPassword !== confirmNewPassword) {
        setError("Passwords don't match")
        setIsLoading(false)
        return
      }
      if (newPassword.length < 6) {
        setError("Password must be at least 6 characters")
        setIsLoading(false)
        return
      }

      // Use the reset link from backend
      const response = await fetch(resetLink, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: newPassword,
          confirm_password: confirmNewPassword,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to reset password")
      }

      const data = await response.json()

      // Reset successful
      setShowResetPassword(false)
      setError("")
      setIsSignUp(false)
      // Reset all states
      setOtp("")
      setNewPassword("")
      setConfirmNewPassword("")
      setForgotEmail("")
      setResetLink("")
      setOtpFromBackend("")

      alert("Password reset successfully! Please sign in with your new password.")
    } catch (error) {
      console.error("Password reset error:", error)
      setError(error.message || "Failed to reset password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <Card className="overflow-hidden shadow-xl border-0">
          <div className="relative">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-10"></div>

            <CardHeader className="text-center relative z-10">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </CardTitle>
              <CardDescription>
                {isSignUp ? "Sign up to start extracting text from your notes" : "Sign in to your account"}
              </CardDescription>
            </CardHeader>

            <CardContent className="relative z-10">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                  </Alert>
                )}

                <div
                  className={`transition-all duration-500 ${isSignUp ? "opacity-100 max-h-20" : "opacity-0 max-h-0 overflow-hidden"}`}
                >
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-10"
                      required={isSignUp}
                    />
                  </div>
                </div>

                {!isSignUp && (
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                )}

                {isSignUp && (
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                )}

                {isSignUp && (
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Choose a username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div
                  className={`transition-all duration-500 ${isSignUp ? "opacity-100 max-h-20" : "opacity-0 max-h-0 overflow-hidden"}`}
                >
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="pl-10 pr-10"
                      required={isSignUp}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {!isSignUp && (
                  <div className="text-right">
                    <Button
                      type="button"
                      variant="link"
                      className="text-xs text-purple-600 hover:text-purple-700 p-0 h-auto"
                      onClick={() => setShowForgotPassword(true)}
                    >
                      Forgot password?
                    </Button>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {isSignUp ? "Creating Account..." : "Signing In..."}
                    </>
                  ) : isSignUp ? (
                    "Create Account"
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {isSignUp ? "Already have an account?" : "Don't have an account?"}
                  <Button
                    type="button"
                    variant="link"
                    className="text-purple-600 hover:text-purple-700 p-0 ml-1"
                    onClick={() => {
                      setIsSignUp(!isSignUp)
                      setError("")
                      setFormData({ name: "", username: "", email: "", password: "", confirmPassword: "" })
                    }}
                  >
                    {isSignUp ? "Sign In" : "Sign Up"}
                  </Button>
                </p>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>Enter your email and we'll send you an OTP to reset your password.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <Label htmlFor="forgot-email">Email</Label>
              <Input
                id="forgot-email"
                type="email"
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send OTP"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={showResetPassword} onOpenChange={setShowResetPassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>Enter your new password below.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePasswordReset} className="space-y-4">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}
            <div>
              <Label htmlFor="otp-verify">Enter OTP</Label>
              <Input
                id="otp-verify"
                type="text"
                placeholder="Enter the OTP sent to your email"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value)
                  setError("")
                }}
                maxLength={6}
                required
              />
            </div>
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value)
                  setError("")
                }}
                required
              />
            </div>
            <div>
              <Label htmlFor="confirm-new-password">Confirm New Password</Label>
              <Input
                id="confirm-new-password"
                type="password"
                placeholder="Confirm new password"
                value={confirmNewPassword}
                onChange={(e) => {
                  setConfirmNewPassword(e.target.value)
                  setError("")
                }}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600" disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
