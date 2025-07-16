interface LoadingSpinnerProps {
  message?: string
  size?: 'small' | 'medium' | 'large'
}

export const LoadingSpinner = ({ 
  message = 'Loading...', 
  size = 'medium' 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8', 
    large: 'w-12 h-12'
  }

  return (
    <div className="loading-container">
      <div className={`loading-spinner ${sizeClasses[size]}`} />
      {message && <span className="loading-text">{message}</span>}
    </div>
  )
} 