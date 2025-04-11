import { NextResponse } from 'next/server'

const MEALDB_API_URL = 'https://www.themealdb.com/api/json/v1/1'
interface Meal {
  idMeal: string;
  strMeal: string;
  strInstructions: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
  [key: string]: string | undefined; // For dynamic ingredient/measure properties
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    
    const endpoint = `${MEALDB_API_URL}/search.php?s=${query}`
    
    // If no search query, fetch random meals
    if (!query) {
      const randomMeals = []
      // Fetch 10 random meals
      for (let i = 0; i < 10; i++) {
        const response = await fetch(`${MEALDB_API_URL}/random.php`)
        const data = await response.json()
        if (data.meals?.[0]) {
          randomMeals.push(data.meals[0])
        }
      }
      
      // Format the response
      const formattedMeals = randomMeals.map(meal => ({
        id: meal.idMeal,
        name: meal.strMeal,
        description: meal.strInstructions?.slice(0, 200) + '...',
        imageUrl: meal.strMealThumb,
        category: meal.strCategory,
        area: meal.strArea,
        ingredients: getIngredients(meal),
        instructions: meal.strInstructions,
      }))

      return NextResponse.json(formattedMeals)
    }

    // Search for meals by query
    const response = await fetch(endpoint)
    const data = await response.json()

    if (!data.meals) {
      return NextResponse.json([])
    }

    // Format the response
    const formattedMeals = data.meals.map((meal: Meal) => ({
      id: meal.idMeal,
      name: meal.strMeal,
      description: meal.strInstructions?.slice(0, 200) + '...',
      imageUrl: meal.strMealThumb,
      category: meal.strCategory,
      area: meal.strArea,
      ingredients: getIngredients(meal),
      instructions: meal.strInstructions,
    }))

    return NextResponse.json(formattedMeals)
  } catch (error) {
    console.error('Error fetching recipes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recipes' },
      { status: 500 }
    )
  }
}

// Helper function to extract ingredients and measurements
function getIngredients(meal: Meal) {
  const ingredients = []
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`]
    const measure = meal[`strMeasure${i}`]
    
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        name: ingredient,
        quantity: measure || 'To taste'
      })
    }
  }
  return ingredients
}