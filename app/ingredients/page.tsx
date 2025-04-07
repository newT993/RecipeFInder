'use client'
import FormExample from '@/hooks/FormExample'
import { useEffect, useState } from 'react'

interface Ingredient {
  id: string
  name: string
  category: {
    name: string  // Update to match the category structure from API
  }
  quantity: string
  expiryDate?: Date | string
  purchaseDate?: Date | string
  createdAt?: Date  // For saved items
  isSaved?: boolean
}

const Ingredients = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(true)

  
    useEffect(() => {
    const fetchItems = async () => {
      setLoading(true)
      try {
        // Fetch both ingredients and saved items
        const [ingredientsRes, savedItemsRes] = await Promise.all([
          fetch('/api/ingredients'),
          fetch('/api/saved-items')
        ]);
  
        if (!ingredientsRes.ok || !savedItemsRes.ok) {
          throw new Error('Failed to fetch data');
        }
  
        const [ingredientsData, savedItemsData] = await Promise.all([
          ingredientsRes.json(),
          savedItemsRes.json()
        ]);
  
        // Format saved items to match ingredient structure
        const formattedSavedItems = savedItemsData.map((item: any) => ({
          ...item,
          isSaved: true,
          purchaseDate: item.createdAt
        }));
  
        // Combine both arrays
        const combinedItems = [...ingredientsData, ...formattedSavedItems];
        console.log('Combined data:', combinedItems);
        setIngredients(combinedItems);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchItems();
  }, []);
  
  // Replace the early return with this
  if (loading) {
    return <div>Loading...</div>
  }
  // Calculate statistics
    const stats = {
    spices: ingredients.filter(i => i.category.name === 'Spices').length,
    addons: ingredients.filter(i => i.category.name === 'Add-ons').length,
    meats: ingredients.filter(i => i.category.name === 'Meats').length,
    fruits: ingredients.filter(i => i.category.name === 'Fruits').length,
    saved: ingredients.filter(i => i.isSaved).length
  };

  // Get expiring items (within 7 days)
  const expiringItems = ingredients
    .filter(i => i.expiryDate && new Date(i.expiryDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
    .sort((a, b) => new Date(a.expiryDate!).getTime() - new Date(b.expiryDate!).getTime())

  // Get newly purchased items (within last 3 days)
  const newItems = ingredients
  .filter(i => {
    const purchaseDate = i.purchaseDate ? new Date(i.purchaseDate) : null;
    return purchaseDate && purchaseDate >= new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  })
  .sort((a, b) => {
    const dateA = new Date(a.purchaseDate!).getTime();
    const dateB = new Date(b.purchaseDate!).getTime();
    return dateB - dateA;
  });
    //const savedItems = ingredients.filter(i => i.isSaved)

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Use <span className="text-primary">food ingredients</span> wisely! 🥦</h2>
        <FormExample />
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
          <h3 className="text-xl font-bold">Will expire 😟</h3>
          <button className="text-primary">See All</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {expiringItems.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow fade-in">
              <h4 className="font-bold">{item.name}</h4>
              <p className="text-sm text-gray-500">{item.category.name} - {item.quantity}</p>
              <p className="text-sm text-red-500">
                ⏳ In {Math.ceil((new Date(item.expiryDate!).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
              </p>
              <button className="bg-orange-500 text-white w-full mt-2 p-2 rounded">
                Browse Recipe
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold">Newly Purchased</h3>

        <div className="flex flex-wrap gap-4 mt-4">
          {newItems.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow fade-in flex items-center justify-between w-full md:w-1/3">
              <span>{item.name}</span>
              <span className="text-gray-500">{item.category.name} - {item.quantity}</span>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  )
}

export default Ingredients