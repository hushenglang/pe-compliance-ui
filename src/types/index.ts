export type NewsSource = 'SFC' | 'HKMA' | 'SEC' | 'HKEX'

export type ArticleStatus = 'pending' | 'verified' | 'discarded'

export type TabType = 'news-summary' | 'news-editor'

export interface DateRange {
  startDate: string // ISO date string (YYYY-MM-DD)
  endDate: string   // ISO date string (YYYY-MM-DD)
}

export type SourceFilter = 'all-sources' | 'sfc' | 'hkma' | 'sec' | 'hkex'

export type StatusFilter = 'all-statuses' | 'pending' | 'verified' | 'discarded'

export interface NewsSourceData {
  toProcess: number
  processed: number
  icon: string
}

export interface Article {
  id: string
  source: NewsSource
  icon: string
  date: string
  time: string
  title: string
  aiSummary: string
  content: string
  contentUrl?: string
}

export interface EditableArticleData {
  title: string
  aiSummary: string
}

export interface NewsData {
  sfc: NewsSourceData
  hkma: NewsSourceData
  sec: NewsSourceData
  hkex: NewsSourceData
}

// API Response Types
export interface ComplianceNewsLightResponse {
  id: number
  source: string
  issue_date?: string
  title: string
  content_url?: string
  llm_summary?: string
  creation_date: string
  creation_user: string
  status: string
}

export interface GroupedComplianceNewsResponse {
  grouped_news: Record<string, ComplianceNewsLightResponse[]>
}

// Mapped types for UI components
export interface ApiArticle {
  id: string
  source: NewsSource
  icon: string
  date: string
  time: string
  title: string
  aiSummary: string
  content?: string
  contentUrl?: string
  creationDate: string
  creationUser: string
  status: string
}

export interface AppState {
  activeTab: TabType
  dateRange: DateRange
  sourceFilter: SourceFilter
  statusFilter: StatusFilter
  selectedArticles: string[]
  articleStatus: Record<string, ArticleStatus>
  openDropdowns: string[]
  editingArticles: string[]
  editValues: Record<string, EditableArticleData>
  articleData: Article[]
} 