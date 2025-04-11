'use client'
import FormExample from '@/hooks/FormExample'
import { useEffect, useState } from 'react'

interface Ingredient {
  id: string
  name: string
  category: {
    name: string
    id: string
  }
  quantity: string
  expiryDate?: Date | string
  purchaseDate?: Date | string
  createdAt?: Date
  isSaved?: boolean
  categoryId: string
}

// Utility functions for CRUD operations
const api = {
  create: async (ingredient: Omit<Ingredient, 'id' | 'category'>) => {
    const res = await fetch('/api/ingredients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ingredient),
    })
    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.error || 'Failed to create ingredient')
    }
    return res.json()
  },

  update: async (ingredient: Partial<Ingredient> & { id: string }) => {
    const res = await fetch('/api/ingredients', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ingredient),
    })
    if (!res.ok) throw new Error('Failed to update ingredient')
    return res.json()
  },

  delete: async (id: string) => {
    const res = await fetch(`/api/ingredients?id=${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete ingredient')
    return res.json()
  }
}

const Ingredients = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch ingredients and saved items
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/ingredients')
        if (!response.ok) throw new Error('Failed to fetch ingredients')
        
        const data = await response.json()
        setIngredients(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  // CRUD operation handlers
    const handleCreate = async (newIngredient: Omit<Ingredient, 'id' | 'category'>) => {
      try {
        // Validate required fields
        if (!newIngredient.name || !newIngredient.quantity || !newIngredient.categoryId) {
          throw new Error('Missing required fields')
        }
    
        // Ensure proper data structure with correct typing
        const ingredientData = {
          name: newIngredient.name,
          quantity: newIngredient.quantity,
          categoryId: newIngredient.categoryId,
          expiryDate: newIngredient.expiryDate || undefined, // Change null to undefined
        }
    
        const created = await api.create(ingredientData)
        setIngredients(prev => [...prev, created])
        setError(null)
      } catch (err) {
        console.error('Create error:', err)
        setError(err instanceof Error ? err.message : 'Failed to create ingredient')
      }
    }

  const handleUpdate = async (updatedIngredient: Partial<Ingredient> & { id: string }) => {
    try {
      const updated = await api.update(updatedIngredient)
      setIngredients(prev => prev.map(ing => ing.id === updated.id ? updated : ing))
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update ingredient')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await api.delete(id)
      setIngredients(prev => prev.filter(ing => ing.id !== id))
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete ingredient')
    }
  }

  // Calculate statistics
  const stats = {
    spices: ingredients.filter(i => i.category.name === 'Spices').length,
    addons: ingredients.filter(i => i.category.name === 'Add-ons').length,
    meats: ingredients.filter(i => i.category.name === 'Meats').length,
    fruits: ingredients.filter(i => i.category.name === 'Fruits').length,
    saved: ingredients.filter(i => i.isSaved).length
  }

  // Get expiring items (within 7 days)
  const expiringItems = ingredients
    .filter(i => i.expiryDate && new Date(i.expiryDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
    .sort((a, b) => new Date(a.expiryDate!).getTime() - new Date(b.expiryDate!).getTime())

  // Get newly purchased items (within last 3 days)
  const newItems = ingredients
    .filter(i => {
      const purchaseDate = i.purchaseDate ? new Date(i.purchaseDate) : null
      return purchaseDate && purchaseDate >= new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    })
    .sort((a, b) => {
      const dateA = new Date(a.purchaseDate!).getTime()
      const dateB = new Date(b.purchaseDate!).getTime()
      return dateB - dateA
    })

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">Error: {error}</div>

  return (
    <div>
    {error && (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    )}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-blue-900">Use <span className="text-primary">food ingredients</span> wisely! 🥦</h2>
        <FormExample onSubmit={handleCreate} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white p-4 rounded-lg shadow fade-in hover:shadow-lg">
          <p className="text-gray-600">Cooking Spices</p>
          <h3 className="text-xl font-bold">{stats.spices}</h3>
        </div>
        <div className="bg-white p-4 rounded-lg shadow fade-in">
          <p className="text-gray-600">Total Add-ons</p>
          <h3 className="text-xl font-bold">{stats.addons}</h3>
        </div>
        <div className="bg-white p-4 rounded-lg shadow fade-in">
          <p className="text-gray-600">Total Meats</p>
          <h3 className="text-xl font-bold">{stats.meats}</h3>
        </div>
        <div className="bg-white p-4 rounded-lg shadow fade-in">
          <p className="text-gray-600">Total Fruits</p>
          <h3 className="text-xl font-bold">{stats.fruits}</h3>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex justify-between">
          <h3 className="text-xl font-bold text-blue-900">Will expire 😟</h3>
          <button className="text-primary">...</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {expiringItems.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow fade-in">
              <h4 className="font-bold">{item.name}</h4>
              <p className="text-sm text-gray-500">{item.category.name} - {item.quantity}</p>
              <p className="text-sm text-red-500">
                ⏳ In {Math.ceil((new Date(item.expiryDate!).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
              </p>
              <div className="flex gap-2 mt-2">
                <button className="bg-teal-500 cursor-pointer text-white flex-1 p-2 rounded">
                  Browse Recipe
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 cursor-pointer text-white p-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold text-blue-900">Newly Purchased</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {newItems.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow fade-in flex items-center justify-between">
              <span className='text-blue-900 font-bold'>{item.name}</span>
              <span className="text-gray-500 font-semibold">{item.category.name} - {item.quantity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Ingredients