'use client'
import { useEffect, useState } from 'react'
import { useStore } from '@/store/useStore'
import RecipeCard from '@/components/RecipeCard'

interface SavedMeal {
  idMeal: string
  strMeal: string
  strMealThumb: string
  strInstructions: string
}

export default function SavedRecipes() {
  const { favorites } = useStore()
  const [savedMeals, setSavedMeals] = useState<SavedMeal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSavedMeals = async () => {
      try {
        setLoading(true)
        const meals = await Promise.all(
          favorites.map(async (id) => {
            const response = await fetch(
              `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
            )
            const data = await response.json()
            return data.meals[0]
          })
        )
        setSavedMeals(meals.filter(Boolean))
      } catch (error) {
        console.error('Error fetching saved meals:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSavedMeals()
  }, [favorites])

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Saved Recipes</h1>
      {savedMeals.length === 0 ? (
        <p className="text-gray-600">No saved recipes yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedMeals.map((meal) => (
            <RecipeCard
              key={meal.idMeal}
              id={meal.idMeal}
              title={meal.strMeal}
              description={meal.strInstructions.substring(0, 150) + '...'}
              imageUrl={meal.strMealThumb}
            />
          ))}
        </div>
      )}
    </div>
  )
}