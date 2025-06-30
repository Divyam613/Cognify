"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, User, Calendar, Edit, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ProfilePageProps {
  user: any
  onBack: () => void
  onLogout: () => void
  darkMode?: boolean
}

export default function ProfilePage({ user, onBack, onLogout, darkMode = false }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [editedUser, setEditedUser] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
  })

  // Load user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      setEditedUser({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
      })
    }
  }, [user])

  const handleSave = async () => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // TODO: Replace with your actual update profile API endpoint
      const response = await fetch("https://your-backend-api.com/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify({
          userId: user.id,
          name: editedUser.name,
          email: editedUser.email,
          phone: editedUser.phone,
          bio: editedUser.bio,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update profile")
      }

      const updatedData = await response.json()

      // Update user data in localStorage and state
      const updatedUser = {
        ...user,
        ...editedUser,
        // Include any additional data returned from backend
        ...updatedData.user,
      }

      localStorage.setItem("user", JSON.stringify(updatedUser))
      setIsEditing(false)
      setSuccess("Profile updated successfully!")

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      console.error("Error updating profile:", error)
      setError(error.message || "Failed to update profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setEditedUser({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      bio: user?.bio || "",
    })
    setIsEditing(false)
    setError("")
    setSuccess("")
  }

  const handleInputChange = (field: string, value: string) => {
    setEditedUser((prev) => ({
      ...prev,
      [field]: value,
    }))
    setError("")
  }

  // Calculate member since date
  const getMemberSince = () => {
    if (user?.createdAt) {
      return new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    }
    return "Recently"
  }

  // Calculate stats (these could come from backend)
  const stats = [
    { label: "Notes Extracted", value: user?.extractionCount || "0" },
    { label: "Total Characters", value: user?.totalCharacters || "0" },
    { label: "Files Processed", value: user?.filesProcessed || "0" },
    { label: "Member Since", value: getMemberSince() },
  ]

  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100"}`}
    >
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className={`mb-6 ${darkMode ? "text-purple-400 hover:text-purple-300 hover:bg-gray-800" : "text-purple-600 hover:text-purple-700 hover:bg-purple-50"}`}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Success/Error Messages */}
          {success && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          {/* Profile Header */}
          <Card className={`animate-fade-in ${darkMode ? "bg-gray-800/70" : "bg-white/70"} backdrop-blur-sm`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-2xl">
                      {user?.name?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                      {user?.name || user?.username || "User"}
                    </h1>
                    <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>@{user?.username || "username"}</p>
                    <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      {user?.email || "No email provided"}
                    </p>
                    <Badge variant="secondary" className="mt-2 bg-green-100 text-green-700">
                      Active Member
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className={`${darkMode ? "border-purple-400 text-purple-400 hover:bg-purple-900" : "border-purple-300 text-purple-600 hover:bg-purple-50"}`}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-purple-600 to-blue-600"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </>
                        )}
                      </Button>
                      <Button onClick={handleCancel} variant="outline" disabled={isLoading}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-4 animate-slide-up">
            {stats.map((stat, index) => (
              <Card
                key={stat.label}
                className={`text-center ${darkMode ? "bg-gray-800/70" : "bg-white/70"} backdrop-blur-sm`}
              >
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-purple-600">{stat.value}</div>
                  <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Profile Information */}
          <Card
            className={`animate-slide-up animation-delay-200 ${darkMode ? "bg-gray-800/70" : "bg-white/70"} backdrop-blur-sm`}
          >
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${darkMode ? "text-white" : ""}`}>
                <User className="h-5 w-5 text-purple-600" />
                Profile Information
              </CardTitle>
              <CardDescription className={darkMode ? "text-gray-400" : ""}>
                Manage your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className={darkMode ? "text-gray-300" : ""}>
                    Full Name
                  </Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editedUser.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className={darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div
                      className={`p-2 ${darkMode ? "bg-gray-700" : "bg-gray-50"} rounded-md ${darkMode ? "text-gray-300" : ""}`}
                    >
                      {user?.name || "Not provided"}
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="username" className={darkMode ? "text-gray-300" : ""}>
                    Username
                  </Label>
                  <div
                    className={`p-2 ${darkMode ? "bg-gray-700" : "bg-gray-50"} rounded-md ${darkMode ? "text-gray-300" : ""}`}
                  >
                    @{user?.username || "Not provided"}
                  </div>
                  <p className={`text-xs mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                    Username cannot be changed
                  </p>
                </div>
                <div>
                  <Label htmlFor="email" className={darkMode ? "text-gray-300" : ""}>
                    Email Address
                  </Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editedUser.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}
                      placeholder="Enter your email"
                    />
                  ) : (
                    <div
                      className={`p-2 ${darkMode ? "bg-gray-700" : "bg-gray-50"} rounded-md ${darkMode ? "text-gray-300" : ""}`}
                    >
                      {user?.email || "Not provided"}
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone" className={darkMode ? "text-gray-300" : ""}>
                    Phone Number
                  </Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={editedUser.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className={darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <div
                      className={`p-2 ${darkMode ? "bg-gray-700" : "bg-gray-50"} rounded-md ${darkMode ? "text-gray-300" : ""}`}
                    >
                      {user?.phone || "Not provided"}
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="joined" className={darkMode ? "text-gray-300" : ""}>
                    Member Since
                  </Label>
                  <div
                    className={`p-2 ${darkMode ? "bg-gray-700" : "bg-gray-50"} rounded-md flex items-center gap-2 ${darkMode ? "text-gray-300" : ""}`}
                  >
                    <Calendar className="h-4 w-4 text-gray-500" />
                    {getMemberSince()}
                  </div>
                </div>
                <div>
                  <Label htmlFor="user-id" className={darkMode ? "text-gray-300" : ""}>
                    User ID
                  </Label>
                  <div
                    className={`p-2 ${darkMode ? "bg-gray-700" : "bg-gray-50"} rounded-md ${darkMode ? "text-gray-300" : ""}`}
                  >
                    {user?.id || "Not available"}
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="bio" className={darkMode ? "text-gray-300" : ""}>
                  Bio
                </Label>
                {isEditing ? (
                  <textarea
                    id="bio"
                    value={editedUser.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    placeholder="Tell us about yourself..."
                    className={`w-full p-2 border rounded-md min-h-[100px] resize-none ${
                      darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "border-gray-300"
                    }`}
                  />
                ) : (
                  <div
                    className={`p-2 ${darkMode ? "bg-gray-700" : "bg-gray-50"} rounded-md min-h-[100px] ${darkMode ? "text-gray-300" : ""}`}
                  >
                    {user?.bio || "No bio provided"}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card
            className={`animate-slide-up animation-delay-400 ${darkMode ? "bg-gray-800/70" : "bg-white/70"} backdrop-blur-sm`}
          >
            <CardHeader>
              <CardTitle className="text-red-600">Account Actions</CardTitle>
              <CardDescription className={darkMode ? "text-gray-400" : ""}>
                Manage your account settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>Sign Out</h3>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Sign out of your account on this device
                  </p>
                </div>
                <Button onClick={onLogout} variant="destructive" className="bg-red-600 hover:bg-red-700">
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
