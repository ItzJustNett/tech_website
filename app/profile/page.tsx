"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useNotification } from "@/contexts/notification-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit2, FlameIcon as Fire, BookOpen, Star } from "lucide-react"
import { fetchWithAuth } from "@/lib/api-config"
import { Progress } from "@/components/ui/progress"

// Define the complete profile data structure based on the API response
interface ProfileData {
  name: string
  about: string
  cat_id: number
  meowcoins: number
  xp: number
  level?: number
  user_id: string
  illness_id?: number
  illness_name?: string
  illness_name_ua?: string
  equipped_items: Array<{
    id: number
    name: string
    type: string
  }>
  inventory: Array<any>
  streak: {
    current_streak: number
    last_activity_date: string
    longest_streak: number
  }
  completed_exercises: Record<
    string,
    {
      completion_count: number
      correct_answers: number
      meowcoins_earned: number
      timestamp: string
      xp_earned: number
    }
  >
}

// Available cat options
const CAT_OPTIONS = [
  { id: 0, name: "Gray Cat", image: "/images/cat-0.png" },
  { id: 1, name: "Orange Cat", image: "/images/cat-1.png" },
  { id: 10, name: "Black Cat", image: "/images/cat-10.png" },
]

// Available illness options
const ILLNESS_OPTIONS = [
  { id: 0, name: "None" },
  { id: 1, name: "Dyslexia" },
  { id: 2, name: "ADHD" },
  { id: 3, name: "Autism" },
]

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { showNotification } = useNotification()

  // Load profile data once on component mount
  useEffect(() => {
    loadProfileData()
  }, [])

  // Function to load profile data
  const loadProfileData = async () => {
    setIsLoading(true)
    try {
      const data = await fetchWithAuth("/profiles/me")
      console.log("Profile data:", data)

      if (data && typeof data === "object") {
        // Set all profile data at once
        setProfileData({
          // Ensure all required fields have default values if missing
          name: data.name || "User",
          about: data.about || "No bio available",
          cat_id: data.cat_id !== undefined ? data.cat_id : 0,
          meowcoins: data.meowcoins || 0,
          xp: data.xp || 0,
          level: data.level || Math.floor((data.xp || 0) / 100) + 1,
          user_id: data.user_id || "unknown",
          illness_id: data.illness_id || 0,
          illness_name: data.illness_name || "None",
          illness_name_ua: data.illness_name_ua || "Немає",
          equipped_items: data.equipped_items || [],
          inventory: data.inventory || [],
          streak: data.streak || {
            current_streak: 0,
            last_activity_date: "Never",
            longest_streak: 0,
          },
          completed_exercises: data.completed_exercises || {},
        })
      } else {
        console.error("Unexpected profile data format:", data)
        showNotification("Failed to load profile data: unexpected format", "error")
        setDefaultProfileData()
      }
    } catch (error) {
      console.error("Error loading profile data:", error)
      showNotification("Failed to load profile data", "error")
      setDefaultProfileData()
    } finally {
      setIsLoading(false)
    }
  }

  // Set default profile data when API fails
  const setDefaultProfileData = () => {
    setProfileData({
      name: "User",
      about: "No bio available",
      cat_id: 0,
      meowcoins: 0,
      xp: 0,
      level: 1,
      user_id: "unknown",
      illness_id: 0,
      illness_name: "None",
      illness_name_ua: "Немає",
      equipped_items: [],
      inventory: [],
      streak: {
        current_streak: 0,
        last_activity_date: "Never",
        longest_streak: 0,
      },
      completed_exercises: {},
    })
  }

  // Handle form submission for profile updates
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const formData = new FormData(e.target as HTMLFormElement)
      const name = formData.get("name") as string
      const about = formData.get("about") as string
      const catId = Number.parseInt(formData.get("cat-id") as string)

      if (!name || !about) {
        showNotification("Please fill in all required fields", "error")
        setIsSaving(false)
        return
      }

      // Update profile via API - using POST instead of PUT
      const updateData = {
        name,
        about,
        cat_id: catId,
        illness_id: 0, // Always set to "none"
      }

      const response = await fetchWithAuth("/profiles", {
        method: "POST", // Use POST instead of PUT
        body: JSON.stringify(updateData),
      })

      console.log("Profile update response:", response)
      showNotification("Profile updated successfully!", "success")
      setIsEditing(false)

      // Update profile data with the new values
      if (profileData) {
        setProfileData({
          ...profileData,
          name,
          about,
          cat_id: catId,
          illness_id: 0,
          illness_name: "None",
        })
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      showNotification("Failed to update profile", "error")
    } finally {
      setIsSaving(false)
    }
  }

  // Calculate stats from profile data
  const totalCompletedExercises = profileData?.completed_exercises
    ? Object.keys(profileData.completed_exercises).length
    : 0

  const totalCorrectAnswers = profileData?.completed_exercises
    ? Object.values(profileData.completed_exercises).reduce((sum, exercise) => sum + exercise.correct_answers, 0)
    : 0

  // Calculate XP progress for the current level
  const xpProgress = profileData ? profileData.xp % 100 : 0
  const xpNeeded = 100 - xpProgress

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and preferences</p>
        </div>

        {isLoading ? (
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="profile">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
              <TabsTrigger value="items">Items & Accessories</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Manage your public profile details</CardDescription>
                  </div>
                  {!isEditing && (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </CardHeader>

                {isEditing ? (
                  <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          name="name"
                          defaultValue={profileData?.name || ""}
                          placeholder="Your name"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="about">About</Label>
                        <Textarea
                          id="about"
                          name="about"
                          defaultValue={profileData?.about || ""}
                          placeholder="Tell us about yourself"
                          rows={4}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Select Your Cat</Label>
                        <RadioGroup defaultValue={profileData?.cat_id?.toString() || "0"} name="cat-id">
                          <div className="grid grid-cols-3 gap-4">
                            {CAT_OPTIONS.map((cat) => (
                              <div key={cat.id} className="flex flex-col items-center space-y-2">
                                <RadioGroupItem value={cat.id.toString()} id={`cat-${cat.id}`} className="sr-only" />
                                <Label
                                  htmlFor={`cat-${cat.id}`}
                                  className="flex flex-col items-center space-y-2 cursor-pointer"
                                >
                                  <div
                                    className={`h-24 w-24 rounded-lg overflow-hidden flex items-center justify-center ${
                                      profileData?.cat_id === cat.id ? "ring-2 ring-primary" : ""
                                    }`}
                                  >
                                    <img
                                      src={cat.image || "/placeholder.svg"}
                                      alt={cat.name}
                                      className="w-full h-full object-contain"
                                    />
                                  </div>
                                  <span>{cat.name}</span>
                                </Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      </div>
                    </CardContent>

                    <CardFooter className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                    </CardFooter>
                  </form>
                ) : (
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">Name</h3>
                      <p className="mt-1">{profileData?.name || "Not set"}</p>
                    </div>

                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">About</h3>
                      <p className="mt-1">{profileData?.about || "Not set"}</p>
                    </div>

                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">User ID</h3>
                      <p className="mt-1">{profileData?.user_id || "Not available"}</p>
                    </div>

                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">Cat</h3>
                      <div className="mt-1 flex items-center space-x-2">
                        <div className="h-16 w-16 rounded-lg overflow-hidden flex items-center justify-center">
                          {profileData?.cat_id !== undefined && (
                            <img
                              src={
                                CAT_OPTIONS.find((cat) => cat.id === profileData.cat_id)?.image || "/images/cat-0.png"
                              }
                              alt={`Cat ${profileData?.cat_id}`}
                              className="w-full h-full object-contain"
                            />
                          )}
                        </div>
                        <span>{CAT_OPTIONS.find((cat) => cat.id === profileData?.cat_id)?.name || "Cat 0"}</span>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Statistics</CardTitle>
                  <CardDescription>Your account information and stats</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Meowcoins</span>
                    <span className="font-medium">{profileData?.meowcoins || 0} 🪙</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">XP</span>
                    <span className="font-medium">{profileData?.xp || 0} ✨</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Level</span>
                    <span className="font-medium">{profileData?.level || 1}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Current Streak</span>
                    <span className="font-medium">{profileData?.streak?.current_streak || 0} days 🔥</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Longest Streak</span>
                    <span className="font-medium">{profileData?.streak?.longest_streak || 0} days 🏆</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Last Activity</span>
                    <span className="font-medium">{profileData?.streak?.last_activity_date || "Never"} 📅</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Progress</CardTitle>
                  <CardDescription>Your learning achievements and statistics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">XP Progress</span>
                      <span className="text-sm text-muted-foreground">{xpProgress} / 100</span>
                    </div>
                    <Progress value={xpProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground">{xpNeeded} XP until next level</p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex flex-col items-center p-4 border rounded-lg">
                      <BookOpen className="h-8 w-8 text-primary mb-2" />
                      <span className="text-2xl font-bold">{totalCompletedExercises}</span>
                      <span className="text-sm text-muted-foreground">Completed Exercises</span>
                    </div>
                    <div className="flex flex-col items-center p-4 border rounded-lg">
                      <Star className="h-8 w-8 text-amber-500 mb-2" />
                      <span className="text-2xl font-bold">{totalCorrectAnswers}</span>
                      <span className="text-sm text-muted-foreground">Correct Answers</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Streak Information</h3>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
                        <Fire className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="text-lg font-bold">{profileData?.streak?.current_streak || 0} days</div>
                        <p className="text-xs text-muted-foreground">
                          Last activity: {profileData?.streak?.last_activity_date || "Never"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your recent learning activities</CardDescription>
                </CardHeader>
                <CardContent>
                  {profileData?.completed_exercises && Object.entries(profileData.completed_exercises).length > 0 ? (
                    <div className="space-y-4">
                      {Object.entries(profileData.completed_exercises)
                        .sort((a, b) => {
                          const dateA = new Date(a[1].timestamp).getTime()
                          const dateB = new Date(b[1].timestamp).getTime()
                          return dateB - dateA // Sort by most recent first
                        })
                        .slice(0, 5) // Show only the 5 most recent
                        .map(([key, exercise]) => {
                          // Extract lesson name from key
                          const lessonName = key.replace(/^lesson_|^course_/, "").replace(/-/g, " ")

                          return (
                            <div key={key} className="flex justify-between items-center p-3 border rounded-md">
                              <div>
                                <p className="text-sm font-medium capitalize">
                                  {lessonName.length > 40 ? `${lessonName.substring(0, 40)}...` : lessonName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(exercise.timestamp).toLocaleDateString()} • Score:{" "}
                                  {exercise.correct_answers} •{exercise.meowcoins_earned} 🪙
                                </p>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span className="text-xs font-medium">{exercise.xp_earned}</span>
                                <span className="text-xs">✨</span>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <p>No recent activity</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="items">
              <Card>
                <CardHeader>
                  <CardTitle>Items & Accessories</CardTitle>
                  <CardDescription>Manage your items and accessories</CardDescription>
                </CardHeader>
                <CardContent>
                  {profileData?.equipped_items && profileData.equipped_items.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                      {profileData.equipped_items.map((item, index) => (
                        <div key={index} className="flex flex-col items-center p-2 border rounded-md">
                          <div className="h-16 w-16 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center mb-2">
                            <span className="text-2xl">{item.type === "hat" ? "🎩" : "👓"}</span>
                          </div>
                          <span className="text-sm font-medium">{item.name}</span>
                          <span className="text-xs text-muted-foreground">{item.type}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <p>No items equipped</p>
                    </div>
                  )}

                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Inventory</h3>
                    {profileData?.inventory && profileData.inventory.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                        {profileData.inventory.map((item, index) => (
                          <div key={index} className="flex flex-col items-center p-2 border rounded-md">
                            <div className="h-16 w-16 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center mb-2">
                              <span className="text-2xl">🎁</span>
                            </div>
                            <span className="text-sm font-medium">{item.name || "Item"}</span>
                            <span className="text-xs text-muted-foreground">{item.type || "Accessory"}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <p>No items in inventory</p>
                        <p className="text-xs mt-2">Visit the store to purchase items with your Meowcoins!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AuthenticatedLayout>
  )
}

