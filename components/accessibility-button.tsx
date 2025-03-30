"use client"

import { Button } from "@/components/ui/button"
import { AccessibilityPanel } from "@/components/accessibility-panel"
import { useAccessibility } from "@/contexts/accessibility-context"
import { Accessibility } from "lucide-react"

export function AccessibilityButton() {
  const { toggleAccessibilityPanel, isAccessibilityPanelOpen } = useAccessibility()

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleAccessibilityPanel}
        aria-label="Accessibility settings"
        aria-expanded={isAccessibilityPanelOpen}
        aria-controls="accessibility-panel"
      >
        <Accessibility className="h-5 w-5" />
      </Button>
      <AccessibilityPanel />
    </div>
  )
}

