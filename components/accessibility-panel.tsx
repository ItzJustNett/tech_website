"use client"

import { useRef, useEffect } from "react"
import { useAccessibility } from "@/contexts/accessibility-context"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { X, Sun, Volume2, Mic, Type, Sparkles } from "lucide-react"

export function AccessibilityPanel() {
  const { settings, updateSettings, isAccessibilityPanelOpen, toggleAccessibilityPanel } = useAccessibility()
  const panelRef = useRef<HTMLDivElement>(null)

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        toggleAccessibilityPanel()
      }
    }

    if (isAccessibilityPanelOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isAccessibilityPanelOpen, toggleAccessibilityPanel])

  if (!isAccessibilityPanelOpen) return null

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-16 z-50 w-80 rounded-lg border bg-background p-4 shadow-lg"
      aria-labelledby="accessibility-title"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 id="accessibility-title" className="text-lg font-semibold">
          Accessibility Settings
        </h2>
        <Button variant="ghost" size="icon" onClick={toggleAccessibilityPanel} aria-label="Close accessibility panel">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="font-size">Font Size</Label>
            <span className="text-sm">{settings.fontSize}%</span>
          </div>
          <Slider
            id="font-size"
            min={75}
            max={200}
            step={5}
            value={[settings.fontSize]}
            onValueChange={(value) => updateSettings({ fontSize: value[0] })}
            aria-label="Adjust font size"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sun className="h-4 w-4" />
            <Label htmlFor="high-contrast">High Contrast</Label>
          </div>
          <Switch
            id="high-contrast"
            checked={settings.highContrast}
            onCheckedChange={(checked) => updateSettings({ highContrast: checked })}
            aria-label="Toggle high contrast mode"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Volume2 className="h-4 w-4" />
            <Label htmlFor="read-aloud">Read Aloud</Label>
          </div>
          <Switch
            id="read-aloud"
            checked={settings.readAloud}
            onCheckedChange={(checked) => updateSettings({ readAloud: checked })}
            aria-label="Toggle read aloud"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Mic className="h-4 w-4" />
            <Label htmlFor="voice-control">Voice Control</Label>
          </div>
          <Switch
            id="voice-control"
            checked={settings.voiceControl}
            onCheckedChange={(checked) => updateSettings({ voiceControl: checked })}
            aria-label="Toggle voice control"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Type className="h-4 w-4" />
            <Label htmlFor="dyslexic-font">Dyslexia-Friendly Font</Label>
          </div>
          <Switch
            id="dyslexic-font"
            checked={settings.dyslexicFont}
            onCheckedChange={(checked) => updateSettings({ dyslexicFont: checked })}
            aria-label="Toggle dyslexia-friendly font"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4" />
            <Label htmlFor="reduced-motion">Reduced Motion</Label>
          </div>
          <Switch
            id="reduced-motion"
            checked={settings.reducedMotion}
            onCheckedChange={(checked) => updateSettings({ reducedMotion: checked })}
            aria-label="Toggle reduced motion"
          />
        </div>

        <Button className="w-full" onClick={() => toggleAccessibilityPanel()}>
          Apply Settings
        </Button>
      </div>
    </div>
  )
}

