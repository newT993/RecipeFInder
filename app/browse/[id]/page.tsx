'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeftIcon, BookmarkIcon } from '@heroicons/react/24/solid'
import { useStore } from '@/store/useStore'


interface MealDetail {
  idMeal: string
  strMeal: string
  strMealThumb: string
  strInstructions: string
  strCategory: string
  strArea: string
  strIngredient1?: string
  strIngredient2?: string
  strMeasure1?: string
  strMeasure2?: string
  // ... up to 20
}

export default function MealDetail() {
  const [meal, setMeal] = useState<MealDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const router = useRouter()
  const { toggleFavorite, isFavorite} = useStore()

  const handleSaveRecipe = () => {
    if (meal) {
      toggleFavorite(meal.idMeal)
    }
  }

  useEffect(() => {
    const fetchMealDetail = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${params.id}`
        )
        const data = await response.json()
        setMeal(data.meals[0])
      } catch (error) {
        console.error('Error fetching meal details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMealDetail()
  }, [params.id])

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  if (!meal) {
    return <div>Recipe not found</div>
  }

  // Get all ingredients and their measures
  const ingredients = []
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}` as keyof MealDetail]
    const measure = meal[`strMeasure${i}` as keyof MealDetail]
    if (ingredient && ingredient.trim() !== '') {
      ingredients.push(`${measure} ${ingredient}`)
    }
  }

  return (
    <main className="relative min-h-screen bg-gray-50">
      {/* Decorative background */}
      <div 
        className="fixed inset-0 z-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute top-0 left-[20%] w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-3xl transform -translate-y-1/2" />
        <div className="absolute bottom-0 right-[20%] w-[500px] h-[500px] bg-rose-100/30 rounded-full blur-3xl transform translate-y-1/2" />
      </div>

      <div className="container mx-auto p-4 relative z-10">
        <button 
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Browse
        </button>

        <div className="relative bg-grey-50 rounded-xl shadow-lg overflow-hidden">
          <div className="relative h-96">
            <img
              src={meal?.strMealThumb}
              alt={meal?.strMeal}
              className="w-full h-full object-cover"
            />
            <button
              onClick={handleSaveRecipe}
              className={`absolute top-4 right-4 p-2 rounded-full ${
                isFavorite(meal?.idMeal || '') 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-gray-600'
              } shadow-lg hover:scale-110 transition-transform`}
            >
              <BookmarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">{meal?.strMeal}</h1>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="flex gap-2 mb-4">
                  <span className="bg-teal-300 px-3 py-1 rounded-full">
                    {meal?.strCategory}
                  </span>
                  <span className="bg-teal-300 px-3 py-1 rounded-full">
                    {meal?.strArea}
                  </span>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2 text-blue-900">Ingredients</h2>
                  <ul className="space-y-1">
                    {ingredients.map((ingredient, index) => (
                      <li 
                        key={index} 
                        className="hover:bg-teal-100 p-1 rounded transition-colors"
                      >
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2 text-blue-900">Instructions</h2>
                <p className="whitespace-pre-line text-gray-700">
                  {meal?.strInstructions}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}