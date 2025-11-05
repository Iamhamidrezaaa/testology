'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, User, LogOut, Home, BookOpen, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence, useScroll } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useLoginModal } from '@/contexts/LoginModalContext'

const Header = () => {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { scrollY } = useScroll()
  const { openLoginModal } = useLoginModal()

  const toggleMenu = () => setIsOpen(!isOpen)

  const isActive = (path: string) => pathname === path

  const navItems = [
    { href: '/', label: 'خانه', icon: Home },
    { href: '/blog', label: 'بلاگ', icon: BookOpen },
    { href: '/about', label: 'درباره ما', icon: Info },
  ]

  const isLoggedIn = session?.user?.role

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary font-vazir">
            تستولوژی
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            <Link href="/" className="text-gray-600 hover:text-primary font-vazir">
              صفحه اصلی
            </Link>
            <Link href="/tests" className="text-gray-600 hover:text-primary font-vazir">
              تست‌ها
            </Link>
            <Link href="/blog" className="text-gray-600 hover:text-primary font-vazir">
              بلاگ
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-primary font-vazir">
              درباره ما
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-primary font-vazir">
              تماس با ما
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            {isLoggedIn ? (
              <button
                onClick={() => signOut()}
                className="px-4 py-2 text-sm text-gray-600 hover:text-primary font-vazir"
              >
                خروج
              </button>
            ) : (
              <Button
                variant="ghost"
                onClick={openLoginModal}
                className="flex items-center gap-2 text-primary hover:text-primary/80 text-sm lg:text-base"
              >
                <User className="h-4 w-4 lg:h-5 lg:w-5" />
                ورود/عضویت
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="px-4 py-4 space-y-4">
              <Link
                href="/"
                className="block text-gray-600 hover:text-primary font-vazir"
                onClick={() => setIsOpen(false)}
              >
                صفحه اصلی
              </Link>
              <Link
                href="/tests"
                className="block text-gray-600 hover:text-primary font-vazir"
                onClick={() => setIsOpen(false)}
              >
                تست‌ها
              </Link>
              <Link
                href="/blog"
                className="block text-gray-600 hover:text-primary font-vazir"
                onClick={() => setIsOpen(false)}
              >
                بلاگ
              </Link>
              <Link
                href="/about"
                className="block text-gray-600 hover:text-primary font-vazir"
                onClick={() => setIsOpen(false)}
              >
                درباره ما
              </Link>
              <Link
                href="/contact"
                className="block text-gray-600 hover:text-primary font-vazir"
                onClick={() => setIsOpen(false)}
              >
                تماس با ما
              </Link>
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    signOut()
                    setIsOpen(false)
                  }}
                  className="block w-full text-right text-gray-600 hover:text-primary font-vazir"
                >
                  خروج
                </button>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => {
                    openLoginModal()
                    setIsOpen(false)
                  }}
                  className="block w-full text-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-vazir"
                >
                  <User className="h-4 w-4 lg:h-5 lg:w-5" />
                  ورود/عضویت
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header 