"use client"

import { useEffect, useState } from "react"
import GreetingCard from "@/components/greeting-card"
import WeatherWidget from "@/components/weather-widget"
import MotivationalQuote from "@/components/motivational-quote"
import TimeDisplay from "@/components/time-display"
import DailyTasks from "@/components/daily-tasks"
import ScrollingNames from "@/components/scrolling-names"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 mb-12">
          <TimeDisplay />
        </div>

        <ScrollingNames />

        {/* Main greeting card */}
        <GreetingCard />

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <WeatherWidget />
          <MotivationalQuote />
        </div>

        {/* Daily tasks */}
        <DailyTasks />
      </div>
    </main>
  )
}
