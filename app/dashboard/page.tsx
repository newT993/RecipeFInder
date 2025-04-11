'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'

interface DashboardStats {
  totalIngredients: number
  expiringItems: number
  savedRecipes: number
  totalCategories: number
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalIngredients: 0,
    expiringItems: 0,
    savedRecipes: 0,
    totalCategories: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard')
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-blue-900">Welcome to RecipeFinder 👋</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-gray-500">Total Ingredients</h3>
          <p className="text-2xl font-bold">{stats.totalIngredients}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-gray-500">Expiring Soon</h3>
          <p className="text-2xl font-bold text-orange-500">{stats.expiringItems}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-gray-500">Saved Recipes</h3>
          <p className="text-2xl font-bold text-primary">{stats.savedRecipes}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-gray-500">Categories</h3>
          <p className="text-2xl font-bold">{stats.totalCategories}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-blue-900">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link 
            href="/ingredients"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition flex items-center justify-between"
          >
            <div>
              <h3 className="font-semibold">Manage Ingredients</h3>
              <p className="text-sm text-gray-500">Add or update your ingredients</p>
            </div>
            <span className="text-2xl">🥗</span>
          </Link>
          <Link 
            href="/browse"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition flex items-center justify-between"
          >
            <div>
              <h3 className="font-semibold">Find Recipes</h3>
              <p className="text-sm text-gray-500">Discover new recipes</p>
            </div>
            <span className="text-2xl">📖</span>
          </Link>
          <Link 
            href="/savedRecipes"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition flex items-center justify-between"
          >
            <div>
              <h3 className="font-semibold">Saved Items</h3>
              <p className="text-sm text-gray-500">View your saved recipes</p>
            </div>
            <span className="text-2xl">⭐</span>
          </Link>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Tips & Reminders</h2>
        <ul className="space-y-2">
          <li className="flex items-center text-gray-700">
            <span className="mr-2">🕒</span>
            Check your expiring ingredients regularly
          </li>
          <li className="flex items-center text-gray-700">
            <span className="mr-2">📝</span>
            Keep your ingredient list up to date
          </li>
          <li className="flex items-center text-gray-700">
            <span className="mr-2">💡</span>
            Try new recipes with your available ingredients
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Dashboard