import { Experience, Skill } from '@/types'

export const personalInfo = {
  name: 'Derbin Davidraj',
  title: 'Brand & Marketing Designer',
  tagline: 'GenAI-enabled',
  email: 'derbin.dr@gmail.com',
  phone: '7010090509',
  whatsapp: '917010090509',
  mapUrl: 'https://maps.app.goo.gl/cgwZrQGmrpWBJ3NeA',
  profilePic: '/assets/images/profile/profile-pic.png',
  profilePic2: '/assets/images/profile/Pic_2.jpg',
  summary: `Brand & Marketing Designer with 3+ years of experience creating visual assets that support brand positioning, engagement, and marketing campaigns. Skilled in building consistent visual identities and dynamic social media creatives. I use AI-assisted ideation to improve speed, consistency, and campaign ready output.`,
}

export const experiences: Experience[] = [
  {
    id: '1',
    title: 'Brand & Marketing Designer',
    company: 'Vibrant Education',
    duration: '2.3 Years',
    startDate: '09/2023',
    endDate: '01/2026',
    type: 'full-time',
    description: [
      'Designed marketing and brand creatives for educational campaigns and digital platforms',
      'Created consistent visual assets for social media, promotions, and internal communication',
      'Collaborated with marketing teams to support visibility and engagement goals',
      'Used AI-assisted ideation to speed up concept exploration and revisions',
    ],
  },
  {
    id: '2',
    title: 'Graphic Designer & Video Editor',
    company: 'Pongal Vadai',
    duration: '3 Months',
    startDate: '06/2023',
    endDate: '09/2023',
    type: 'internship',
    description: [
      'Created thumbnails, social creatives, and short-form video edits',
      'Supported channel branding and content presentation',
    ],
  },
  {
    id: '3',
    title: 'Graphic Designer',
    company: 'Raja Studio',
    location: 'Nagercoil',
    duration: '6 Months',
    startDate: '08/2022',
    endDate: '01/2023',
    type: 'part-time',
    description: [
      'Designed branding materials including albums, invitations, and print assets',
      'Maintained visual consistency across client deliverables',
      'Managed multiple design requests within tight timelines',
    ],
  },
]

export const skills: Skill[] = [
  {
    id: '1',
    name: 'Adobe Illustrator',
    icon: 'illustrator',
    category: 'design',
    proficiency: 90,
  },
  {
    id: '2',
    name: 'Adobe Photoshop',
    icon: 'photoshop',
    category: 'design',
    proficiency: 85,
  },
  {
    id: '3',
    name: 'Capcut',
    icon: 'video',
    category: 'tools',
    proficiency: 80,
  },
  {
    id: '4',
    name: 'N8N',
    icon: 'automation',
    category: 'tools',
    proficiency: 70,
  },
  {
    id: '5',
    name: 'MS PowerPoint',
    icon: 'presentation',
    category: 'other',
    proficiency: 85,
  },
  {
    id: '6',
    name: 'Microsoft Word',
    icon: 'document',
    category: 'other',
    proficiency: 80,
  },
]

export const education = {
  degree: 'B.E (Computer Science)',
  institution: 'Anna University',
  period: '08/2019 - 05/2023',
}

// Portfolio Projects - Add your projects here
export interface PortfolioProject {
  id: string
  title: string
  slug: string
  category: string
  thumbnail: string
  pdfUrl: string
  description: string
  tags: string[]
  client?: string
  year: string
  isFeatured: boolean
}

export const portfolioProjects: PortfolioProject[] = [
  {
    id: '1',
    title: 'Mascot Identity for VIBY',
    slug: 'mascot-identity-viby',
    category: 'Branding',
    thumbnail: '/assets/images/projects/mascot-identity-viby-thumb.jpg',
    pdfUrl: '/assets/projects/Mascot_Identity_for_VIBY.pdf',
    description: 'Complete mascot character design and brand identity development for VIBY, creating a memorable and engaging visual representation.',
    tags: ['Mascot Design', 'Character Design', 'Brand Identity', 'Illustration'],
    client: 'VIBY',
    year: '2024',
    isFeatured: true,
  },
  // Add more projects here following the same structure:
  // {
  //   id: '2',
  //   title: 'Project Name',
  //   slug: 'project-slug',
  //   category: 'Category',
  //   thumbnail: '/assets/images/projects/thumbnail.jpg',
  //   pdfUrl: '/assets/projects/project.pdf',
  //   description: 'Project description',
  //   tags: ['Tag1', 'Tag2'],
  //   client: 'Client Name',
  //   year: '2024',
  //   isFeatured: false,
  // },
]

export const socialLinks = [
  {
    id: '1',
    platform: 'LinkedIn',
    url: 'https://www.linkedin.com/in/derbin1234/',
    icon: 'linkedin',
  },
]
