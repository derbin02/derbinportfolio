import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Briefcase, Calendar, MapPin } from 'lucide-react'
import { experiences } from '@/data/content'
import { AnimatedHeading } from '../ui/AnimatedText'

const typeColors = {
  'full-time': 'bg-green-500/10 text-green-600 dark:text-green-400',
  'part-time': 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  internship: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
}

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="experience" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            className="inline-block text-accent font-medium mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
          >
            Career Journey
          </motion.span>
          <AnimatedHeading
            as="h2"
            className="text-4xl lg:text-5xl font-display font-bold text-gray-900 dark:text-white mb-6"
          >
            Work Experience
          </AnimatedHeading>
          <motion.p
            className="max-w-2xl mx-auto text-gray-600 dark:text-gray-400 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            A timeline of my professional growth in brand and marketing design
          </motion.p>
        </div>

        {/* Timeline */}
        <div ref={ref} className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent via-accent/50 to-transparent" />

          {/* Experience Items */}
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                className={`relative flex flex-col md:flex-row gap-8 ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.2 }}
              >
                {/* Timeline Dot */}
                <div className="absolute left-8 md:left-1/2 w-4 h-4 -translate-x-1/2 bg-accent rounded-full border-4 border-white dark:border-dark-bg shadow-lg shadow-accent/30" />

                {/* Content Card */}
                <div className={`flex-1 ml-16 md:ml-0 ${index % 2 === 0 ? 'md:pr-16' : 'md:pl-16'}`}>
                  <motion.div
                    className="p-6 bg-white dark:bg-dark-card rounded-2xl border border-light-border dark:border-dark-border shadow-lg hover:shadow-xl transition-shadow"
                    whileHover={{ y: -4 }}
                  >
                    {/* Header */}
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeColors[exp.type]}`}>
                            {exp.type.replace('-', ' ')}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-500">
                            {exp.duration}
                          </span>
                        </div>
                        <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white">
                          {exp.title}
                        </h3>
                        <p className="text-accent font-medium">{exp.company}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 text-sm text-gray-500 dark:text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{exp.startDate} - {exp.endDate}</span>
                        </div>
                        {exp.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{exp.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <ul className="space-y-2">
                      {exp.description.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-gray-600 dark:text-gray-400"
                        >
                          <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>

                {/* Empty Spacer for alternating layout */}
                <div className="hidden md:block flex-1" />
              </motion.div>
            ))}
          </div>

          {/* Bottom Icon */}
          <motion.div
            className="absolute left-8 md:left-1/2 -bottom-4 -translate-x-1/2 w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-lg shadow-accent/30"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.8 }}
          >
            <Briefcase className="w-5 h-5 text-white" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
