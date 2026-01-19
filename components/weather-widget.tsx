"use client"

import { useEffect, useState } from "react"

export default function WeatherWidget() {
  const [weather, setWeather] = useState("Sunny")
  const [temp, setTemp] = useState("72")

  useEffect(() => {
    // Simulate weather data
    const weatherOptions = ["Sunny", "Cloudy", "Rainy"]
    const tempOptions = ["68", "72", "76"]
    setWeather(weatherOptions[Math.floor(Math.random() * weatherOptions.length)])
    setTemp(tempOptions[Math.floor(Math.random() * tempOptions.length)])
  }, [])

  return (
    <div className="bg-gradient-to-br from-blue-400 to-indigo-500 rounded-3xl shadow-lg p-8 text-white space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-bold mb-2">Today's Weather</h3>
          <p className="text-lg opacity-90">{weather}</p>
        </div>
        <div className="text-5xl">🌤️</div>
      </div>
      <div className="text-5xl font-bold">{temp}°F</div>
      <p className="text-sm opacity-75">Perfect day to accomplish your goals!</p>
    </div>
  )
}
