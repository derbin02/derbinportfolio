import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Eye, Calendar, Building2 } from 'lucide-react'
import { portfolioProjects, PortfolioProject } from '@/data/content'
import { AnimatedHeading } from '../ui/AnimatedText'
import PDFViewer from '../ui/PDFViewer'

// Get unique categories from projects
const categories = ['All', ...new Set(portfolioProjects.map((p) => p.category))]

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const filteredProjects =
    activeCategory === 'All'
      ? portfolioProjects
      : portfolioProjects.filter((p) => p.category === activeCategory)

  const openPDFViewer = (project: PortfolioProject) => {
    setSelectedProject(project)
  }

  const closePDFViewer = () => {
    setSelectedProject(null)
  }

  return (
    <>
      <section id="projects" className="py-24 lg:py-32 bg-light-card/50 dark:bg-dark-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.span
              className="inline-block text-accent font-medium mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
            >
              Portfolio
            </motion.span>
            <AnimatedHeading
              as="h2"
              className="text-4xl lg:text-5xl font-display font-bold text-gray-900 dark:text-white mb-6"
            >
              Featured Projects
            </AnimatedHeading>
            <motion.p
              className="max-w-2xl mx-auto text-gray-600 dark:text-gray-400 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
            >
              A showcase of brand identities, marketing campaigns, and creative projects
            </motion.p>
          </div>

          {/* Category Filter */}
          {categories.length > 1 && (
            <motion.div
              ref={ref}
              className="flex flex-wrap justify-center gap-3 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
            >
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === category
                      ? 'bg-accent text-white shadow-lg shadow-accent/25'
                      : 'bg-white dark:bg-dark-card text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-border'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category}
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Projects coming soon...
              </p>
            </motion.div>
          ) : (
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              layout
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    onMouseEnter={() => setHoveredId(project.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className="group cursor-pointer"
                    onClick={() => openPDFViewer(project)}
                  >
                    <div className="bg-white dark:bg-dark-card rounded-2xl border border-light-border dark:border-dark-border overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full">
                      {/* Thumbnail */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <motion.img
                          src={project.thumbnail}
                          alt={project.title}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.5 }}
                        />

                        {/* Hover Overlay */}
                        <AnimatePresence>
                          {hoveredId === project.id && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col items-center justify-end p-6"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <motion.div
                                className="flex items-center gap-3 mb-4"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                              >
                                <span className="px-4 py-2 bg-accent rounded-full text-white text-sm font-medium flex items-center gap-2">
                                  <Eye className="w-4 h-4" />
                                  View Project
                                </span>
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Category Badge */}
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-white/95 dark:bg-dark-card/95 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 dark:text-gray-300 shadow-lg">
                            {project.category}
                          </span>
                        </div>

                        {/* Featured Badge */}
                        {project.isFeatured && (
                          <div className="absolute top-4 right-4">
                            <span className="px-3 py-1 bg-accent text-white rounded-full text-xs font-semibold shadow-lg">
                              Featured
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2 group-hover:text-accent transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                          {project.description}
                        </p>

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500 mb-4">
                          {project.client && (
                            <span className="flex items-center gap-1">
                              <Building2 className="w-3 h-3" />
                              {project.client}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {project.year}
                          </span>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {project.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-100 dark:bg-dark-border rounded text-xs text-gray-600 dark:text-gray-400"
                            >
                              {tag}
                            </span>
                          ))}
                          {project.tags.length > 3 && (
                            <span className="px-2 py-1 text-xs text-gray-400">
                              +{project.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* PDF Viewer Modal */}
      <PDFViewer
        isOpen={!!selectedProject}
        onClose={closePDFViewer}
        pdfUrl={selectedProject?.pdfUrl || ''}
        title={selectedProject?.title || ''}
      />
    </>
  )
}
