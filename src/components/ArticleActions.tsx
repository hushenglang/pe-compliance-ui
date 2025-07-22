import { ArticleStatusDropdown } from './ArticleStatusDropdown'
import type { ArticleStatus } from '../types'

interface ArticleActionsProps {
  articleId: string
  date: string
  time: string
  contentUrl?: string
  status: ArticleStatus
  isDropdownOpen: boolean
  isInEditMode: boolean
  isStatusLoading: boolean
  isContentUpdateLoading: boolean
  isStatusUpdateAllowed?: (currentStatus: ArticleStatus, newStatus: ArticleStatus) => boolean
  onViewOriginal: () => void
  onEditToggle: (articleId: string) => void
  onStatusToggle: (articleId: string) => void
  onStatusChange: (articleId: string, status: ArticleStatus) => void
}

export const ArticleActions = ({
  articleId,
  date,
  time,
  status,
  isDropdownOpen,
  isInEditMode,
  isStatusLoading,
  isContentUpdateLoading,
  isStatusUpdateAllowed,
  onViewOriginal,
  onEditToggle,
  onStatusToggle,
  onStatusChange
}: ArticleActionsProps) => {
  return (
    <div className="article-actions" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '12px',
      marginTop: '16px',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button 
          className="link-btn"
          onClick={onViewOriginal}
          style={{
            minWidth: '120px',
            padding: '8px 16px',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'background-color 0.2s',
            textDecoration: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#4b5563'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#6b7280'
          }}
        >
          🔗 View Original
        </button>
        
        <button 
          className="edit-save-btn"
          onClick={() => onEditToggle(articleId)}
          disabled={isContentUpdateLoading}
          title={
            isContentUpdateLoading 
              ? 'Saving changes...' 
              : isInEditMode 
                ? 'Save changes' 
                : 'Edit article'
          }
          style={{
            width: '90px',
            padding: '8px 16px',
            backgroundColor: isContentUpdateLoading 
              ? '#9ca3af' 
              : isInEditMode 
                ? '#10b981' 
                : '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: isContentUpdateLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            opacity: isContentUpdateLoading ? 0.7 : 1
          }}
        >
          <span>
            {isContentUpdateLoading 
              ? '⏳' 
              : isInEditMode 
                ? '💾' 
                : '✏️'
            }
          </span>
          {isContentUpdateLoading 
            ? 'Saving...' 
            : isInEditMode 
              ? 'Save' 
              : 'Edit'
          }
        </button>
        
        <ArticleStatusDropdown
          articleId={articleId}
          currentStatus={status}
          isOpen={isDropdownOpen}
          isLoading={isStatusLoading}
          isStatusUpdateAllowed={isStatusUpdateAllowed}
          onToggle={onStatusToggle}
          onStatusChange={onStatusChange}
        />
      </div>
      
      <span className="article-date" style={{
        fontSize: '0.875rem',
        color: '#6b7280',
        fontWeight: '500'
      }}>
        {date} | {time}
      </span>
    </div>
  )
} 