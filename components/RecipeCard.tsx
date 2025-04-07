import Link from 'next/link'

interface RecipeCardProps {
  id: string
  title: string
  description: string
  imageUrl?: string
}

const RecipeCard: React.FC<RecipeCardProps> = ({ id, title, description, imageUrl }) => {
  return (
    <Link href={`/browse/${id}`}>
      <div className="bg-white rounded-lg hover:shadow-lg shadow-md overflow-hidden transition-transform hover:scale-105">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  )
}

export default RecipeCard