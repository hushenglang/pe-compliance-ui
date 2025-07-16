import { ArticleStatusDropdown } from './ArticleStatusDropdown'
import type { Article, ArticleStatus, EditableArticleData } from '../types'

interface ArticleItemProps {
  article: Article
  isSelected: boolean
  status: ArticleStatus
  isDropdownOpen: boolean
  isInEditMode: boolean
  editValues?: EditableArticleData
  onSelection: (articleId: string) => void
  onStatusToggle: (articleId: string) => void
  onStatusChange: (articleId: string, status: ArticleStatus) => void
  onEditToggle: (articleId: string) => void
  onEditValueChange: (articleId: string, field: 'title' | 'aiSummary', value: string) => void
}

export const ArticleItem = ({
  article,
  isSelected,
  status,
  isDropdownOpen,
  isInEditMode,
  editValues,
  onSelection,
  onStatusToggle,
  onStatusChange,
  onEditToggle,
  onEditValueChange
}: ArticleItemProps) => {
  const handleViewOriginal = () => {
    // TODO: Implement navigation to original article
    console.log('Navigate to original article:', article.id)
  }

  return (
    <div className="article-item">
      <div className="article-header">
        <input 
          type="checkbox" 
          checked={isSelected}
          onChange={() => onSelection(article.id)}
          aria-label={`Select article: ${article.title}`}
        />
        <span className="article-source">
          {article.icon} {article.source}
        </span>
        <span className="article-date">
          {article.date} | {article.time}
        </span>
      </div>
      
      <div className="article-content">
        <div className="article-field">
          <label htmlFor={`title-${article.id}`}>Title:</label>
          <div className="editable-field">
            <input 
              id={`title-${article.id}`}
              type="text" 
              value={isInEditMode ? (editValues?.title || '') : article.title}
              onChange={(e) => onEditValueChange(article.id, 'title', e.target.value)}
              readOnly={!isInEditMode}
              className={isInEditMode ? 'editable' : 'readonly'}
              aria-label="Article title"
            />
          </div>
        </div>
        
        <div className="article-field">
          <label htmlFor={`summary-${article.id}`}>AI Summary:</label>
          <div className="editable-field">
            <textarea 
              id={`summary-${article.id}`}
              value={isInEditMode ? (editValues?.aiSummary || '') : article.aiSummary}
              onChange={(e) => onEditValueChange(article.id, 'aiSummary', e.target.value)}
              readOnly={!isInEditMode}
              rows={2}
              className={isInEditMode ? 'editable' : 'readonly'}
              aria-label="Article AI summary"
            />
          </div>
        </div>
        
        <div className="article-actions" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          marginTop: '16px'
        }}>
          <button 
            className="link-btn"
            onClick={handleViewOriginal}
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
            onClick={() => onEditToggle(article.id)}
            title={isInEditMode ? 'Save changes' : 'Edit article'}
            style={{
              width: '90px',
              padding: '8px 16px',
              backgroundColor: isInEditMode ? '#10b981' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <span>{isInEditMode ? '💾' : '✏️'}</span>
            {isInEditMode ? 'Save' : 'Edit'}
          </button>
          
          <ArticleStatusDropdown
            articleId={article.id}
            currentStatus={status}
            isOpen={isDropdownOpen}
            onToggle={onStatusToggle}
            onStatusChange={onStatusChange}
          />
        </div>
      </div>
    </div>
  )
} 