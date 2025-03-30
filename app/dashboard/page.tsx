"use client"

import { useEffect, useState } from "react"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useNotification } from "@/contexts/notification-context"
import { fetchWithAuth } from "@/lib/api-config"
import { Brain, BookOpen, TestTube, FlameIcon as Fire, Volume2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardData {
  lessons_count?: number
  lessons_available?: number
  total_lessons?: number
  completed_lessons?: number
  total_tests?: number
  completed_tests?: number
}

interface ProfileData {
  streak: {
    current_streak: number
    last_activity_date: string
    longest_streak: number
  }
  meowcoins: number
  xp: number
  cat_id?: number
}

// Available cat options
const CAT_OPTIONS = [
  { id: 0, name: "Gray Cat", image: "/images/cat-0.png" },
  { id: 1, name: "Orange Cat", image: "/images/cat-1.png" },
  { id: 10, name: "Black Cat", image: "/images/cat-10.png" },
]

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { showNotification } = useNotification()

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        // First, load profile data which contains streak information
        const profileResponse = await fetchWithAuth("/profiles/me")
        console.log("Profile data:", profileResponse)

        if (profileResponse && typeof profileResponse === "object") {
          // Set profile data including streak information
          setProfileData({
            streak: profileResponse.streak || {
              current_streak: 0,
              last_activity_date: "Never",
              longest_streak: 0,
            },
            meowcoins: profileResponse.meowcoins || 0,
            xp: profileResponse.xp || 0,
            cat_id: profileResponse.cat_id,
          })

          // Now load lessons data
          try {
            // Use GET method to fetch lessons data
            const lessonsData = await fetchWithAuth("/lessons")
            console.log("Lessons data:", lessonsData)

            // Get debug overview data
            const overviewData = await fetchWithAuth("/debug/overview")
            console.log("Overview data:", overviewData)

            // Combine data from both endpoints
            setDashboardData({
              lessons_count: lessonsData?.count || lessonsData?.length || 0,
              lessons_available: overviewData?.lessons_loaded || 0,
              total_lessons: overviewData?.total_lessons || 0,
              completed_lessons: overviewData?.completed_lessons || 0,
              total_tests: overviewData?.total_tests || 0,
              completed_tests: overviewData?.completed_tests || 0,
            })
          } catch (dataError) {
            console.error("Error loading dashboard data:", dataError)
            showNotification("Failed to load dashboard data", "error")
            setDashboardData({
              lessons_count: 0,
              lessons_available: 0,
              total_lessons: 0,
              completed_lessons: 0,
              total_tests: 0,
              completed_tests: 0,
            })
          }
        } else {
          console.error("Unexpected profile data format:", profileResponse)
          showNotification("Failed to load profile data: unexpected format", "error")

          // Set default values
          setProfileData({
            streak: {
              current_streak: 0,
              last_activity_date: "Never",
              longest_streak: 0,
            },
            meowcoins: 0,
            xp: 0,
            cat_id: 0,
          })

          setDashboardData({
            lessons_count: 0,
            lessons_available: 0,
            total_lessons: 0,
            completed_lessons: 0,
            total_tests: 0,
            completed_tests: 0,
          })
        }
      } catch (error) {
        console.error("Error loading data:", error)
        showNotification("Failed to load data", "error")

        // Set default values
        setProfileData({
          streak: {
            current_streak: 0,
            last_activity_date: "Never",
            longest_streak: 0,
          },
          meowcoins: 0,
          xp: 0,
          cat_id: 0,
        })

        setDashboardData({
          lessons_count: 0,
          lessons_available: 0,
          total_lessons: 0,
          completed_lessons: 0,
          total_tests: 0,
          completed_tests: 0,
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [showNotification])

  // Calculate level from XP
  const level = profileData ? Math.floor((profileData.xp || 0) / 100) + 1 : 1

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to PureMind Web Edition. An inclusive learning platform designed for all students, including those
            with special educational needs.
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                <Fire className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profileData?.streak?.current_streak || 0} days</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {profileData?.streak?.current_streak
                    ? "Keep up the great work!"
                    : "Complete a test today to start your streak!"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Lessons</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData?.lessons_count || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Available lessons</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Tests</CardTitle>
                <TestTube className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData?.completed_tests || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Tests completed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Level & XP</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Level {level}</div>
                <p className="text-xs text-muted-foreground mt-1">{profileData?.xp || 0} XP earned</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Streak Information</CardTitle>
              <CardDescription>Your learning consistency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center py-4">
                <div className="flex items-center justify-center h-24 w-24 mb-4">
                  <img
                    src={
                      profileData?.cat_id !== undefined
                        ? CAT_OPTIONS.find((cat) => cat.id === profileData.cat_id)?.image || "/images/cat-0.png"
                        : "/images/cat-0.png"
                    }
                    alt="Your cat"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-3xl font-bold mb-1">{profileData?.streak?.current_streak || 0} days</div>
                <p className="text-sm text-muted-foreground">
                  {profileData?.streak?.current_streak
                    ? "Keep up the great work!"
                    : "Complete a lesson today to start your streak!"}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Daily Goal</span>
                  <span className="text-sm">1 lesson per day</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Best Streak</span>
                  <span className="text-sm">{profileData?.streak?.longest_streak || 0} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Last Activity</span>
                  <span className="text-sm">{profileData?.streak?.last_activity_date || "Never"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Accessibility Features</CardTitle>
              <CardDescription>Tools to enhance your learning experience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Volume2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Text-to-Speech</p>
                      <p className="text-xs text-muted-foreground">Listen to lesson content</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => (window.location.href = "/ai-features?tab=accessibility")}
                  >
                    Use
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Simplified Summaries</p>
                      <p className="text-xs text-muted-foreground">Easier-to-read lesson content</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => (window.location.href = "/ai-features")}>
                    Use
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <TestTube className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Adaptive Tests</p>
                      <p className="text-xs text-muted-foreground">Tests tailored to your needs</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => (window.location.href = "/tests")}>
                    Use
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

