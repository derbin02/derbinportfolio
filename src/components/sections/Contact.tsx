import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Send, Mail, MapPin, Phone, CheckCircle, AlertCircle } from 'lucide-react'
import { personalInfo } from '@/data/content'
import { AnimatedHeading } from '../ui/AnimatedText'
import Button from '../ui/Button'

interface FormData {
  name: string
  email: string
  message: string
}

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Simulate API call - replace with actual Supabase integration
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log('Form submitted:', data)
      setSubmitStatus('success')
      reset()
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: personalInfo.email,
      href: `mailto:${personalInfo.email}`,
    },
    {
      icon: Phone,
      label: 'Phone / WhatsApp',
      value: `+91 ${personalInfo.phone}`,
      href: `https://wa.me/${personalInfo.whatsapp}`,
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'View on Map',
      href: personalInfo.mapUrl,
      external: true,
    },
  ]

  return (
    <section id="contact" className="py-24 lg:py-32 bg-light-card/50 dark:bg-dark-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            className="inline-block text-accent font-medium mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
          >
            Get in Touch
          </motion.span>
          <AnimatedHeading
            as="h2"
            className="text-4xl lg:text-5xl font-display font-bold text-gray-900 dark:text-white mb-6"
          >
            Let's Work Together
          </AnimatedHeading>
          <motion.p
            className="max-w-2xl mx-auto text-gray-600 dark:text-gray-400 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            Have a project in mind? I'd love to hear about it. Send me a message and let's create something amazing.
          </motion.p>
        </div>

        <div ref={ref} className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            className="p-8 bg-white dark:bg-dark-card rounded-2xl border border-light-border dark:border-dark-border shadow-xl"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  {...register('name', { required: 'Name is required' })}
                  className={`w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all ${
                    errors.name
                      ? 'border-red-500'
                      : 'border-light-border dark:border-dark-border'
                  }`}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Email Field */}
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
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Message Field */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  {...register('message', {
                    required: 'Message is required',
                    minLength: {
                      value: 10,
                      message: 'Message must be at least 10 characters',
                    },
                  })}
                  className={`w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all resize-none ${
                    errors.message
                      ? 'border-red-500'
                      : 'border-light-border dark:border-dark-border'
                  }`}
                  placeholder="Tell me about your project..."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isSubmitting}
              >
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </Button>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <motion.div
                  className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Message sent successfully! I'll get back to you soon.</span>
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertCircle className="w-5 h-5" />
                  <span>Something went wrong. Please try again later.</span>
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4 }}
          >
            {/* Info Cards */}
            {contactInfo.map((info, index) => (
              <motion.a
                key={info.label}
                href={info.href}
                target={info.external ? '_blank' : undefined}
                rel={info.external ? 'noopener noreferrer' : undefined}
                className="flex items-start gap-4 p-6 bg-white dark:bg-dark-card rounded-2xl border border-light-border dark:border-dark-border group hover:border-accent transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ x: 5 }}
              >
                <div className="p-3 bg-accent/10 rounded-xl group-hover:bg-accent/20 transition-colors">
                  <info.icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mb-1">
                    {info.label}
                  </p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {info.value}
                  </p>
                </div>
              </motion.a>
            ))}

            {/* CTA Card */}
            <motion.div
              className="p-8 bg-gradient-to-br from-accent to-accent-dark rounded-2xl text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8 }}
            >
              <h3 className="text-2xl font-display font-bold mb-4">
                Ready to start a project?
              </h3>
              <p className="text-white/80 mb-6">
                I'm currently available for freelance work and full-time opportunities.
              </p>
              <a
                href="/assets/DerbinDavidraj_Resume.pdf"
                download
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-accent rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Download Resume
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
