'use client'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'
const sidebarLinks = [
  {
    label: 'Dashboard',
    route: '/dashboard',
    imgURL: '🏠'
  },
  {
    label: 'Ingredients',
    route: '/ingredients',
    imgURL: '🕯️'
  },
  {
    label: 'Browse Recipes',
    route: '/browse',
    imgURL: '🎈'
  },
  {
    label: 'Saved Recipes',
    route: '/savedRecipes',
    imgURL: '🌙'
  }
]

const Navigation = () => {
  const { isAuthenticated } = useAuth()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-8 right-4 z-50 p-2 rounded-lg bg-white shadow-md animate-bounce text-xs cursor-pointer"
      >
        {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar Navigation */}
      <aside className={`
        w-64 bg-green-200 shadow-md p-6 fixed top-0 left-0 h-screen
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:block z-40
      `}>
        <Link href={'/browse'} className="text-xl font-bold text-gray-800 flex items-center">
          <span className="text-2xl mr-2">🍳</span> 
          Re.<span className="text-primary">plan</span>
        </Link>
        
        <div className="h-full flex flex-col justify-between">
          <nav className="mt-6">
            {isAuthenticated ? (
              <ul className='bg-white rounded-lg p-4 space-y-2 shadow-md'>
                {sidebarLinks.map((link) => {
                  const isActive = pathname === link.route || 
                                 pathname.startsWith(`${link.route}/`)
                  return (
                    <li key={link.label}>
                      <Link 
                        href={link.route}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center text-teal-500 space-x-3 p-3 rounded-lg transition-colors
                          ${isActive 
                            ? 'bg-purple-100 text-purple-700 font-medium' 
                            : 'text-gray-600 hover:bg-gray-50'
                          }`}
                      >
                        <span className="text-xl">{link.imgURL}</span>
                        <span className="block">{link.label}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <div className="border-teal-500 rounded-lg p-4 shadow-md">
                <p className="text-gray-700 mb-4">Please log in to access all features</p>
                <Link 
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90"
                >
                  Login
                </Link>
              </div>
            )}
          </nav>

          <div className="mb-4 bg-teal-500 text-white p-4 rounded-lg text-center">
            <h3 className="text-md font-bold">Download our mobile app</h3>
            <p className="text-sm mt-2">Synchronize wherever you are with just one grasp.</p>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden "
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}

export default Navigation