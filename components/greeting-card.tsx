"use client"

import { useEffect, useState } from "react"

export default function GreetingCard() {
  const [hour, setHour] = useState(0)

  useEffect(() => {
    setHour(new Date().getHours())
  }, [])

  const getGreeting = () => {
    if (hour < 12) return "Good Morning"
    if (hour < 18) return "Good Afternoon"
    return "Good Evening"
  }

  const getEmoji = () => {
    if (hour < 12) return "☀️"
    if (hour < 18) return "🌤️"
    return "🌙"
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-12 text-center space-y-6 border border-blue-100 dark:border-slate-700">
      <div className="text-6xl">{getEmoji()}</div>
      <div className="space-y-2">
        <h1 className="text-5xl font-bold text-slate-900 dark:text-white">{getGreeting()}</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400">Welcome back! Ready to make today amazing?</p>
      </div>
      <div className="pt-4">
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-200">
          Get Started
        </button>
      </div>
    </div>
  )
}
