import type { ArticleStatus } from '../types'

interface ArticleStatusDropdownProps {
  articleId: string
  currentStatus: ArticleStatus
  isOpen: boolean
  onToggle: (articleId: string) => void
  onStatusChange: (articleId: string, status: ArticleStatus) => void
}

const statusConfig = {
  pending: { icon: '⏳', label: 'Pending', bgClass: 'bg-yellow-50 border-yellow-200 text-yellow-800', hoverClass: 'hover:bg-yellow-100' },
  verified: { icon: '✅', label: 'Verified', bgClass: 'bg-green-50 border-green-200 text-green-800', hoverClass: 'hover:bg-green-100' },
  discarded: { icon: '❌', label: 'Discarded', bgClass: 'bg-red-50 border-red-200 text-red-800', hoverClass: 'hover:bg-red-100' }
}

export const ArticleStatusDropdown = ({
  articleId,
  currentStatus,
  isOpen,
  onToggle,
  onStatusChange
}: ArticleStatusDropdownProps) => {
  const currentConfig = statusConfig[currentStatus]

  return (
    <div className="verification-section">
      <div className="relative inline-block text-left">
        {/* Button Group */}
        <div className="inline-flex divide-x divide-gray-300 rounded-md shadow-sm status-button-group">
          {/* Status Display Button */}
          <div className={`relative inline-flex items-center px-3 py-2 rounded-l-md border text-sm font-medium status-display ${currentConfig.bgClass}`}>
            <span className="text-base status-icon">{currentConfig.icon}</span>
            <span className="ml-2 font-medium">{currentConfig.label}</span>
          </div>
          
          {/* Dropdown Toggle Button */}
          <button
            type="button"
            onClick={() => onToggle(articleId)}
            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${currentConfig.bgClass} ${currentConfig.hoverClass}`}
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1" role="menu">
              {Object.entries(statusConfig).map(([status, config]) => (
                <button
                  key={status}
                  onClick={() => onStatusChange(articleId, status as ArticleStatus)}
                  className={`group flex w-full items-center px-4 py-2 text-sm hover:bg-gray-100 ${
                    currentStatus === status ? `${config.bgClass.replace('border-', 'text-').replace('-200', '-900')}` : 'text-gray-700'
                  }`}
                  role="menuitem"
                >
                  <span className="text-base mr-3">{config.icon}</span>
                  {config.label}
                  {currentStatus === status && (
                    <svg className="ml-auto h-4 w-4 text-current" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 