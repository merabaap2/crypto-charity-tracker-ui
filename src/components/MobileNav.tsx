// ---------- /components/MobileNav.tsx ----------
'use client'

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SheetContent } from '@/components/ui/sheet'

interface Navigation {
  name: string
  href: string
}

interface MobileNavProps {
  navigation: Navigation[]
  isActive: (path: string) => boolean
  onClose: () => void
}

export default function MobileNav({ navigation, isActive, onClose }: MobileNavProps) {
  return (
    <SheetContent side="right" className="w-72 sm:w-80">
      <div className="flex flex-col space-y-6 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-xl font-semibold bg-gradient-charity bg-clip-text text-transparent"
        >
          Navigation
        </motion.div>
        
        <nav className="flex flex-col space-y-4">
          {navigation.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.1 + 0.2 
              }}
            >
              <Link
                to={item.href}
                className={`
                  relative block px-4 py-3 text-lg font-medium rounded-lg transition-all duration-200
                  hover:bg-primary/10 hover:text-primary hover:translate-x-1
                  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                  ${isActive(item.href)
                    ? 'text-primary bg-primary/10 border-l-4 border-primary'
                    : 'text-muted-foreground'
                  }
                `}
                onClick={onClose}
              >
                <span className="relative z-10">{item.name}</span>
                {isActive(item.href) && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary-glow/5 rounded-lg"
                    layoutId="activeMobileNav"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Decorative element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex justify-center pt-8"
        >
          <div className="w-16 h-1 bg-gradient-to-r from-primary to-primary-glow rounded-full opacity-30" />
        </motion.div>
      </div>
    </SheetContent>
  )
}