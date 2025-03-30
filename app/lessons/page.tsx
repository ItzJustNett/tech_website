"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNotification } from "@/contexts/notification-context"
import { fetchWithAuth } from "@/lib/api-config"
import { BookOpen, Search, FileText, Sparkles } from "lucide-react"
import Link from "next/link"

interface Lesson {
  id: number
  title: string
  description: string
  course_id: number
  course_name?: string
}

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const { showNotification } = useNotification()

  useEffect(() => {
    loadLessons()
  }, [])

  const loadLessons = async () => {
    setIsLoading(true)
    try {
      // Use the direct API URL to avoid CORS issues
      const data = await fetchWithAuth("/lessons")
      console.log("Lessons data:", data)

      if (Array.isArray(data)) {
        setLessons(data)
      } else if (data && typeof data === "object" && Array.isArray(data.lessons)) {
        setLessons(data.lessons)
      } else {
        console.error("Unexpected lessons data format:", data)
        showNotification("Failed to load lessons: unexpected data format", "error")
      }
    } catch (error) {
      console.error("Error loading lessons:", error)
      showNotification("Failed to load lessons", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      return loadLessons()
    }

    setIsLoading(true)
    try {
      // Use the direct API URL to avoid CORS issues
      const data = await fetchWithAuth(`/lessons/search?q=${encodeURIComponent(searchQuery)}`)

      if (Array.isArray(data)) {
        setLessons(data)
      } else if (data && typeof data === "object" && Array.isArray(data.lessons)) {
        setLessons(data.lessons)
      } else {
        console.error("Unexpected search results format:", data)
        showNotification("Failed to search lessons: unexpected data format", "error")
      }
    } catch (error) {
      console.error("Error searching lessons:", error)
      showNotification("Failed to search lessons", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredLessons = searchQuery
    ? lessons.filter(
        (lesson) =>
          lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lesson.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : lessons

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Lessons</h1>
            <p className="text-muted-foreground">Browse and study available lessons</p>
          </div>
          <form onSubmit={handleSearch} className="flex w-full sm:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search lessons..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" className="ml-2">
              Search
            </Button>
          </form>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                </CardContent>
                <CardFooter>
                  <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : filteredLessons.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredLessons.map((lesson) => (
              <Card key={lesson.id}>
                <CardHeader>
                  <CardTitle>{lesson.title}</CardTitle>
                  <CardDescription>
                    {lesson.course_name ? `Course: ${lesson.course_name}` : `Lesson ID: ${lesson.id}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{lesson.description || "No description available for this lesson."}</p>
                </CardContent>
                <CardFooter className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/lessons/${lesson.id}`}>
                      <BookOpen className="mr-2 h-4 w-4" />
                      View
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/tests?lessonId=${lesson.id}`}>
                      <FileText className="mr-2 h-4 w-4" />
                      Test
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/ai-features?lessonId=${lesson.id}&action=summary`}>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Summary
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No lessons found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? "Try a different search term" : "No lessons are available at the moment"}
            </p>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  )
}

