import { motion } from 'framer-motion'
import { Heart, Linkedin, Mail, Phone } from 'lucide-react'
import { personalInfo, socialLinks } from '@/data/content'

const iconMap: Record<string, React.ElementType> = {
  linkedin: Linkedin,
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-light-card dark:bg-dark-card border-t border-light-border dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <motion.h3
              className="text-2xl font-display font-bold text-accent mb-4"
              whileHover={{ scale: 1.02 }}
            >
              {personalInfo.name.split(' ')[0]}
            </motion.h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {personalInfo.title}
              <span className="text-accent ml-2">({personalInfo.tagline})</span>
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {['About', 'Projects', 'Experience', 'Contact'].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-gray-600 dark:text-gray-400 hover:text-accent dark:hover:text-accent transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
              Connect
            </h4>
            <div className="flex space-x-4 mb-4">
              {socialLinks.map((social) => {
                const Icon = iconMap[social.icon] || Mail
                return (
                  <motion.a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-100 dark:bg-dark-border rounded-lg text-gray-600 dark:text-gray-400 hover:bg-accent hover:text-white transition-colors"
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    title={social.platform}
                  >
                    <Icon size={20} />
                  </motion.a>
                )
              })}
            </div>
            <div className="space-y-2">
              <a
                href={`mailto:${personalInfo.email}`}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-accent transition-colors"
              >
                <Mail size={16} />
                {personalInfo.email}
              </a>
              <a
                href={`https://wa.me/${personalInfo.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-accent transition-colors"
              >
                <Phone size={16} />
                +91 {personalInfo.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-light-border dark:border-dark-border flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-500 dark:text-gray-500 text-sm flex items-center">
            Made with <Heart className="w-4 h-4 mx-1 text-red-500" /> by {personalInfo.name}
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-2 md:mt-0">
            &copy; {currentYear} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
