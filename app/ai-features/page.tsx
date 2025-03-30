"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNotification } from "@/contexts/notification-context"
import { useAccessibility } from "@/contexts/accessibility-context"
import { fetchWithAuth } from "@/lib/api-config"
import { textToSpeech, stopSpeech, startVoiceRecognition } from "@/lib/accessibility-utils"
import { FileText, Download, Mic, Volume2, TestTube } from "lucide-react"
import ReactMarkdown from "react-markdown"

export default function AIFeaturesPage() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("summary")
  const [lessonId, setLessonId] = useState<string>(searchParams.get("lessonId") || "")
  const [isGenerating, setIsGenerating] = useState(false)
  const [summaryContent, setSummaryContent] = useState<string | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const { showNotification } = useNotification()
  const { settings } = useAccessibility()
  const recognitionRef = useRef<any>(null)
  const summaryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // If lessonId is provided in URL, set it in the form
    if (searchParams.get("lessonId")) {
      setLessonId(searchParams.get("lessonId") || "")

      // If action is also provided, switch to that tab and generate
      const action = searchParams.get("action")
      if (action === "summary") {
        setActiveTab("summary")
        generateSummary(searchParams.get("lessonId") || "")
      }
    }
  }, [searchParams])

  // Clean up speech and recognition when component unmounts
  useEffect(() => {
    return () => {
      stopSpeech()
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  // Auto-read content if read aloud is enabled
  useEffect(() => {
    if (settings.readAloud && summaryContent && !isSpeaking) {
      speakSummary()
    }
  }, [settings.readAloud, summaryContent])

  const generateSummary = async (id: string) => {
    if (!id) {
      showNotification("Please enter a lesson ID", "error")
      return
    }

    setIsGenerating(true)
    setSummaryContent(null)

    try {
      // Use direct API URL to avoid CORS issues
      console.log(`Generating summary for lesson ID: ${id}`)
      const data = await fetchWithAuth(`/lessons/${id}/conspect`)
      console.log("Summary data:", data)

      if (data && data.conspect) {
        setSummaryContent(data.conspect)
        showNotification("Summary generated successfully!", "success")

        // Auto-read if enabled
        if (settings.readAloud) {
          setTimeout(() => speakSummary(), 500)
        }
      } else {
        console.error("Unexpected summary data format:", data)
        showNotification("Failed to generate summary: unexpected data format", "error")
      }
    } catch (error) {
      console.error("Error generating summary:", error)
      showNotification("Failed to generate summary", "error")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateSummary = (e: React.FormEvent) => {
    e.preventDefault()
    generateSummary(lessonId)
  }

  const downloadSummary = () => {
    if (!summaryContent) return

    const element = document.createElement("a")
    const file = new Blob([summaryContent], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `summary-lesson-${lessonId}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const startVoiceInput = () => {
    if (isListening) return

    setIsListening(true)
    showNotification("Voice recognition started. Please speak the lesson ID.", "info")

    recognitionRef.current = startVoiceRecognition(
      (text) => {
        // Try to extract a number from the spoken text
        const match = text.match(/\d+/)
        if (match) {
          const extractedId = match[0]
          setLessonId(extractedId)
          showNotification(`Recognized lesson ID: ${extractedId}`, "success")
        }
      },
      () => {
        setIsListening(false)
      },
    )
  }

  const speakSummary = () => {
    if (!summaryContent || isSpeaking) return

    setIsSpeaking(true)
    showNotification("Text-to-speech started (Ukrainian)", "info")

    if (summaryRef.current) {
      summaryRef.current.classList.add("read-aloud-highlight")
    }

    // Clean up markdown syntax for better speech
    const cleanText = summaryContent
      .replace(/#+\s/g, "") // Remove heading markers
      .replace(/\*\*/g, "") // Remove bold markers
      .replace(/\*/g, "") // Remove italic markers
      .replace(/\[([^\]]+)\]$$[^)]+$$/g, "$1") // Replace links with just the text
      .replace(/`([^`]+)`/g, "$1") // Remove code markers
      .replace(/\n/g, ". ") // Replace newlines with periods for better pausing

    textToSpeech(cleanText, () => {
      setIsSpeaking(false)
      if (summaryRef.current) {
        summaryRef.current.classList.remove("read-aloud-highlight")
      }
    })
  }

  const stopSpeakingSummary = () => {
    stopSpeech()
    setIsSpeaking(false)
    if (summaryRef.current) {
      summaryRef.current.classList.remove("read-aloud-highlight")
    }
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Features</h1>
          <p className="text-muted-foreground">Accessibility tools to enhance your learning experience</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="summary">
              <FileText className="h-4 w-4 mr-2" />
              Summary
            </TabsTrigger>
            <TabsTrigger value="accessibility">
              <Volume2 className="h-4 w-4 mr-2" />
              Accessibility
            </TabsTrigger>
            <TabsTrigger value="test-generator">
              <TestTube className="h-4 w-4 mr-2" />
              Test Generator
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <Card>
              <CardHeader>
                <CardTitle>Generate Lesson Summary</CardTitle>
                <CardDescription>Create a concise summary of a lesson for easier comprehension</CardDescription>
              </CardHeader>
              <form onSubmit={handleGenerateSummary}>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="summary-lesson-id">Lesson ID</Label>
                    <div className="flex gap-2">
                      <Input
                        id="summary-lesson-id"
                        name="id"
                        placeholder="Enter lesson ID"
                        value={lessonId}
                        onChange={(e) => setLessonId(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={startVoiceInput}
                        disabled={isListening || !settings.voiceControl}
                        title={
                          settings.voiceControl
                            ? "Use voice to enter lesson ID"
                            : "Enable voice control in accessibility settings"
                        }
                      >
                        <Mic className={`h-4 w-4 ${isListening ? "text-red-500" : ""}`} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isGenerating}>
                    {isGenerating ? "Generating..." : "Generate Summary"}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            {summaryContent && (
              <Card className="mt-6">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Summary Result</CardTitle>
                    <CardDescription>Lesson {lessonId} summary</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {isSpeaking ? (
                      <Button variant="outline" size="icon" onClick={stopSpeakingSummary} title="Stop Reading">
                        <Volume2 className="h-4 w-4 text-red-500" />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={speakSummary}
                        title="Read Summary Aloud (Ukrainian)"
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="icon" onClick={downloadSummary} title="Download Summary">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    <div ref={summaryRef} className={isSpeaking ? "read-aloud-highlight" : ""}>
                      <ReactMarkdown>{summaryContent}</ReactMarkdown>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="accessibility">
            <Card>
              <CardHeader>
                <CardTitle>Accessibility Features</CardTitle>
                <CardDescription>Tools to make learning more accessible</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Voice Control</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Use voice commands to navigate and control the application. Helpful for students with motor
                    difficulties.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => showNotification("Voice control is available throughout the app", "info")}
                  >
                    <Mic className="h-4 w-4 mr-2" />
                    Learn About Voice Commands
                  </Button>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Text-to-Speech</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Convert any text to speech using Ukrainian voice. Beneficial for students with dyslexia, visual
                    impairments, or those who learn better through listening.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() =>
                      showNotification(
                        "Ukrainian text-to-speech is available for all lesson content and summaries",
                        "info",
                      )
                    }
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    Learn About Text-to-Speech
                  </Button>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Simplified Content</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    AI-generated summaries provide simplified versions of lessons, making content more accessible for
                    students with ADHD, autism, or cognitive disabilities.
                  </p>
                  <Button variant="outline" onClick={() => setActiveTab("summary")}>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Simplified Content
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="test-generator">
            <Card>
              <CardHeader>
                <CardTitle>Adaptive Test Generator</CardTitle>
                <CardDescription>Create personalized tests based on learning needs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Our AI can generate tests tailored to different learning styles and needs. Tests can be adapted for:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>Students with dyslexia (simplified language, audio options)</li>
                  <li>Students with ADHD (shorter, more focused questions)</li>
                  <li>Students with autism (clear instructions, reduced sensory distractions)</li>
                  <li>Students with various learning paces (adjustable difficulty)</li>
                </ul>
                <div className="pt-4">
                  <Button onClick={() => (window.location.href = "/tests")}>
                    <TestTube className="h-4 w-4 mr-2" />
                    Go to Test Generator
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticatedLayout>
  )
}

