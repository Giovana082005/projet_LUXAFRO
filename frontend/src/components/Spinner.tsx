interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  color?: "blue" | "white" | "gray";
}

function Spinner({ 
  size = "md", 
  fullScreen = false,
  color = "blue"
}: SpinnerProps) {
  // Tailles selon le besoin
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-12 h-12 border-4",
    lg: "w-20 h-20 border-4",
  };

  // Couleurs selon le contexte
  const colorClasses = {
    blue: "border-blue-500",
    white: "border-white",
    gray: "border-gray-400",
  };

  const spinner = (
    <div
      className={`
        ${sizeClasses[size]} 
        ${colorClasses[color]} 
        border-t-transparent 
        rounded-full 
        animate-spin
      `}
      aria-label="Chargement en cours"
      role="status"
    ></div>
  );

  // Si fullScreen, on l'enveloppe dans un conteneur centré
  if (fullScreen) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
}

export default Spinner;