'use client'
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

const Navigation = () => {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  

  return (
    <aside className="w-64 bg-yellow-400 shadow-md p-6 hidden md:block fixed top-0 left-0 h-screen">
    <Link href={'/browse'} className="text-xl font-bold text-gray-800">🍳 Re.<span className="text-primary">plan</span></Link>
    <div className="h-full flex flex-col justify-between">

    <nav className="mt-6">
      {isAuthenticated ? (<ul className='bg-white rounded-lg p-4 ps-2 shadow-md'>
        <li className="mb-4"><Link href="/dashboard" className="text-gray-600 flex items-center hover:text-primary">
          🏠 Dashboard</Link></li>
        <li className="mb-4"><Link href="/ingredients" className="text-primary font-bold flex items-center">
          🥦 Your Ingredients</Link></li>
        <li className="mb-4"><Link href="/browse" className="text-gray-600 flex items-center hover:text-primary">
          📖 Browse Recipes</Link></li>
        <li><Link href="/savedRecipes" className="text-gray-600 flex items-center hover:text-primary">
          💾 Saved Recipes</Link></li>
      </ul>):(<>
      <Link href="/browse" className="text-gray-600 flex items-center hover:text-primary">
          📖 Browse Recipes</Link>
      
      </>)}
    </nav>

    <div className="mt-12 bg-orange-500 text-white p-4 rounded-lg text-center">
      <h3 className="text-md font-bold">Download our mobile app</h3>
      <p className="text-sm mt-2">Synchronize wherever you are with just one grasp.</p>
    </div>
    </div>
  </aside>
  );
};

export default Navigation;