import { useEffect, ReactNode, useRef } from 'react'
import Lenis from 'lenis'

interface SmoothScrollProps {
  children: ReactNode
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    })

    lenisRef.current = lenis

    // Store lenis instance globally for external control
    ;(window as any).__lenis = lenis

    function raf(time: number) {
      // Check if lenis should be stopped (when PDF viewer is open)
      if (document.documentElement.classList.contains('lenis-stopped')) {
        lenis.stop()
      } else {
        lenis.start()
      }
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Add class to html element
    document.documentElement.classList.add('lenis')

    return () => {
      lenis.destroy()
      document.documentElement.classList.remove('lenis')
      ;(window as any).__lenis = null
    }
  }, [])

  return <>{children}</>
}
