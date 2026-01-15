import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useAuthContext } from '@/context/AuthContext'
import Button from '@/components/ui/Button'

interface LoginForm {
  email: string
  password: string
}

export default function AdminLogin() {
  const navigate = useNavigate()
  const { signIn, isAuthenticated } = useAuthContext()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>()

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/admin/dashboard')
    return null
  }

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await signIn(data.email, data.password)
      if (error) {
        setError(error.message)
      } else {
        navigate('/admin/dashboard')
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-card dark:bg-dark-bg px-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-accent mb-2">DD</h1>
          <p className="text-gray-600 dark:text-gray-400">Admin Dashboard</p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-dark-card rounded-2xl p-8 shadow-xl border border-light-border dark:border-dark-border">
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">
            Sign In
          </h2>

          {error && (
            <motion.div
              className="flex items-center gap-2 p-4 mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className={`w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all ${
                  errors.email
                    ? 'border-red-500'
                    : 'border-light-border dark:border-dark-border'
                }`}
                placeholder="admin@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  className={`w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-dark-bg border rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all ${
                    errors.password
                      ? 'border-red-500'
                      : 'border-light-border dark:border-dark-border'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              <LogIn className="w-5 h-5 mr-2" />
              Sign In
            </Button>
          </form>
        </div>

        {/* Back to Site */}
        <p className="text-center mt-6 text-gray-600 dark:text-gray-400">
          <a href="/" className="text-accent hover:underline">
            Back to Portfolio
          </a>
        </p>
      </motion.div>
    </div>
  )
}
