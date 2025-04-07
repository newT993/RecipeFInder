'use client'
import RecipeCard from '@/components/RecipeCard'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Footer from '@/components/Footer'

interface Meal {
  idMeal: string
  strMeal: string
  strMealThumb: string
  strInstructions: string
}

const Browse = () => {
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(0)
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get('page')) || 1
  const itemsPerPage = 10

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        setLoading(true)
        // Fetch all meals first (API doesn't support pagination directly)
        const response = await fetch(
          'https://www.themealdb.com/api/json/v1/1/search.php?s='
        )
        const data = await response.json()
        
        // Calculate total pages
        const total = Math.ceil(data.meals.length / itemsPerPage)
        setTotalPages(total)
        
        // Implement client-side pagination
        const start = (currentPage - 1) * itemsPerPage
        const end = start + itemsPerPage
        const paginatedMeals = data.meals.slice(start, end)
        setMeals(paginatedMeals)
      } catch (error) {
        console.error('Error fetching meals:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMeals()
  }, [currentPage])

  const handlePageChange = (page: number) => {
    router.push(`/browse?page=${page}`)
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="container mx-auto p-4 relative">
      <h1 className="text-3xl font-bold mb-6">Browse Recipes</h1>
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meals.map((meal) => (
            <RecipeCard
              key={meal.idMeal}
              title={meal.strMeal}
              description={meal.strInstructions.substring(0, 150) + '...'}
              imageUrl={meal.strMealThumb}
              id={meal.idMeal}
            />
          ))}
        </div>
      </section>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 border rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`px-4 py-2 border rounded-md ${
              currentPage === i + 1 ? 'bg-blue-500 text-white' : ''
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Browse