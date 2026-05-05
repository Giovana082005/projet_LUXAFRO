interface Props {
  search: string;
  setSearch: (value: string) => void;

  selectedCategories: string[];
  toggleCategory: (cat: string) => void;

  onlyChildren: boolean;
  setOnlyChildren: (value: boolean) => void;

  onReset: () => void;
}

const categoriesList = ["musique", "sport", "culture", "danse", "festival"];

const EventFilters = ({
  search,
  setSearch,
  selectedCategories,
  toggleCategory,
  onlyChildren,
  setOnlyChildren,
  onReset,
}: Props) => {
  return (
    <div style={{ marginBottom: "20px" }}>
      {/* RECHERCHE */}
      <input
        type="text"
        placeholder="Rechercher un événement..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* CATEGORIES */}
      <div>
        <p>Catégories :</p>
        {categoriesList.map((cat) => (
          <label key={cat} style={{ marginRight: "10px" }}>
            <input
              type="checkbox"
              checked={selectedCategories.includes(cat)}
              onChange={() => toggleCategory(cat)}
            />
            {cat}
          </label>
        ))}
      </div>

      {/* ENFANT */}
      <label>
        <input
          type="checkbox"
          checked={onlyChildren}
          onChange={() => setOnlyChildren(!onlyChildren)}
        />
        Événements pour enfants
      </label>

      {/* RESET */}
      <div>
        <button onClick={onReset}>
          Réinitialiser
        </button>
      </div>
    </div>
  );
};

export default EventFilters;