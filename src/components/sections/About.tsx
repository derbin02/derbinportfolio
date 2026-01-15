import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Cpu, Palette, Zap, Award } from 'lucide-react'
import { personalInfo, education } from '@/data/content'
import { AnimatedHeading } from '../ui/AnimatedText'

const highlights = [
  {
    icon: Palette,
    title: 'Brand Identity',
    description: 'Building consistent visual identities across all touchpoints',
  },
  {
    icon: Zap,
    title: 'Marketing Design',
    description: 'Creating campaign-ready assets for digital platforms',
  },
  {
    icon: Cpu,
    title: 'AI-Assisted',
    description: 'Using GenAI tools to accelerate design workflows',
  },
  {
    icon: Award,
    title: '3+ Years',
    description: 'Professional experience in brand and marketing design',
  },
]

export default function About() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="about" className="py-24 lg:py-32 bg-light-card/50 dark:bg-dark-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            {/* Main Image Container */}
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/5" />
              <img
                src={personalInfo.profilePic}
                alt={personalInfo.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = personalInfo.profilePic2
                }}
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* Floating Badge */}
              <motion.div
                className="absolute bottom-6 left-6 right-6 p-4 bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm rounded-xl"
                initial={{ y: 20, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {education.degree}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {education.institution}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-accent/30 rounded-2xl -z-10" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/10 rounded-full blur-2xl -z-10" />
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Section Label */}
            <motion.span
              className="inline-block text-accent font-medium mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
            >
              About Me
            </motion.span>

            {/* Heading */}
            <AnimatedHeading
              as="h2"
              className="text-4xl lg:text-5xl font-display font-bold text-gray-900 dark:text-white mb-6"
              delay={0.4}
            >
              Crafting Visual Stories
            </AnimatedHeading>

            {/* Description */}
            <motion.p
              className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
            >
              {personalInfo.summary}
            </motion.p>

            {/* Highlights Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {highlights.map((item, index) => (
                <motion.div
                  key={item.title}
                  className="p-4 bg-white dark:bg-dark-bg rounded-xl border border-light-border dark:border-dark-border group hover:border-accent transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                      <item.icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
