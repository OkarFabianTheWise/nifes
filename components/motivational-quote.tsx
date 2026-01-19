"use client"

import { useEffect, useState } from "react"

export default function MotivationalQuote() {
  const [quote, setQuote] = useState("")

  useEffect(() => {
    const quotes = [
      "The only way to do great work is to love what you do.",
      "Believe you can and you're halfway there.",
      "Your time is limited, don't waste it living someone else's life.",
      "The future belongs to those who believe in the beauty of their dreams.",
      "It is during our darkest moments that we must focus to see the light.",
    ]
    setQuote(quotes[Math.floor(Math.random() * quotes.length)])
  }, [])

  return (
    <div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-3xl shadow-lg p-8 text-white space-y-4">
      <h3 className="text-2xl font-bold">Daily Inspiration</h3>
      <blockquote className="text-xl italic font-light leading-relaxed">"{quote}"</blockquote>
      <p className="text-sm opacity-75">✨ Make it a great day</p>
    </div>
  )
}
