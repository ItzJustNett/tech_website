"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { useNotification } from "@/contexts/notification-context"
import { Brain } from "lucide-react"

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("login")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login, register } = useAuth()
  const { showNotification } = useNotification()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.target as HTMLFormElement)
    const username = formData.get("username") as string
    const password = formData.get("password") as string

    if (!username || !password) {
      showNotification("Please fill in all fields", "error")
      setIsLoading(false)
      return
    }

    const result = await login(username, password)

    if (result.success) {
      showNotification("Login successful!", "success")
      router.push("/dashboard")
    } else {
      showNotification(result.error || "Login failed", "error")
    }

    setIsLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.target as HTMLFormElement)
    const username = formData.get("username") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (!username || !email || !password || !confirmPassword) {
      showNotification("Please fill in all fields", "error")
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      showNotification("Passwords do not match", "error")
      setIsLoading(false)
      return
    }

    const result = await register(username, password, email)

    if (result.success) {
      showNotification("Registration successful! Please log in.", "success")
      setActiveTab("login")
    } else {
      showNotification(result.error || "Registration failed", "error")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <Brain className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold">PureMind</h1>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" name="username" placeholder="Enter your username" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" placeholder="Enter your password" required />
                  </div>
                </CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <input
                    type="checkbox"
                    id="privacy-policy-login"
                    name="privacyPolicy"
                    className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                    required
                  />
                  <label htmlFor="privacy-policy-login" className="text-sm">
                    I agree to the{" "}
                    <a href="/privacy-policy" target="_blank" className="text-primary hover:underline" rel="noreferrer">
                      Privacy Policy
                    </a>
                  </label>
                </div>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Register</CardTitle>
                <CardDescription>Create a new account</CardDescription>
              </CardHeader>
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-username">Username</Label>
                    <Input id="reg-username" name="username" placeholder="Choose a username" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="Enter your email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <Input id="reg-password" name="password" type="password" placeholder="Choose a password" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <input
                    type="checkbox"
                    id="privacy-policy-register"
                    name="privacyPolicy"
                    className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                    required
                  />
                  <label htmlFor="privacy-policy-register" className="text-sm">
                    I agree to the{" "}
                    <a href="/privacy-policy" target="_blank" className="text-primary hover:underline" rel="noreferrer">
                      Privacy Policy
                    </a>
                  </label>
                </div>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Registering..." : "Register"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

