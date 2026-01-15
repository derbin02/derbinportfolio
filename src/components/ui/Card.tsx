import { ReactNode } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

interface CardProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  variant?: 'default' | 'glass' | 'outline'
  hover?: boolean
}

export default function Card({
  children,
  className = '',
  variant = 'default',
  hover = true,
  ...props
}: CardProps) {
  const variants = {
    default: 'bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border',
    glass: 'glass',
    outline: 'border-2 border-light-border dark:border-dark-border bg-transparent',
  }

  return (
    <motion.div
      className={`rounded-2xl overflow-hidden ${variants[variant]} ${className}`}
      whileHover={hover ? { y: -5, transition: { duration: 0.3 } } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  )
}

interface CardImageProps {
  src: string
  alt: string
  className?: string
}

export function CardImage({ src, alt, className = '' }: CardImageProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.5 }}
      />
    </div>
  )
}

interface CardContentProps {
  children: ReactNode
  className?: string
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={`p-6 ${className}`}>{children}</div>
}

interface CardTitleProps {
  children: ReactNode
  className?: string
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
  return (
    <h3 className={`text-xl font-display font-semibold text-gray-900 dark:text-white ${className}`}>
      {children}
    </h3>
  )
}

interface CardDescriptionProps {
  children: ReactNode
  className?: string
}

export function CardDescription({ children, className = '' }: CardDescriptionProps) {
  return (
    <p className={`text-gray-600 dark:text-gray-400 mt-2 ${className}`}>
      {children}
    </p>
  )
}
