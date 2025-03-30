"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNotification } from "@/contexts/notification-context"
import { useAccessibility } from "@/contexts/accessibility-context"
import { fetchWithAuth } from "@/lib/api-config"
import { textToSpeech, stopSpeech } from "@/lib/accessibility-utils"
import { TestTube, CheckCircle, AlertCircle, Volume2 } from "lucide-react"

interface TestQuestion {
  id: number
  question: string
  options: string[]
  correct_option?: number
  correct_answer?: number
}

interface TestResult {
  score: number
  total: number
  percentage: number
  passed: boolean
  rewards?: {
    xp: number
    meowcoins: number
  }
}

export default function TestsPage() {
  const searchParams = useSearchParams()
  const [lessonId, setLessonId] = useState<string>(searchParams.get("lessonId") || "")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [testQuestions, setTestQuestions] = useState<TestQuestion[]>([])
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({})
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentSpeakingIndex, setCurrentSpeakingIndex] = useState<number | null>(null)
  const { showNotification } = useNotification()
  const { settings } = useAccessibility()
  const questionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // If lessonId is provided in URL, generate test automatically
    if (searchParams.get("lessonId")) {
      setLessonId(searchParams.get("lessonId") || "")
      generateTest(searchParams.get("lessonId") || "")
    }
  }, [searchParams])

  // Clean up speech when component unmounts
  useEffect(() => {
    return () => {
      stopSpeech()
    }
  }, [])

  const generateTest = async (id: string) => {
    if (!id) {
      showNotification("Please enter a lesson ID", "error")
      return
    }

    setIsGenerating(true)
    setTestQuestions([])
    setUserAnswers({})
    setTestResult(null)

    try {
      // Use direct API URL to avoid CORS issues
      console.log(`Generating test for lesson ID: ${id}`)
      const data = await fetchWithAuth(`/lessons/${id}/test`)
      console.log("Test data:", data)

      if (data && Array.isArray(data.questions)) {
        setTestQuestions(data.questions)
        showNotification("Test generated successfully", "success")
      } else {
        console.error("Unexpected test data format:", data)
        showNotification("Failed to generate test: unexpected data format", "error")
      }
    } catch (error) {
      console.error("Error generating test:", error)
      showNotification("Failed to generate test", "error")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateTest = (e: React.FormEvent) => {
    e.preventDefault()
    generateTest(lessonId)
  }

  const handleAnswerChange = (questionIndex: number, optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }))
  }

  // Calculate correct answers for the test
  const calculateCorrectAnswers = () => {
    return testQuestions.reduce((count, question, index) => {
      const userAnswer = userAnswers[index]
      const correctAnswer = question.correct_answer !== undefined ? question.correct_answer : question.correct_option
      return userAnswer === correctAnswer ? count + 1 : count
    }, 0)
  }

  // Fixed test submission logic
  const handleSubmitTest = async () => {
    // Check if all questions are answered
    if (Object.keys(userAnswers).length < testQuestions.length) {
      showNotification("Please answer all questions before submitting", "error")
      return
    }

    setIsSubmitting(true)

    try {
      // Calculate correct answers
      const correctAnswers = calculateCorrectAnswers()

      // Format answers for submission
      const answers = Object.entries(userAnswers).map(([questionIndex, answerIndex]) => ({
        question_id: testQuestions[Number.parseInt(questionIndex)].id,
        selected_option: answerIndex,
      }))

      // Submit answers to the API with the correct format
      const submitData = {
        lesson_id: Number.parseInt(lessonId),
        answers: answers,
        correct_answers: correctAnswers, // Add the required field
      }

      console.log("Submitting test answers:", submitData)

      try {
        // Try to submit answers to the API
        const response = await fetchWithAuth(`/exercises/${lessonId}/check`, {
          method: "POST",
          body: JSON.stringify(submitData),
        })

        console.log("Test submission response:", response)

        if (response && typeof response === "object") {
          // Use the API response for the result
          const result = {
            score: response.correct_answers || correctAnswers,
            total: testQuestions.length,
            percentage: Math.round(((response.correct_answers || correctAnswers) / testQuestions.length) * 100),
            passed: (response.correct_answers || correctAnswers) / testQuestions.length > 0.5,
            rewards: {
              xp: response.xp_earned || 0,
              meowcoins: response.meowcoins_earned || 0,
            },
          }

          setTestResult(result)
          showNotification(
            result.passed ? "Test completed successfully!" : "Test completed. Keep practicing!",
            result.passed ? "success" : "info",
          )
        } else {
          throw new Error("Invalid response format")
        }
      } catch (submitError) {
        console.error("Error submitting to API, using local calculation:", submitError)

        // Fallback to local calculation if API submission fails
        const result = {
          score: correctAnswers,
          total: testQuestions.length,
          percentage: Math.round((correctAnswers / testQuestions.length) * 100),
          passed: correctAnswers > testQuestions.length / 2,
          rewards: {
            xp: correctAnswers > testQuestions.length / 2 ? 10 : 5,
            meowcoins: correctAnswers > testQuestions.length / 2 ? 20 : 10,
          },
        }

        setTestResult(result)
        showNotification(
          result.passed ? "Test completed successfully!" : "Test completed. Keep practicing!",
          result.passed ? "success" : "info",
        )
      }
    } catch (error) {
      console.error("Error submitting test:", error)
      showNotification("Failed to submit test", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Function to read a question aloud in Ukrainian
  const speakQuestion = (questionIndex: number) => {
    if (isSpeaking) {
      stopSpeech()
      setIsSpeaking(false)
      setCurrentSpeakingIndex(null)
      return
    }

    const question = testQuestions[questionIndex]
    if (!question) return

    setIsSpeaking(true)
    setCurrentSpeakingIndex(questionIndex)

    // Prepare text to speak - question and options
    const textToRead = `${question.question} Варіанти відповідей: ${question.options.map((opt, idx) => `${idx + 1}: ${opt}`).join(". ")}`

    // Use Ukrainian voice
    textToSpeech(textToRead, () => {
      setIsSpeaking(false)
      setCurrentSpeakingIndex(null)
    })
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tests</h1>
          <p className="text-muted-foreground">Generate and take tests for lessons</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Generate Lesson Test</CardTitle>
            <CardDescription>Create a test for a specific lesson</CardDescription>
          </CardHeader>
          <form onSubmit={handleGenerateTest}>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="lesson-id">Lesson ID</Label>
                <Input
                  id="lesson-id"
                  name="id"
                  placeholder="Enter lesson ID"
                  value={lessonId}
                  onChange={(e) => setLessonId(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isGenerating}>
                {isGenerating ? "Generating..." : "Generate Test"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {testQuestions.length > 0 && !testResult && (
          <Card>
            <CardHeader>
              <CardTitle>Test Questions</CardTitle>
              <CardDescription>Answer all questions and submit the test</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6" ref={questionsRef}>
                {testQuestions.map((question, index) => (
                  <div key={index} className="space-y-2 border-b pb-6 last:border-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Question {index + 1}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => speakQuestion(index)}
                        className="flex items-center gap-1"
                      >
                        <Volume2
                          className={`h-4 w-4 ${currentSpeakingIndex === index && isSpeaking ? "text-red-500" : ""}`}
                        />
                        <span>{currentSpeakingIndex === index && isSpeaking ? "Stop" : "Read in Ukrainian"}</span>
                      </Button>
                    </div>
                    <p className={currentSpeakingIndex === index && isSpeaking ? "read-aloud-highlight" : ""}>
                      {question.question}
                    </p>
                    <div className="space-y-2 mt-2">
                      {question.options.map((option, optionIndex) => (
                        <div key={`q${index}-o${optionIndex}`} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={`q${index}_o${optionIndex}`}
                            name={`q${index}`}
                            value={optionIndex}
                            checked={userAnswers[index] === optionIndex}
                            onChange={() => handleAnswerChange(index, optionIndex)}
                            className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                          />
                          <label
                            htmlFor={`q${index}_o${optionIndex}`}
                            className={`text-sm ${currentSpeakingIndex === index && isSpeaking ? "read-aloud-highlight" : ""}`}
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSubmitTest}
                disabled={isSubmitting || Object.keys(userAnswers).length < testQuestions.length}
              >
                {isSubmitting ? "Submitting..." : "Submit Test"}
              </Button>
            </CardFooter>
          </Card>
        )}

        {testResult && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>Your performance on this test</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="test-results">
                <div className="flex items-center space-x-2">
                  {testResult.passed ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-amber-500" />
                  )}
                  <span className="text-xl font-bold">
                    Score: {testResult.score}/{testResult.total} ({testResult.percentage}%)
                  </span>
                </div>
                <p className="text-sm mt-2">
                  {testResult.passed
                    ? "Congratulations! You passed the test."
                    : "Keep practicing to improve your score."}
                </p>
                {testResult.rewards && (
                  <div className="test-rewards mt-4 p-3 bg-primary/10 rounded-md">
                    <p className="text-sm font-medium">Rewards earned:</p>
                    <div className="flex space-x-4 mt-1">
                      <span>{testResult.rewards.xp} XP</span>
                      <span>{testResult.rewards.meowcoins} Meowcoins</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => generateTest(lessonId)}>Take Test Again</Button>
            </CardFooter>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Test Tips</CardTitle>
            <TestTube className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Read each question carefully before answering</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Take your time - there's no time limit</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>You can retake tests to improve your score</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Earn meowcoins and XP for completing tests</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Use the Ukrainian read aloud feature for better comprehension</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}

