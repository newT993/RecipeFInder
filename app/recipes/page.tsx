'use client'

import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface Recipe {
  id: string
  name: string
  description: string
  imageUrl: string
  ingredients: {
    name: string
    quantity: string
  }[]
}

const Recipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('/api/recipes')
        const data = await response.json()
        setRecipes(data)
      } catch (error) {
        console.error('Error fetching recipes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [])
  const handleClick = () => {
    alert('Need to Sign in to view this page')
    router.push('/login')
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Browse Recipes</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {recipes.length>0 && recipes.map((recipe) => (
          <div key={recipe.id} onClick={()=>handleClick()} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <img
              src={recipe.imageUrl}
              alt={recipe.name}
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">{recipe.name}</h3>
            <p className="text-gray-600 mb-4">{recipe.description.substring(0, 150) + '...'}</p>
            
          </div>
        ))}
      </div>
    </div>
  )
}

export default Recipes