import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-14 h-8 rounded-full bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border p-1 transition-colors"
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <motion.div
        className="absolute inset-1 w-6 h-6 rounded-full bg-accent flex items-center justify-center"
        animate={{
          x: theme === 'dark' ? 22 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      >
        <motion.div
          initial={false}
          animate={{ rotate: theme === 'dark' ? 360 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {theme === 'dark' ? (
            <Moon className="w-4 h-4 text-white" />
          ) : (
            <Sun className="w-4 h-4 text-white" />
          )}
        </motion.div>
      </motion.div>
    </motion.button>
  )
}
