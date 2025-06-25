export default function LoadingSpinner({ size = "md", text = "Carregando..." }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-primary-200 dark:border-primary-800`}></div>
        <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-transparent border-t-primary-600 dark:border-t-primary-400 absolute top-0 left-0`}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`${size === 'xl' ? 'w-6 h-6' : size === 'lg' ? 'w-4 h-4' : 'w-2 h-2'} bg-primary-600 dark:bg-primary-400 rounded-full animate-pulse`}></div>
        </div>
      </div>
      {text && (
        <p className="mt-4 text-muted-foreground text-sm font-medium">{text}</p>
      )}
    </div>
  );
} 