// ---------- /components/InteractiveHeader.tsx ----------
'use client'

import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { 
  NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  NavigationMenuTrigger 
} from '@/components/ui/navigation-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useConnect, useDisconnect, useAccount } from 'wagmi'
import { useScrollShrink } from '@/hooks/useScrollShrink'
import Logo3D from './Logo3D'
import MobileNav from './MobileNav'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'FAQ', href: '/faq' },
]

export default function InteractiveHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { address, isConnected } = useAccount()
  const { isScrolled, scrollY } = useScrollShrink()

  const isActive = (path: string) => location.pathname === path

  const handleConnect = () => {
    const metaMaskConnector = connectors.find(c => c.name === 'MetaMask')
    if (metaMaskConnector) {
      connect({ connector: metaMaskConnector })
    }
  }

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  return (
    <motion.header 
      className="sticky top-0 z-50 w-full backdrop-blur-lg bg-background/95 supports-[backdrop-filter]:bg-background/60 rounded-b-2xl shadow-lg"
      initial={false}
      animate={{
        height: isScrolled ? '56px' : '72px',
        scale: isScrolled ? 0.96 : 1,
        opacity: isScrolled ? 0.95 : 1,
      }}
      transition={{ 
        duration: 0.3, 
        ease: [0.4, 0, 0.2, 1],
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
    >
      <div className="container mx-auto max-w-7xl px-6 md:px-10 h-full flex items-center justify-between">
        
        {/* LogoCluster */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 md:w-12 md:h-12">
            <Logo3D />
          </div>
          <Link 
            to="/" 
            className="font-inter font-semibold text-lg md:text-xl bg-gradient-charity bg-clip-text text-transparent"
          >
            CharityChain
          </Link>
        </div>

        {/* NavLinksGroup - Desktop */}
        <nav className="hidden md:flex mx-6">
          <NavigationMenu>
            <NavigationMenuList className="space-x-6">
              {navigation.map((item) => (
                <NavigationMenuItem key={item.name}>
                  <NavigationMenuLink asChild>
                    <Link
                      to={item.href}
                      className={`
                        relative px-3 py-2 text-sm font-medium transition-all duration-200
                        hover:-translate-y-0.5 hover:text-primary
                        ${isActive(item.href) 
                          ? 'text-primary' 
                          : 'text-muted-foreground hover:text-primary'
                        }
                      `}
                    >
                      {item.name}
                      {isActive(item.href) && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-primary-glow rounded-full"
                          layoutId="activeNav"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* WalletCluster */}
        <div className="flex items-center space-x-4">
          {/* Wallet Connection */}
          {isConnected ? (
            <div className="flex items-center space-x-2">
              <motion.div 
                className="hidden sm:block text-sm text-muted-foreground bg-gradient-to-r from-primary/10 to-primary-glow/10 px-3 py-1.5 rounded-lg border border-primary/20"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {address && formatAddress(address)}
              </motion.div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => disconnect()}
                className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-colors"
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="charity"
                size="sm"
                onClick={handleConnect}
                className="relative overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-primary/20 rounded-lg opacity-0 group-hover:opacity-100"
                  animate={{ 
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                />
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            </motion.div>
          )}

          {/* Mobile menu trigger */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button 
                variant="ghost" 
                size="sm"
                aria-label="Toggle menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <MobileNav 
              navigation={navigation} 
              isActive={isActive}
              onClose={() => setIsMenuOpen(false)} 
            />
          </Sheet>
        </div>
      </div>
    </motion.header>
  )
}