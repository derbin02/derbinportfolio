import { useRef, useEffect } from 'react'
import { motion, useInView, useAnimation, Variants } from 'framer-motion'

interface AnimatedTextProps {
  text: string
  className?: string
  once?: boolean
  delay?: number
  animation?: 'fadeUp' | 'reveal' | 'typewriter' | 'wave'
}

export default function AnimatedText({
  text,
  className = '',
  once = true,
  delay = 0,
  animation = 'fadeUp',
}: AnimatedTextProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin: '-100px' })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  const animations: Record<string, { container: Variants; child: Variants }> = {
    fadeUp: {
      container: {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.03, delayChildren: delay },
        },
      },
      child: {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { type: 'spring', damping: 12, stiffness: 200 },
        },
      },
    },
    reveal: {
      container: {
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.015, delayChildren: delay },
        },
      },
      child: {
        hidden: { y: '100%' },
        visible: {
          y: 0,
          transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] },
        },
      },
    },
    typewriter: {
      container: {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.05, delayChildren: delay },
        },
      },
      child: {
        hidden: { opacity: 0, display: 'none' },
        visible: {
          opacity: 1,
          display: 'inline-block',
          transition: { duration: 0 },
        },
      },
    },
    wave: {
      container: {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.04, delayChildren: delay },
        },
      },
      child: {
        hidden: { y: 0 },
        visible: {
          y: [0, -10, 0],
          transition: { duration: 0.4 },
        },
      },
    },
  }

  const words = text.split(' ')
  const { container, child } = animations[animation]

  if (animation === 'reveal') {
    return (
      <motion.div ref={ref} className={className}>
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden mr-2">
            <motion.span
              className="inline-block"
              initial="hidden"
              animate={controls}
              variants={child}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </motion.div>
    )
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={controls}
      variants={container}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          variants={child}
          className="inline-block"
          style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.div>
  )
}

interface AnimatedHeadingProps {
  children: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4'
  delay?: number
}

export function AnimatedHeading({
  children,
  className = '',
  as: Tag = 'h2',
  delay = 0,
}: AnimatedHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const words = children.split(' ')

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-3">
          <motion.span
            className="inline-block"
            initial={{ y: '100%' }}
            animate={isInView ? { y: 0 } : { y: '100%' }}
            transition={{
              duration: 0.5,
              ease: [0.33, 1, 0.68, 1],
              delay: delay + i * 0.1,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
