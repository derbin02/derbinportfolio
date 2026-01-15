import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollAnimationOptions {
  trigger?: string | Element
  start?: string
  end?: string
  scrub?: boolean | number
  markers?: boolean
  toggleActions?: string
}

export function useScrollAnimation() {
  useEffect(() => {
    // Refresh ScrollTrigger on mount
    ScrollTrigger.refresh()

    return () => {
      // Kill all ScrollTriggers on unmount
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  const createScrollTrigger = (
    element: string | Element,
    animation: gsap.TweenVars,
    options: ScrollAnimationOptions = {}
  ) => {
    return gsap.to(element, {
      ...animation,
      scrollTrigger: {
        trigger: options.trigger || element,
        start: options.start || 'top 80%',
        end: options.end || 'bottom 20%',
        scrub: options.scrub || false,
        markers: options.markers || false,
        toggleActions: options.toggleActions || 'play none none reverse',
      },
    })
  }

  const fadeInUp = (element: string | Element, options?: ScrollAnimationOptions) => {
    return createScrollTrigger(
      element,
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
      },
      options
    )
  }

  const fadeIn = (element: string | Element, options?: ScrollAnimationOptions) => {
    return createScrollTrigger(
      element,
      {
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
      },
      options
    )
  }

  const scaleIn = (element: string | Element, options?: ScrollAnimationOptions) => {
    return createScrollTrigger(
      element,
      {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: 'back.out(1.7)',
      },
      options
    )
  }

  const staggerFadeIn = (
    elements: string | Element | Element[],
    stagger: number = 0.1,
    options?: ScrollAnimationOptions
  ) => {
    return gsap.to(elements, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: options?.trigger || (typeof elements === 'string' ? elements : Array.isArray(elements) ? elements[0] : elements),
        start: options?.start || 'top 80%',
        toggleActions: options?.toggleActions || 'play none none reverse',
      },
    })
  }

  const parallax = (
    element: string | Element,
    yPercent: number = -20,
    options?: ScrollAnimationOptions
  ) => {
    return gsap.to(element, {
      yPercent,
      ease: 'none',
      scrollTrigger: {
        trigger: options?.trigger || element,
        start: options?.start || 'top bottom',
        end: options?.end || 'bottom top',
        scrub: options?.scrub ?? true,
      },
    })
  }

  return {
    createScrollTrigger,
    fadeInUp,
    fadeIn,
    scaleIn,
    staggerFadeIn,
    parallax,
    ScrollTrigger,
    gsap,
  }
}

export default useScrollAnimation
