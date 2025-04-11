'use client'
import RecipeCard from '@/components/RecipeCard'
import React, { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion' // Import motion from framer-motion

interface Meal {
  idMeal: string
  strMeal: string
  strMealThumb: string
  strInstructions: string
}

const BrowseContent = () => {
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
        const response = await fetch(
          'https://www.themealdb.com/api/json/v1/1/search.php?s='
        )
        const data = await response.json()

        const total = Math.ceil(data.meals.length / itemsPerPage)
        setTotalPages(total)

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
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Initial animation state
      animate={{ opacity: 1, y: 0 }} // Final animation state
      transition={{ duration: 0.5 }} // Animation duration
      className="container mx-auto p-4 relative"
    >
      <h1 className="text-3xl font-bold mb-6 text-blue-900">Browse Recipes</h1>
      <section className="mb-8">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 grid-cols-4 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, scale: 0.9 },
            visible: {
              opacity: 1,
              scale: 1,
              transition: {
                staggerChildren: 0.1, // Stagger animation for child elements
              },
            },
          }}
        >
          {meals.map((meal) => (
            <motion.div
              key={meal.idMeal}
              whileHover={{ scale: 1.05 }} // Animation on hover
              whileTap={{ scale: 0.95 }} // Animation on tap
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <RecipeCard
                title={meal.strMeal}
                description={meal.strInstructions.substring(0, 150) + '...'}
                imageUrl={meal.strMealThumb}
                id={meal.idMeal}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Pagination */}
      <motion.div
        className="flex justify-center gap-2 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
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
      </motion.div>
    </motion.div>
  )
}

const Browse = () => {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-64">Loading...</div>}>
      <BrowseContent />
    </Suspense>
  )
}

export default Browse