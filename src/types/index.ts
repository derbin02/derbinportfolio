export interface Project {
  id: string
  title: string
  slug: string
  category: string
  thumbnail: string
  description: string
  tags: string[]
  isFeatured: boolean
  caseStudy?: CaseStudy
  createdAt: string
}

export interface CaseStudy {
  problem: string
  process: string[]
  solution: string
  results: string[]
  images: string[]
}

export interface Experience {
  id: string
  title: string
  company: string
  location?: string
  duration: string
  startDate: string
  endDate: string
  description: string[]
  type: 'full-time' | 'part-time' | 'internship'
}

export interface Skill {
  id: string
  name: string
  icon: string
  category: 'design' | 'tools' | 'other'
  proficiency: number
}

export interface ContactForm {
  name: string
  email: string
  message: string
}

export interface SocialLink {
  id: string
  platform: string
  url: string
  icon: string
}
