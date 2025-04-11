"use client"
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react'

const Header = () => {
    const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const handleLogout = async () => {
    await logout();
    router.push('/');
  };
  return (
    <header className="mb-2 flex justify-between items-center p-4 text-blue-900 border-teal-500 rounded-lg">
        <div >
          <h1 className="text-4xl font-bold">Recipe Finder App</h1>
          <p className="text-lg text-gray-600">Find recipes based on ingredients you have!</p>
        </div>
        <div className="flex items-center space-x-4">
{!isAuthenticated ? (
  <>
    <Link
      href="/login"
      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
    >
      Login
    </Link>
    <Link
      href="/register"
      className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700"
    >
      Register
    </Link>
  </>
) : (
  <button
    onClick={handleLogout}
    className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700"
  >
    Logout
  </button>
)}
</div>
      </header>
  )
}

export default Header