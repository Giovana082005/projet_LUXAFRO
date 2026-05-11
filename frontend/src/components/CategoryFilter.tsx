import { Filter } from "lucide-react";
import type { Category } from "../types/Event";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null; // null = "Toutes"
  onChange: (categoryName: string | null) => void;
}

/**
 *  Filtre par catégorie sous forme de boutons-pilules
 * "Toutes" est toujours présent en premier
 */
function CategoryFilter({ categories, selectedCategory, onChange }: CategoryFilterProps) {
  
  // Style commun aux boutons
  const getPillStyle = (isActive: boolean) =>
    `px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
      isActive
        ? "bg-blue-950 text-white border-blue-950"
        : "bg-white text-gray-700 border-gray-300 hover:border-blue-700 hover:text-blue-700"
    }`;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
      
      {/*  Label avec icône */}
      <div className="flex items-center space-x-2 mb-3">
        <Filter size={16} className="text-blue-700" />
        <span className="text-sm font-semibold text-gray-900">
          Filtrer par catégorie
        </span>
      </div>

      {/*  Pilules */}
      <div className="flex flex-wrap gap-2">
        
        {/* "Toutes" - toujours en premier */}
        <button
          type="button"
          onClick={() => onChange(null)}
          className={getPillStyle(selectedCategory === null)}
        >
          Toutes
        </button>

        {/* Les catégories disponibles */}
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onChange(cat.nom)}
            className={getPillStyle(selectedCategory === cat.nom)}
          >
            {cat.nom}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryFilter;