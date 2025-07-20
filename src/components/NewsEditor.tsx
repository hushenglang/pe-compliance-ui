import { FilterControls } from './FilterControls'
import { ArticleItem } from './ArticleItem'
import type { Article, DateRange, SourceFilter, ArticleStatus, EditableArticleData } from '../types'

interface NewsEditorProps {
  dateRange: DateRange
  sourceFilter: SourceFilter
  selectedArticles: string[]
  articles: Article[]
  articleStatus: Record<string, ArticleStatus>
  openDropdowns: string[]
  editingArticles: string[]
  editValues: Record<string, EditableArticleData>
  onDateRangeChange: (dateRange: DateRange) => void
  onSourceFilterChange: (filter: SourceFilter) => void
  onArticleSelection: (articleId: string) => void
  onStatusToggle: (articleId: string) => void
  onStatusChange: (articleId: string, status: ArticleStatus) => void
  onEditToggle: (articleId: string) => void
  onEditValueChange: (articleId: string, field: 'title' | 'aiSummary', value: string) => void
  onGenerateReport: () => void
}

export const NewsEditor = ({
  dateRange,
  sourceFilter,
  selectedArticles,
  articles,
  articleStatus,
  openDropdowns,
  editingArticles,
  editValues,
  onDateRangeChange,
  onSourceFilterChange,
  onArticleSelection,
  onStatusToggle,
  onStatusChange,
  onEditToggle,
  onEditValueChange,
  onGenerateReport
}: NewsEditorProps) => {
  const getArticleStatus = (articleId: string): ArticleStatus => {
    return articleStatus[articleId] || 'pending'
  }

  const isArticleInEditMode = (articleId: string): boolean => {
    return editingArticles.includes(articleId)
  }

  const isDropdownOpen = (articleId: string): boolean => {
    return openDropdowns.includes(articleId)
  }

  return (
    <>
      {/* News Editor Header */}
      <div className="editor-header">
        <h1>📝 News Editor</h1>
        
        {/* Filter Controls */}
        <FilterControls
          dateRange={dateRange}
          sourceFilter={sourceFilter}
          selectedCount={selectedArticles.length}
          onDateRangeChange={onDateRangeChange}
          onSourceFilterChange={onSourceFilterChange}
          onGenerateReport={onGenerateReport}
        />
      </div>

      {/* Articles List */}
      <div className="articles-list">
        {articles.map(article => (
          <ArticleItem
            key={article.id}
            article={article}
            isSelected={selectedArticles.includes(article.id)}
            status={getArticleStatus(article.id)}
            isDropdownOpen={isDropdownOpen(article.id)}
            isInEditMode={isArticleInEditMode(article.id)}
            editValues={editValues[article.id]}
            onSelection={onArticleSelection}
            onStatusToggle={onStatusToggle}
            onStatusChange={onStatusChange}
            onEditToggle={onEditToggle}
            onEditValueChange={onEditValueChange}
          />
        ))}
      </div>
    </>
  )
} 