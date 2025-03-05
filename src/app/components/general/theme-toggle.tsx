"use client";

import { Moon, Sun } from "lucide-react"
import { Button } from "@/app/components/general/button"
import { useTheme } from "@/app/components/context/ThemeContext"
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <Button
      variant="outline"
      className="bg-background border border-gray text-gray-600 hover:white dark:text-gray-200 h-10"
      onClick={toggleTheme}
    >
      <AnimatePresence mode="wait">
        {isDarkMode ? (
          <motion.div
            key="moon"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.8 }}
          >
            <Moon className="text-white" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
          >
            <Sun className="text-yellow-500" />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  )
}