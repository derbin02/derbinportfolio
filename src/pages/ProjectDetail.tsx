import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { portfolioProjects } from '@/data/content'
import Button from '@/components/ui/Button'
import PDFViewer from '@/components/ui/PDFViewer'
import { useState } from 'react'

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const project = portfolioProjects.find((p) => p.slug === slug)
  const [showPDF, setShowPDF] = useState(true)

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
            Project Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The project you're looking for doesn't exist.
          </p>
          <Link to="/">
            <Button variant="primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <motion.main
        className="pt-24 pb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link
              to="/#projects"
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-accent transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Projects
            </Link>
          </motion.div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
              {project.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {project.description}
            </p>
            <Button variant="primary" onClick={() => setShowPDF(true)}>
              View Full Project
            </Button>
          </motion.div>
        </div>
      </motion.main>

      <PDFViewer
        isOpen={showPDF}
        onClose={() => setShowPDF(false)}
        pdfUrl={project.pdfUrl}
        title={project.title}
      />
    </>
  )
}
