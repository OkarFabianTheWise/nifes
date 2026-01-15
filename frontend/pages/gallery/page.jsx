"use client"

import { useState } from "react"

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const galleryImages = [
    {
      id: 1,
      src: "/images/grag.jpeg",
      alt: "NIFES student",
      size: "lg",
      rotation: -3,
      position: "col-span-2 row-span-2",
    },
    {
      id: 2,
      src: "/images/agi.jpeg",
      alt: "NIFES community",
      size: "md",
      rotation: 4,
      position: "col-span-1 row-span-1",
    },
    {
      id: 3,
      src: "/images/tabat.jpeg",
      alt: "NIFES fellowship",
      size: "md",
      rotation: -5,
      position: "col-span-1 row-span-2",
    },
    {
      id: 4,
      src: "/images/prayo.jpeg",
      alt: "NIFES prayer",
      size: "sm",
      rotation: 6,
      position: "col-span-1 row-span-1",
    },
    {
      id: 5,
      src: "/images/sisters.jpeg",
      alt: "NIFES sisters",
      size: "lg",
      rotation: -4,
      position: "col-span-2 row-span-2",
    },
    {
      id: 6,
      src: "/images/birthday.jpeg",
      alt: "NIFES celebration",
      size: "md",
      rotation: 3,
      position: "col-span-1 row-span-1",
    },
    {
      id: 7,
      src: "/images/ndpf.jpeg",
      alt: "NIFES prayer and fasting",
      size: "md",
      rotation: -6,
      position: "col-span-1 row-span-1",
    },
    {
      id: 8,
      src: "/images/vp.jpeg",
      alt: "NIFES leader",
      size: "md",
      rotation: 5,
      position: "col-span-1 row-span-1",
    },
    {
      id: 9,
      src: "/images/serp.jpeg",
      alt: "NIFES speaker",
      size: "lg",
      rotation: -2,
      position: "col-span-2 row-span-1",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-3">NIFES</h1>
          <p className="text-sm sm:text-base text-neutral-600 max-w-lg leading-relaxed">
            Nigeria Fellowship of Evangelical Students. Building tomorrow's leaders today.
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-max gap-4 sm:gap-6">
            {galleryImages.map((image, index) => (
              <div
                key={image.id}
                className={`${image.position} group cursor-pointer relative animate-in fade-in duration-500`}
                style={{
                  animationDelay: `${index * 60}ms`,
                  animationFillMode: "both",
                }}
              >
                {index % 3 === 0 && <div className="absolute -inset-4 bg-yellow-300/40 rounded-3xl -rotate-12 -z-10" />}
                {index % 4 === 0 && (
                  <div className="absolute -inset-6 border-2 border-red-400/30 rounded-2xl rotate-6 -z-10" />
                )}
                {index % 5 === 0 && <div className="absolute -inset-3 bg-blue-200/20 rounded-full -z-10" />}

                <div
                  className="relative w-full h-full overflow-hidden rounded-2xl bg-neutral-100 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105"
                  style={{
                    transform: `rotate(${image.rotation}deg)`,
                  }}
                  onClick={() => setSelectedImage(image.src)}
                >
                  <img
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-neutral-200 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs sm:text-sm text-neutral-500">
            © 2026 NIFES. Christ-like students transforming Nigeria's institutions.
          </p>
        </div>
      </footer>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="max-w-4xl w-full max-h-[90vh] relative animate-in fade-in scale-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage || "/placeholder.svg"}
              alt="Full size preview"
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors p-2 rounded-full bg-black/20 hover:bg-black/40"
              aria-label="Close preview"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
