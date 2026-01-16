import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Upload,
  Star,
} from 'lucide-react'
import { useAuthContext } from '@/context/AuthContext'
import { useProjects } from '@/hooks/useSupabase'
import { createProject, updateProject, deleteProject, uploadImage, DBProject } from '@/lib/supabase'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'

interface ProjectForm {
  title: string
  slug: string
  category: string
  description: string
  is_featured: boolean
  thumbnail_url: string
}

export default function ProjectManager() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isAuthenticated, loading: authLoading } = useAuthContext()
  const { projects, loading: projectsLoading, refetch } = useProjects()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<DBProject | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [uploadingThumb, setUploadingThumb] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectForm>()

  const titleValue = watch('title')

  // Auto-generate slug from title
  useEffect(() => {
    if (titleValue && !editingProject) {
      const slug = titleValue
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setValue('slug', slug)
    }
  }, [titleValue, setValue, editingProject])

  // Check for URL params to open modal
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      openModal()
    }
    const editId = searchParams.get('edit')
    if (editId && projects.length > 0) {
      const project = projects.find((p) => p.id === editId)
      if (project) {
        openModal(project)
      }
    }
  }, [searchParams, projects])

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login')
    }
  }, [authLoading, isAuthenticated, navigate])

  const openModal = (project?: DBProject) => {
    if (project) {
      setEditingProject(project)
      setThumbnailPreview(project.thumbnail_url)
      reset({
        title: project.title,
        slug: project.slug,
        category: project.category,
        description: project.description || '',
        is_featured: project.is_featured,
        thumbnail_url: project.thumbnail_url || '',
      })
    } else {
      setEditingProject(null)
      setThumbnailPreview(null)
      reset({
        title: '',
        slug: '',
        category: '',
        description: '',
        is_featured: false,
        thumbnail_url: '',
      })
    }
    setIsModalOpen(true)
  }

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingThumb(true)
    const url = await uploadImage(file, 'project-images')
    setUploadingThumb(false)
    if (url) {
      setThumbnailPreview(url)
      setValue('thumbnail_url', url)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingProject(null)
    setThumbnailPreview(null)
    reset()
    // Clear URL params
    navigate('/admin/projects', { replace: true })
  }

  const onSubmit = async (data: ProjectForm) => {
    setIsSubmitting(true)
    try {
      if (editingProject) {
        await updateProject(editingProject.id, {
          ...data,
          thumbnail_url: data.thumbnail_url || null,
        })
      } else {
        await createProject({
          ...data,
          thumbnail_url: data.thumbnail_url || null,
          case_study: null,
          order_index: projects.length + 1,
        })
      }
      await refetch()
      closeModal()
    } catch (error) {
      console.error('Error saving project:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteProject(id)
      await refetch()
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    )
  }

  const categories = ['Branding', 'Video', 'Print', 'Social Media', 'UI/UX', 'Other']

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      {/* Header */}
      <header className="bg-white dark:bg-dark-card border-b border-light-border dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/admin/dashboard"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Manage Projects
            </h1>
          </div>
          <Button variant="primary" onClick={() => openModal()}>
            <Plus className="w-5 h-5 mr-2" />
            Add Project
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {projectsLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No projects yet. Create your first project!
            </p>
            <Button variant="primary" onClick={() => openModal()}>
              <Plus className="w-5 h-5 mr-2" />
              Add Project
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                className="bg-white dark:bg-dark-card rounded-2xl border border-light-border dark:border-dark-border overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* Thumbnail */}
                <div className="aspect-video bg-gray-100 dark:bg-dark-border relative">
                  {project.thumbnail_url ? (
                    <img
                      src={project.thumbnail_url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Upload className="w-8 h-8" />
                    </div>
                  )}
                  {project.is_featured && (
                    <div className="absolute top-2 right-2 p-1 bg-yellow-500 rounded-full">
                      <Star className="w-4 h-4 text-white fill-white" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">{project.category}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {new Date(project.created_at).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal(project)}
                        className="p-2 text-gray-500 hover:text-accent transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(project.id)}
                        className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingProject ? 'Edit Project' : 'Add New Project'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project Title *
            </label>
            <input
              type="text"
              {...register('title', { required: 'Title is required' })}
              className={`w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border rounded-xl focus:ring-2 focus:ring-accent ${
                errors.title ? 'border-red-500' : 'border-light-border dark:border-dark-border'
              }`}
              placeholder="Enter project title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              URL Slug *
            </label>
            <input
              type="text"
              {...register('slug', { required: 'Slug is required' })}
              className={`w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border rounded-xl focus:ring-2 focus:ring-accent ${
                errors.slug ? 'border-red-500' : 'border-light-border dark:border-dark-border'
              }`}
              placeholder="project-url-slug"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category *
            </label>
            <select
              {...register('category', { required: 'Category is required' })}
              className={`w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border rounded-xl focus:ring-2 focus:ring-accent ${
                errors.category ? 'border-red-500' : 'border-light-border dark:border-dark-border'
              }`}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xl focus:ring-2 focus:ring-accent resize-none"
              placeholder="Brief description of the project"
            />
          </div>

          {/* Thumbnail Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Thumbnail Image
            </label>
            <div className="flex items-start gap-4">
              <div className="w-32 h-24 bg-gray-100 dark:bg-dark-border rounded-lg overflow-hidden flex items-center justify-center">
                {thumbnailPreview ? (
                  <img src={thumbnailPreview} alt="Thumbnail" className="w-full h-full object-cover" />
                ) : (
                  <Upload className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="hidden"
                  id="thumbnail-upload"
                />
                <label
                  htmlFor="thumbnail-upload"
                  className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-dark-border text-gray-700 dark:text-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-dark-border/70 transition-colors"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploadingThumb ? 'Uploading...' : 'Upload Image'}
                </label>
                <input type="hidden" {...register('thumbnail_url')} />
                <p className="text-xs text-gray-500 mt-2">Recommended: 800x600px, JPG/PNG</p>
              </div>
            </div>
          </div>

          {/* Featured */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_featured"
              {...register('is_featured')}
              className="w-5 h-5 rounded border-gray-300 text-accent focus:ring-accent"
            />
            <label htmlFor="is_featured" className="text-sm text-gray-700 dark:text-gray-300">
              Feature this project on homepage
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-light-border dark:border-dark-border">
            <Button type="button" variant="ghost" onClick={closeModal}>
              <X className="w-5 h-5 mr-2" />
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              <Save className="w-5 h-5 mr-2" />
              {editingProject ? 'Update' : 'Create'} Project
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Project"
        size="sm"
      >
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete this project? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            className="bg-red-500 hover:bg-red-600"
            onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
          >
            <Trash2 className="w-5 h-5 mr-2" />
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}
