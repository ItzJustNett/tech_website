"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AccessibilitySettings {
  fontSize: number
  highContrast: boolean
  readAloud: boolean
  voiceControl: boolean
  dyslexicFont: boolean
  reducedMotion: boolean
}

interface AccessibilityContextType {
  settings: AccessibilitySettings
  updateSettings: (settings: Partial<AccessibilitySettings>) => void
  toggleAccessibilityPanel: () => void
  isAccessibilityPanelOpen: boolean
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 100,
  highContrast: false,
  readAloud: false,
  voiceControl: false,
  dyslexicFont: false,
  reducedMotion: false,
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings)
  const [isAccessibilityPanelOpen, setIsAccessibilityPanelOpen] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("accessibilitySettings")
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (e) {
        console.error("Failed to parse accessibility settings", e)
      }
    }
  }, [])

  // Apply settings whenever they change
  useEffect(() => {
    // Save to localStorage
    localStorage.setItem("accessibilitySettings", JSON.stringify(settings))

    // Apply font size
    document.documentElement.style.fontSize = `${settings.fontSize}%`

    // Apply high contrast
    if (settings.highContrast) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }

    // Apply dyslexic font
    if (settings.dyslexicFont) {
      document.documentElement.classList.add("dyslexic-font")
    } else {
      document.documentElement.classList.remove("dyslexic-font")
    }

    // Apply reduced motion
    if (settings.reducedMotion) {
      document.documentElement.classList.add("reduced-motion")
    } else {
      document.documentElement.classList.remove("reduced-motion")
    }
  }, [settings])

  // Initialize speech recognition if voice control is enabled
  useEffect(() => {
    if (settings.voiceControl) {
      initVoiceControl()
    } else {
      stopVoiceControl()
    }

    return () => {
      stopVoiceControl()
    }
  }, [settings.voiceControl])

  const initVoiceControl = () => {
    // Check if browser supports speech recognition
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      console.warn("Speech recognition not supported in this browser")
      return
    }

    // This would be implemented with the Web Speech API in a real app
    console.log("Voice control initialized")
  }

  const stopVoiceControl = () => {
    // Stop voice control
    console.log("Voice control stopped")
  }

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  const toggleAccessibilityPanel = () => {
    setIsAccessibilityPanelOpen((prev) => !prev)
  }

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        updateSettings,
        toggleAccessibilityPanel,
        isAccessibilityPanelOpen,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider")
  }
  return context
}

