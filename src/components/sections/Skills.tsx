import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Pen,
  Image,
  Video,
  Workflow,
  Presentation,
  FileText,
} from 'lucide-react'
import { skills } from '@/data/content'
import { AnimatedHeading } from '../ui/AnimatedText'

const iconMap: Record<string, React.ElementType> = {
  illustrator: Pen,
  photoshop: Image,
  video: Video,
  automation: Workflow,
  presentation: Presentation,
  document: FileText,
}

const categoryColors = {
  design: 'from-purple-500 to-pink-500',
  tools: 'from-blue-500 to-cyan-500',
  other: 'from-green-500 to-emerald-500',
}

export default function Skills() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="skills" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            className="inline-block text-accent font-medium mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
          >
            Expertise
          </motion.span>
          <AnimatedHeading
            as="h2"
            className="text-4xl lg:text-5xl font-display font-bold text-gray-900 dark:text-white mb-6"
          >
            Skills & Tools
          </AnimatedHeading>
          <motion.p
            className="max-w-2xl mx-auto text-gray-600 dark:text-gray-400 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            Proficiency in design tools and technologies that power my creative workflow
          </motion.p>
        </div>

        {/* Skills Grid */}
        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => {
            const Icon = iconMap[skill.icon] || Pen

            return (
              <motion.div
                key={skill.id}
                className="group relative p-6 bg-white dark:bg-dark-card rounded-2xl border border-light-border dark:border-dark-border overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {/* Background Gradient on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${categoryColors[skill.category]} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />

                {/* Icon */}
                <div className="relative mb-4">
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${categoryColors[skill.category]} p-0.5`}
                  >
                    <div className="w-full h-full bg-white dark:bg-dark-card rounded-xl flex items-center justify-center">
                      <Icon className="w-7 h-7 text-accent" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-2">
                  {skill.name}
                </h3>

                {/* Category Tag */}
                <span className="inline-block px-3 py-1 mb-4 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-dark-border rounded-full capitalize">
                  {skill.category}
                </span>

                {/* Progress Bar */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      Proficiency
                    </span>
                    <span className="text-sm font-medium text-accent">
                      {skill.proficiency}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-dark-border rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${categoryColors[skill.category]} rounded-full`}
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${skill.proficiency}%` } : {}}
                      transition={{
                        duration: 1,
                        delay: 0.5 + index * 0.1,
                        ease: 'easeOut',
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Additional Info */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
        >
          <div className="inline-flex items-center gap-4 px-6 py-4 bg-accent/5 border border-accent/20 rounded-2xl">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
              <Workflow className="w-6 h-6 text-accent" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900 dark:text-white">
                AI-Assisted Design Workflow
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Leveraging GenAI tools to accelerate ideation and production
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
