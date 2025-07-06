import React from 'react';

interface RecipeCardProps {
  title: string;
  image?: string;
  description?: string;
  category?: string;
  onClick?: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  title,
  image,
  description,
  category,
  onClick,
}) => {
  return (
    <div
      className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer group"
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">{title}</h3>
          {category && (
            <span className="px-2 py-1 bg-fitness-blue/10 text-fitness-blue dark:bg-fitness-green/10 dark:text-fitness-green rounded-full text-xs font-semibold">
              {category}
            </span>
          )}
        </div>
        {description && (
          <p className="text-gray-800 dark:text-gray-200 text-sm line-clamp-2">{description}</p>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
