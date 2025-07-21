import { FilterControls } from './FilterControls'
import { ArticleItem } from './ArticleItem'
import { LoadingSpinner } from './LoadingSpinner'
import type { Article, DateRange, SourceFilter, StatusFilter, ArticleStatus, EditableArticleData, NewsSource } from '../types'

interface NewsEditorProps {
  dateRange: DateRange
  sourceFilter: SourceFilter
  statusFilter: StatusFilter
  selectedArticles: string[]
  articles: Article[]
  articleStatus: Record<string, ArticleStatus>
  openDropdowns: string[]
  editingArticles: string[]
  editValues: Record<string, EditableArticleData>
  filterLoading: boolean
  isArticleStatusLoading: (articleId: string) => boolean
  isStatusUpdateAllowed: (currentStatus: ArticleStatus, newStatus: ArticleStatus) => boolean
  onDateRangeChange: (dateRange: DateRange) => void
  onSourceFilterChange: (filter: SourceFilter) => void
  onStatusFilterChange: (filter: StatusFilter) => void
  onArticleSelection: (articleId: string) => void
  onStatusToggle: (articleId: string) => void
  onStatusChange: (articleId: string, status: ArticleStatus) => void
  onEditToggle: (articleId: string) => void
  onEditValueChange: (articleId: string, field: 'title' | 'aiSummary', value: string) => void
  onGenerateReport: () => void
}

// Source configuration with icons
const sourceConfig = {
  SFC: { icon: '🏢', name: 'SFC' },
  HKMA: { icon: '🏦', name: 'HKMA' },
  SEC: { icon: '🇺🇸', name: 'SEC' },
  HKEX: { icon: '📈', name: 'HKEX' }
}

export const NewsEditor = ({
  dateRange,
  sourceFilter,
  statusFilter,
  selectedArticles,
  articles,
  articleStatus,
  openDropdowns,
  editingArticles,
  editValues,
  filterLoading,
  isArticleStatusLoading,
  isStatusUpdateAllowed,
  onDateRangeChange,
  onSourceFilterChange,
  onStatusFilterChange,
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

  // Group articles by source
  const groupedArticles = articles.reduce((groups, article) => {
    const source = article.source
    if (!groups[source]) {
      groups[source] = []
    }
    groups[source].push(article)
    return groups
  }, {} as Record<NewsSource, Article[]>)

  // Sort sources for consistent display order
  const sortedSources = (Object.keys(groupedArticles) as NewsSource[]).sort()

  return (
    <>
      {/* News Editor Header */}
      <div className="editor-header">
        <h1>📝 News Editor</h1>
        
        {/* Filter Controls */}
        <FilterControls
          dateRange={dateRange}
          sourceFilter={sourceFilter}
          statusFilter={statusFilter}
          selectedCount={selectedArticles.length}
          totalCount={articles.length}
          onDateRangeChange={onDateRangeChange}
          onSourceFilterChange={onSourceFilterChange}
          onStatusFilterChange={onStatusFilterChange}
          onGenerateReport={onGenerateReport}
        />
      </div>

      {/* Grouped Articles List */}
      <div className="articles-list">
        {filterLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <LoadingSpinner message="Filtering articles..." />
          </div>
        ) :
          <>
            {sortedSources.map(source => (
              <div key={source} className="source-group">
                {/* Source Group Header */}
                <div className="source-group-header">
                  <div className="source-group-title">
                    <span className="source-icon">{sourceConfig[source].icon}</span>
                    <span className="source-name">{sourceConfig[source].name}</span>
                    <span className="source-count">({groupedArticles[source].length} articles)</span>
                  </div>
                </div>
                
                {/* Articles in this source group */}
                <div className="source-group-articles">
                  {groupedArticles[source].map(article => (
                    <ArticleItem
                      key={article.id}
                      article={article}
                      isSelected={selectedArticles.includes(article.id)}
                      status={getArticleStatus(article.id)}
                      isDropdownOpen={isDropdownOpen(article.id)}
                      isInEditMode={isArticleInEditMode(article.id)}
                      isStatusLoading={isArticleStatusLoading(article.id)}
                      isStatusUpdateAllowed={isStatusUpdateAllowed}
                      editValues={editValues[article.id]}
                      onSelection={onArticleSelection}
                      onStatusToggle={onStatusToggle}
                      onStatusChange={onStatusChange}
                      onEditToggle={onEditToggle}
                      onEditValueChange={onEditValueChange}
                    />
                  ))}
                </div>
              </div>
            ))}
            
            {/* Show message if no articles */}
            {articles.length === 0 && (
              <div className="no-articles-message">
                <div className="empty-state">
                  <span className="empty-icon">📄</span>
                  <h3>No articles found</h3>
                  <p>Try adjusting your filters or date range to see more articles.</p>
                </div>
              </div>
            )}
          </>
        }
      </div>
    </>
  )
} 