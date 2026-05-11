import { Check } from "lucide-react";
import type { Category } from "../../types/Event";

interface CategoriesSelectorProps {
  // Toutes les catégories disponibles
  categories: Category[];
  // IDs des catégories sélectionnées
  selectedIds: number[];
  //  Callback quand la sélection change
  onChange: (selectedIds: number[]) => void;
}

/**
 * Sélecteur multi-catégories sous forme de pilules cliquables
 */
function CategoriesSelector({ 
  categories, 
  selectedIds, 
  onChange 
}: CategoriesSelectorProps) {

  //  Toggle d'une catégorie (ajoute si absente, retire si présente)
  const toggleCategory = (categoryId: number) => {
    if (selectedIds.includes(categoryId)) {
      //  Retirer
      onChange(selectedIds.filter((id) => id !== categoryId));
    } else {
      //  Ajouter
      onChange([...selectedIds, categoryId]);
    }
  };

  //  Aucune catégorie disponible
  if (categories.length === 0) {
    return (
      <p className="text-sm text-gray-500 italic">
        Aucune catégorie disponible. Créez-en d'abord dans la gestion des catégories.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isSelected = selectedIds.includes(category.id);
        
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => toggleCategory(category.id)}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              isSelected
                ? "bg-blue-950 text-white border-blue-950"
                : "bg-white text-gray-700 border-gray-300 hover:border-blue-700 hover:text-blue-700"
            }`}
          >
            {isSelected && <Check size={14} />}
            <span>{category.nom}</span>
          </button>
        );
      })}
    </div>
  );
}

export default CategoriesSelector;