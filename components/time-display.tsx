"use client"

import { useEffect, useState } from "react"

export default function TimeDisplay() {
  const [time, setTime] = useState("")
  const [date, setDate] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }))
      setDate(now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }))
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-1">
      <h2 className="text-4xl font-bold text-slate-900 dark:text-white">{time}</h2>
      <p className="text-lg text-slate-600 dark:text-slate-400">{date}</p>
    </div>
  )
}
