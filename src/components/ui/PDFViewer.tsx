import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Document, Page, pdfjs } from 'react-pdf'
import {
  X,
  Download,
  ZoomIn,
  ZoomOut,
  ChevronUp,
  Share2,
  Heart,
  MessageCircle,
} from 'lucide-react'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// Set worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PDFViewerProps {
  isOpen: boolean
  onClose: () => void
  pdfUrl: string
  title: string
}

export default function PDFViewer({ isOpen, onClose, pdfUrl, title }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [scale, setScale] = useState(1.0)
  const [isLoading, setIsLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [scrollPercent, setScrollPercent] = useState(0)
  const [showCopied, setShowCopied] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Handle share - copy current URL to clipboard
  const handleShare = async () => {
    try {
      const shareUrl = window.location.href
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: `Check out this project: ${title}`,
          url: shareUrl,
        })
      } else {
        await navigator.clipboard.writeText(shareUrl)
        setShowCopied(true)
        setTimeout(() => setShowCopied(false), 2000)
      }
    } catch (err) {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        setShowCopied(true)
        setTimeout(() => setShowCopied(false), 2000)
      } catch {
        console.error('Failed to share')
      }
    }
  }

  // Handle contact - close viewer and scroll to contact
  const handleContact = () => {
    onClose()
    setTimeout(() => {
      const contactSection = document.querySelector('#contact')
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' })
      }
    }, 300)
  }

  // Handle scroll progress manually
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollTop = container.scrollTop
    const scrollHeight = container.scrollHeight - container.clientHeight
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
    setScrollPercent(progress)
  }, [])

  useEffect(() => {
    if (isOpen) {
      // Stop page scroll and Lenis
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
      document.documentElement.classList.add('lenis-stopped')
      setIsLoading(true)
      // Reset scroll position when opening
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = 0
        }
      }, 100)
    } else {
      document.body.style.overflow = 'unset'
      document.documentElement.style.overflow = 'unset'
      document.documentElement.classList.remove('lenis-stopped')
    }
    return () => {
      document.body.style.overflow = 'unset'
      document.documentElement.style.overflow = 'unset'
      document.documentElement.classList.remove('lenis-stopped')
    }
  }, [isOpen])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container && isOpen) {
      container.addEventListener('scroll', handleScroll, { passive: true })
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [isOpen, handleScroll])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') onClose()
      if (e.key === '+' || e.key === '=') zoomIn()
      if (e.key === '-') zoomOut()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setIsLoading(false)
  }

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 2.5))
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5))

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Prevent wheel event from propagating to parent
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.stopPropagation()
  }, [])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-[#0a0a0a]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px]"
              style={{ transform: `translateY(${scrollPercent * 0.5}%)` }}
            />
            <div
              className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px]"
              style={{ transform: `translateY(-${scrollPercent * 0.3}%)` }}
            />
          </div>

          {/* Progress bar */}
          <div className="fixed top-0 left-0 right-0 h-1 bg-white/10 z-50">
            <motion.div
              className="h-full bg-gradient-to-r from-accent to-purple-500"
              style={{ width: `${scrollPercent}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Header */}
          <motion.header
            className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/90 via-black/50 to-transparent"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={onClose}
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
                <div>
                  <motion.h1
                    className="text-white font-display font-bold text-xl"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {title}
                  </motion.h1>
                  <motion.p
                    className="text-white/50 text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {numPages} pages • {Math.round(scrollPercent)}% viewed
                  </motion.p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={zoomOut}
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ZoomOut className="w-5 h-5" />
                </motion.button>
                <span className="text-white/70 text-sm min-w-[50px] text-center">
                  {Math.round(scale * 100)}%
                </span>
                <motion.button
                  onClick={zoomIn}
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ZoomIn className="w-5 h-5" />
                </motion.button>
                <div className="w-px h-8 bg-white/20 mx-2" />
                <motion.a
                  href={pdfUrl}
                  download
                  className="p-3 rounded-full bg-accent hover:bg-accent-dark text-white transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Download className="w-5 h-5" />
                </motion.a>
              </div>
            </div>
          </motion.header>

          {/* Scrollable content - FIXED SCROLL */}
          <div
            ref={scrollContainerRef}
            data-lenis-prevent
            className="absolute inset-0 top-20 bottom-0 overflow-y-auto overflow-x-hidden pdf-viewer-scroll"
            onWheel={handleWheel}
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(255,255,255,0.3) transparent',
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain'
            }}
          >
            {/* Loading state */}
            {isLoading && (
              <div className="flex items-center justify-center h-[60vh]">
                <motion.div
                  className="flex flex-col items-center gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  <p className="text-white/60">Loading portfolio...</p>
                </motion.div>
              </div>
            )}

            {/* PDF Pages - SINGLE CONTINUOUS SHEET */}
            <motion.div
              className="flex flex-col items-center py-8 px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Glow effect behind PDF */}
              <div className="relative">
                <div className="absolute -inset-8 bg-accent/5 rounded-3xl blur-3xl pointer-events-none" />

                {/* PDF Document - Continuous sheet */}
                <div className="relative bg-white shadow-2xl shadow-black/50 rounded-lg overflow-hidden">
                  <Document
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={null}
                    className="pdf-document"
                  >
                    {Array.from({ length: numPages }, (_, index) => (
                      <Page
                        key={index + 1}
                        pageNumber={index + 1}
                        scale={scale}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className="select-none !mb-0 !border-0"
                      />
                    ))}
                  </Document>
                </div>
              </div>

              {/* End card */}
              {!isLoading && numPages > 0 && (
                <motion.div
                  className="mt-16 mb-24 text-center px-4"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.div
                    className="w-20 h-1 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mb-8"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                  />
                  <h3 className="text-2xl font-display font-bold text-white mb-2">
                    Thanks for viewing!
                  </h3>
                  <p className="text-white/50 mb-6">
                    Interested in working together?
                  </p>
                  <motion.a
                    href="#contact"
                    onClick={onClose}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-dark text-white rounded-full font-medium transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get in Touch
                  </motion.a>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Floating action buttons */}
          <motion.div
            className="fixed right-6 bottom-6 flex flex-col gap-3 z-50"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            {/* Like button */}
            <motion.button
              onClick={() => setLiked(!liked)}
              className={`p-4 rounded-full shadow-lg transition-all ${
                liked
                  ? 'bg-red-500 text-white'
                  : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={liked ? { scale: [1, 1.3, 1] } : {}}
              title={liked ? 'Liked!' : 'Like this project'}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            </motion.button>

            {/* Share button */}
            <motion.button
              onClick={handleShare}
              className="p-4 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 shadow-lg transition-all relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Share this project"
            >
              <Share2 className="w-5 h-5" />
              {/* Copied toast */}
              <AnimatePresence>
                {showCopied && (
                  <motion.span
                    className="absolute right-full mr-3 px-3 py-1 bg-green-500 text-white text-sm rounded-lg whitespace-nowrap"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                  >
                    Link copied!
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Contact button */}
            <motion.button
              onClick={handleContact}
              className="p-4 rounded-full bg-accent backdrop-blur-sm text-white hover:bg-accent-dark shadow-lg transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Get in touch"
            >
              <MessageCircle className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Scroll to top button */}
          <motion.button
            onClick={scrollToTop}
            className="fixed left-6 bottom-6 p-4 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 shadow-lg transition-all z-50"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>

          {/* Scroll indicator */}
          <motion.div
            className="fixed left-1/2 -translate-x-1/2 bottom-6 px-6 py-3 bg-black/80 backdrop-blur-sm rounded-full text-white text-sm font-medium z-40"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <span className="text-accent">{Math.round(scrollPercent)}%</span> • Scroll to explore
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
