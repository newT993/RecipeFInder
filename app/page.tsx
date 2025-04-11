'use client'
import { useRouter } from 'next/navigation'

import debounce from 'lodash/debounce'

interface Recipe {
  id: string
  name: string
  description: string
  imageUrl: string
}
import Link from "next/link"
import { FaUtensils, FaSave, FaSearch } from "react-icons/fa"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import Carousel from '@/components/carousel'

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  const searchRecipes = debounce(async (term: string) => {
    if (term.length < 2) {
      setRecipes([])
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(`/api/recipes?query=${encodeURIComponent(term)}`)
      const data = await response.json()
      setRecipes(data.slice(0, 8)) // Limit to 8 results
    } catch (error) {
      console.error('Error searching recipes:', error)
    } finally {
      setIsSearching(false)
    }
  }, 300)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    searchRecipes(value)
  }

  const handleRecipeClick = (recipeId: string) => {
    //router.push(`/recipes/${recipeId}`)
    alert(`You clicked on recipe with ID: ${recipeId} \nThis is where you would navigate to the recipe details page but need to login.`)
    router.push('/login')
  }

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
    </div>
  }
  return (
    <AnimatePresence>{isLoaded && (
    <div className="min-h-screen">

      
      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-2">

        {/* image section */}
        <div className="text-center mb-8 sm:mb-16">
          <div className="container mx-auto px-4 py-10 pt-0 flex flex-col md:flex-row items-center gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="md:w-1/2 text-center md:text-left space-y-4 sm:space-y-6"
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl text-blue-900 font-bold leading-tight">
                Discover Recipes Tailored to Your Ingredients
              </h1>
              <p className="text-base mb-6 sm:text-lg">
                Enter the ingredients you have on hand, and let us suggest delicious recipes you can make today.
              </p>
                            
              <div className="relative w-full sm:w-full md:w-2/3">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="flex justify-center md:justify-start"
                >
                  <div className="relative w-full">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      placeholder="Enter ingredients (e.g., chicken, broccoli)"
                      className="w-full font-bold text-teal-500 placeholder:font-bold placeholder:text-teal-700 p-3 rounded-lg outline-none-- text-gray-800 focus:outline-none border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    {isSearching && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    )}
                  </div>
                </motion.div>
              
                {/* Search Results Dropdown */}
                {recipes.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto"
                  >
                    {recipes.map((recipe) => (
                      <motion.div
                        key={recipe.id}
                        whileHover={{ backgroundColor: '#f3f4f6' }}
                        onClick={() => handleRecipeClick(recipe.id)}
                        className="p-4 cursor-pointer border-b border-gray-100 last:border-none hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0 h-12 w-12">
                            <img
                              src={recipe.imageUrl || '/placeholder-recipe.png'}
                              alt={recipe.name}
                              className="h-12 w-12 object-cover rounded-md"
                            />-
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {recipe.name}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* carousel section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              className="md:w-1/2 mt-6 sm:mt-10 md:mt-0 flex justify-center"
            >
              <img
                src={"/food2.png"}
                alt="Delicious food"
                className="w-full max-w-md rounded-lg object-cover "
              />
            </motion.div>
            {/* <Carousel /> */}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex justify-center gap-4"
          >
            {/* ...existing button code... */}
          </motion.div>
        </div>

        
                {/* Features Grid */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-16"
                >
                  {[
                    {
                      icon: <FaSearch />,
                      title: "Find Recipes",
                      description: "Search through thousands of recipes and find the perfect meal"
                    },
                    {
                      icon: <FaUtensils />,
                      title: "Track Ingredients",
                      description: "Keep track of your ingredients and get notified before they expire"
                    },
                    {
                      icon: <FaSave />,
                      title: "Save Favorites",
                      description: "Save your favorite recipes and ingredients for quick access"
                    }
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                      whileHover={{ scale: 1.05 }}
                      viewport={{ once: true }}
                      className="bg-teal-500 text-white p-6 rounded-lg shadow-lg text-center"
                    >
                      <div className="text-primary text-white text-4xl mb-4 flex justify-center">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="">{feature.description}</p>
                    </motion.div>
                  ))}
                </motion.div>
        
                {/* How It Works Section */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="sm:text-2xl text-lg text-blue-900 font-bold mb-6 sm:mb-8"
                >
                  <h2 className="text-3xl text-center bg-text-blue text-blue-900 font-bold mb-8">How It Works</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                    {[
                      { step: "1", title: "Sign Up", desc: "Create your free account" },
                      { step: "2", title: "Add Ingredients", desc: "Track what you have" },
                      { step: "3", title: "Find Recipes", desc: "Discover new meals" },
                      { step: "4", title: "Start Cooking", desc: "Follow easy steps" },
                    ].map((item, index) => (
                      <motion.div
                        key={item.step}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                        whileHover={{ 
                          scale: 1.05,
                          borderColor: "#3b82f6",
                          transition: { duration: 0.2 }
                        }}
                        viewport={{ once: true }}
                        className="relative border-teal-500 text-center border-2 p-6 rounded-lg shadow-lg"
                      >
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                          className="bg-teal-500 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-sm"
                        >
                          {item.step}
                        </motion.div>
                        <h3 className="font-semibold text-blue-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600 text-sm">{item.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
        
                {/* CTA Section */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="bg-primary/5 rounded-2xl p-4 sm:p-8 text-center"
                >
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="text-xl sm:text-2xl font-bold text-blue-900 mb-3 sm:mb-4"
                  >
                    Ready to start your cooking journey?
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6"
                  >
                    Join thousands of home cooks and start exploring recipes today
                  </motion.p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link 
                      href="/register" 
                      className="bg-primary text-white px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base rounded-lg hover:bg-primary/90 inline-block"
                    >
                      Create Free Account
                    </Link>
                  </motion.div>
                </motion.div>
        
      </div>
    </div>)}</AnimatePresence>
  )
}

export default Home