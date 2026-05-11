import { useRef, useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface PhotoUploaderProps {
  // URL de la photo actuelle (en mode édition)
  currentPhotoUrl?: string | null;
  //Callback quand un fichier est sélectionné
  onFileSelect: (file: File | null) => void;
  // Callback si on veut supprimer la photo existante
  onRemoveExisting?: () => void;
}

/**
 *  Composant d'upload de photo
 * Affiche soit la photo existante, soit la nouvelle, soit une zone de drop
 */
function PhotoUploader({ 
  currentPhotoUrl, 
  onFileSelect, 
  onRemoveExisting 
}: PhotoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  //  Gérer la sélection d'un fichier
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;

    //  Validation côté frontend (en plus du backend)
    if (!file.type.startsWith("image/")) {
      alert("Veuillez sélectionner une image (JPG, PNG, WEBP)");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      alert("L'image ne doit pas dépasser 4 Mo");
      return;
    }

    // Créer une URL de prévisualisation (côté navigateur, pas d'upload encore)
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    //  Remonter le fichier au composant parent
    onFileSelect(file);
  };

  // Retirer le fichier sélectionné
  const handleRemoveFile = () => {
    setPreviewUrl(null);
    onFileSelect(null);
    
    // Reset l'input pour pouvoir re-sélectionner le même fichier
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  //  Retirer la photo existante (en mode édition)
  const handleRemoveExisting = () => {
    if (onRemoveExisting) {
      onRemoveExisting();
    }
  };

  //  Quelle photo afficher ?
  // Priorité : nouvelle photo (preview) > photo existante > rien
  const displayUrl = previewUrl || currentPhotoUrl;
  const hasPhoto = !!displayUrl;

  return (
    <div>
      {/*  Input fichier caché */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/*  Zone de sélection */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="bg-gray-50 border-2 border-dashed border-gray-300 hover:border-blue-700 hover:bg-blue-50 rounded-lg p-8 text-center transition-colors"
        >
          <Upload size={28} className="mx-auto text-gray-500 mb-2" />
          <p className="text-sm font-medium text-gray-700 mb-1">
            Cliquez pour sélectionner
          </p>
          <p className="text-xs text-gray-500">
            JPG, PNG ou WEBP - max 4 Mo
          </p>
        </button>

        {/*  Prévisualisation */}
        {hasPhoto ? (
          <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-video">
            <img
              src={displayUrl || ""}
              alt="Aperçu"
              className="w-full h-full object-cover"
            />
            
            {/*  Bouton supprimer */}
            <button
              type="button"
              onClick={previewUrl ? handleRemoveFile : handleRemoveExisting}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-colors"
              title="Retirer la photo"
            >
              <X size={14} />
            </button>

            {/*  Badge indiquant si c'est une nouvelle photo */}
            {previewUrl && (
              <div className="absolute bottom-2 left-2 bg-blue-950 text-white text-xs px-2 py-1 rounded-full font-medium">
                Nouvelle photo
              </div>
            )}
          </div>
        ) : (
          // 📭 Placeholder si pas de photo
          <div className="bg-blue-50 rounded-lg flex items-center justify-center aspect-video">
            <ImageIcon size={32} className="text-blue-300" />
          </div>
        )}
      </div>
    </div>
  );
}

export default PhotoUploader;