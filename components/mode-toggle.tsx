"use client"
import { Moon, Sun, Palette } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Mode</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="h-4 w-4 mr-2" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="h-4 w-4 mr-2" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Palette className="h-4 w-4 mr-2" />
          System
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Light Themes</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setTheme("light-blue")}>
          <div className="h-4 w-4 rounded-full bg-blue-500 mr-2" />
          Blue
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("light-pink")}>
          <div className="h-4 w-4 rounded-full bg-pink-500 mr-2" />
          Pink
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("light-green")}>
          <div className="h-4 w-4 rounded-full bg-green-500 mr-2" />
          Green
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("light-violet")}>
          <div className="h-4 w-4 rounded-full bg-violet-500 mr-2" />
          Violet
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

