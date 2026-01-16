import { useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Eye, ArrowRight } from 'lucide-react'
import { useProjects } from '@/hooks/useSupabase'

export default function Projects() {
  const { projects, loading } = useProjects()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <>
      <section id="projects" className="py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div ref={ref} className="text-center mb-16">
            <motion.span
              className="inline-block text-accent font-medium text-sm uppercase tracking-wider mb-4"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
            >
              Portfolio
            </motion.span>
            <motion.h2
              className="text-3xl lg:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
            >
              Selected Projects
            </motion.h2>
            <motion.p
              className="max-w-2xl mx-auto text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
            >
              A showcase of brand identities, marketing campaigns, and design systems I've created for education and digital-first brands.
            </motion.p>
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto" />
            </div>
          ) : projects.length === 0 ? (
            <motion.div
              className="text-center py-16 bg-light-card dark:bg-dark-card rounded-2xl border border-light-border dark:border-dark-border"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
            >
              <p className="text-gray-500 dark:text-gray-400 mb-2">Projects coming soon</p>
              <p className="text-sm text-gray-400">Check back for updates on my latest work.</p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    className="group"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <div className="bg-white dark:bg-dark-card rounded-2xl border border-light-border dark:border-dark-border overflow-hidden hover:border-accent/50 transition-all hover:shadow-xl">
                      {/* Thumbnail */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-dark-bg">
                        {project.thumbnail_url ? (
                          <img
                            src={project.thumbnail_url}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Eye className="w-12 h-12" />
                          </div>
                        )}


                        {/* Category Badge */}
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 bg-white/90 dark:bg-dark-card/90 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
                            {project.category}
                          </span>
                        </div>

                        {/* Featured Badge */}
                        {project.is_featured && (
                          <div className="absolute top-3 right-3">
                            <span className="px-2 py-1 bg-accent rounded-full text-xs font-medium text-white">
                              Featured
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-accent transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                          {project.description || 'No description'}
                        </p>

                        {/* Category tag */}
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-dark-border rounded text-xs text-gray-600 dark:text-gray-400">
                          {project.category}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* View More CTA */}
          {projects.length > 0 && (
            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 }}
            >
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-accent hover:text-accent-dark font-medium transition-colors"
              >
                Want to see more? Let's talk
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          )}
        </div>
      </section>

      {/* PDF Viewer Modal - currently disabled as case_study is structured data */}
      {/* Future: add pdf_url field to projects for PDF support */}
    </>
  )
}
