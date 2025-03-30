"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNotification } from "@/contexts/notification-context"
import { fetchWithAuth } from "@/lib/api-config"
import { ArrowLeft, BookOpen, FileText, Youtube, Sparkles } from "lucide-react"
import Link from "next/link"

interface Lesson {
  id: number
  title: string
  description: string
  content: string
  course_id: number
  course_name?: string
  youtube_url?: string
}

export default function LessonDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { showNotification } = useNotification()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [youtubeUrl, setYoutubeUrl] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      loadLesson(params.id as string)
    }
  }, [params.id])

  const loadLesson = async (id: string) => {
    setIsLoading(true)
    try {
      // Use the direct API URL to avoid CORS issues
      const data = await fetchWithAuth(`/lessons/${id}`)
      console.log("Lesson data:", data)

      if (data && typeof data === "object") {
        setLesson(data)

        // Try to load YouTube URL if available
        if (data.id) {
          try {
            const youtubeData = await fetchWithAuth(`/lessons/${data.id}/youtube`)
            if (youtubeData && youtubeData.url) {
              setYoutubeUrl(youtubeData.url)
            }
          } catch (error) {
            console.error("Error loading YouTube URL:", error)
          }
        }
      } else {
        console.error("Unexpected lesson data format:", data)
        showNotification("Failed to load lesson: unexpected data format", "error")
      }
    } catch (error) {
      console.error("Error loading lesson:", error)
      showNotification("Failed to load lesson", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const renderYoutubeEmbed = () => {
    if (!youtubeUrl) return null

    // Extract video ID from YouTube URL
    const videoId = youtubeUrl.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/,
    )?.[1]

    if (!videoId) return null

    return (
      <div className="aspect-video w-full mt-4">
        <iframe
          className="w-full h-full rounded-lg"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={lesson?.title || "Lesson video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    )
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Lesson Details</h1>
        </div>

        {isLoading ? (
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="aspect-video w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            </CardContent>
          </Card>
        ) : lesson ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>{lesson.title}</CardTitle>
                <CardDescription>
                  {lesson.course_name ? `Course: ${lesson.course_name}` : `Lesson ID: ${lesson.id}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p>{lesson.description || "No description available."}</p>
                </div>

                {youtubeUrl && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Video</h3>
                    {renderYoutubeEmbed()}
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold mb-2">Content</h3>
                  <div className="prose dark:prose-invert max-w-none">
                    {lesson.content ? (
                      <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
                    ) : (
                      <p>No content available for this lesson.</p>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2">
                <Button variant="outline" asChild>
                  <Link href={`/tests?lessonId=${lesson.id}`}>
                    <FileText className="mr-2 h-4 w-4" />
                    Take Test
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/ai-features?lessonId=${lesson.id}&action=summary`}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Summary
                  </Link>
                </Button>
                {youtubeUrl && (
                  <Button variant="outline" asChild>
                    <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">
                      <Youtube className="mr-2 h-4 w-4" />
                      Open in YouTube
                    </a>
                  </Button>
                )}
              </CardFooter>
            </Card>
          </>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Lesson not found</h3>
            <p className="text-muted-foreground">The requested lesson could not be found</p>
            <Button className="mt-4" asChild>
              <Link href="/lessons">Back to Lessons</Link>
            </Button>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  )
}

