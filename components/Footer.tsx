import React from 'react'

const Footer = () => {
  return (
        <footer className="bg-yellow-400 text-black fixed bottom-0">

  <div className="text-center py-6">
    <h2 className="text-xl font-bold">Subscribe Our Newsletter</h2>
    <p className="text-sm">Stay updated with our latest news and recipes!</p>
    <div className="mt-4 flex justify-center">
      <input type="email" placeholder="Enter your email..." 
        className="px-4 py-2 w-64 rounded-l-lg border border-gray-300 focus:outline-none bg-white"/>
      <button className="bg-black text-white px-4 py-2 rounded-r-lg">➔</button>
    </div>
  </div>

  <div className="bg-black text-white py-10 px-6 md:px-16">
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
      
      <div>
        <h3 className="text-lg font-semibold">Explore</h3>
        <ul className="mt-3 space-y-2">
          <li><a href="#" className="hover:text-yellow-400">Home</a></li>
          <li><a href="#" className="hover:text-yellow-400">About Us</a></li>
          <li><a href="#" className="hover:text-yellow-400">News</a></li>
          <li><a href="#" className="hover:text-yellow-400">Contact</a></li>
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold">Recipes</h3>
        <ul className="mt-3 space-y-2">
          <li><a href="#" className="hover:text-yellow-400">Featured Recipes</a></li>
          <li><a href="#" className="hover:text-yellow-400">Newest Recipes</a></li>
          <li><a href="#" className="hover:text-yellow-400">Share Your Recipe</a></li>
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold">Contact</h3>
        <p className="mt-3 text-sm">877 Whitney Street, Santa Ana, USA</p>
        <p className="text-sm mt-2">📞 (777) 555-013</p>
        <p className="text-sm mt-2">✉ support@mamarecipe.com</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold">Social Media</h3>
        <div className="flex space-x-4 mt-3">
          <a href="#" className="hover:text-yellow-400 text-xl">🔵</a>
          <a href="#" className="hover:text-yellow-400 text-xl">⚪</a>
          <a href="#" className="hover:text-yellow-400 text-xl">⚫</a>
        </div>
      </div>
    </div>

    <div className="mt-10 text-center text-gray-400 text-sm">
      <p>Terms & Conditions • Privacy Policy</p>
      <p className="mt-1">© MamaRecipe 2023, All Rights Reserved</p>
    </div>
  </div>
</footer>

  )
}

export default Footer