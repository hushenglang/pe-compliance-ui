import { EditableField } from './EditableField'
import { ArticleActions } from './ArticleActions'
import type { Article, ArticleStatus, EditableArticleData } from '../types'

interface ArticleItemProps {
  article: Article
  isSelected: boolean
  status: ArticleStatus
  isDropdownOpen: boolean
  isInEditMode: boolean
  isStatusLoading?: boolean
  editValues?: EditableArticleData
  isStatusUpdateAllowed?: (currentStatus: ArticleStatus, newStatus: ArticleStatus) => boolean
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
  isStatusLoading = false,
  editValues,
  isStatusUpdateAllowed,
  onSelection,
  onStatusToggle,
  onStatusChange,
  onEditToggle,
  onEditValueChange
}: ArticleItemProps) => {
  const handleViewOriginal = () => {
    if (article.contentUrl) {
      window.open(article.contentUrl, '_blank', 'noopener,noreferrer')
    } else {
      console.log('No content URL available for article:', article.id)
      alert('No original article URL available')
    }
  }

  return (
    <div className="article-item">
      <div className="article-content">
        <EditableField
          id={`title-${article.id}`}
          label="Title"
          value={article.title}
          editValue={editValues?.title}
          isInEditMode={isInEditMode}
          showCheckbox={true}
          isChecked={isSelected}
          onCheckboxChange={() => onSelection(article.id)}
          checkboxAriaLabel={`Select article: ${article.title}`}
          onChange={(value) => onEditValueChange(article.id, 'title', value)}
        />
        
        <EditableField
          id={`summary-${article.id}`}
          label="AI Summary"
          value={article.aiSummary}
          editValue={editValues?.aiSummary}
          isInEditMode={isInEditMode}
          isTextArea={true}
          rows={9}
          onChange={(value) => onEditValueChange(article.id, 'aiSummary', value)}
        />
        
        <ArticleActions
          articleId={article.id}
          date={article.date}
          time={article.time}
          contentUrl={article.contentUrl}
          status={status}
          isDropdownOpen={isDropdownOpen}
          isInEditMode={isInEditMode}
          isStatusLoading={isStatusLoading}
          isStatusUpdateAllowed={isStatusUpdateAllowed}
          onViewOriginal={handleViewOriginal}
          onEditToggle={onEditToggle}
          onStatusToggle={onStatusToggle}
          onStatusChange={onStatusChange}
        />
      </div>
    </div>
  )
} 