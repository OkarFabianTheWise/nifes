"use client"

import { useEffect, useRef } from "react"

const NAMES = [
  "Sarah Johnson",
  "Michael Chen",
  "Emma Davis",
  "James Wilson",
  "Priya Patel",
  "Alex Rodriguez",
  "Jessica Thompson",
  "David Kim",
  "Rachel Lee",
  "Christopher Brown",
  "Maria Garcia",
  "Andrew Martinez",
  "Sofia Anderson",
  "Daniel Taylor",
  "Lauren White",
]

export default function ScrollingNames() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = scrollRef.current
    if (!element) return

    const clonedElement = element.cloneNode(true)
    element.parentElement?.appendChild(clonedElement)

    return () => {
      clonedElement.parentElement?.removeChild(clonedElement)
    }
  }, [])

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 rounded-lg p-6 shadow-lg">
      <div className="flex gap-4 whitespace-nowrap animate-scroll">
        <div ref={scrollRef} className="flex gap-4">
          {NAMES.map((name, i) => (
            <span
              key={i}
              className="inline-block px-4 py-2 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-full text-white text-lg font-medium hover:bg-white/20 dark:hover:bg-white/10 transition-colors duration-300 cursor-pointer"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
