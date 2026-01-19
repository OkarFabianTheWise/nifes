import { useState, useEffect } from 'react'

export function useTheme() {
    const [theme, setTheme] = useState(() => {
        // Check localStorage first, default to light
        if (typeof window === 'undefined') return 'light'
        const stored = localStorage.getItem('theme')
        return stored || 'light'
    })

    useEffect(() => {
        const root = document.documentElement

        if (theme === 'dark') {
            root.classList.add('dark')
        } else {
            root.classList.remove('dark')
        }

        localStorage.setItem('theme', theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
    }

    return { theme, toggleTheme }
}
