// src/components/shop/CategoryFilter.jsx

const CategoryFilter = ({ categories, activeCategory, onCategoryChange, className = 'mb-12' }) => {
  return (
    <div className={`flex flex-wrap justify-center items-center gap-4 ${className}`}>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
            activeCategory === category.id
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/25'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md dark:shadow-black/30'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;