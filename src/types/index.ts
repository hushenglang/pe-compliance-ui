export type NewsSource = 'SFC' | 'HKMA' | 'SEC' | 'HKEX'

export type ArticleStatus = 'pending' | 'verified' | 'discarded'

export type TabType = 'news-summary' | 'news-editor'

export type TimePeriod = 'last-7-days' | 'last-30-days' | 'last-90-days'

export type SourceFilter = 'all-sources' | 'sfc' | 'hkma' | 'sec' | 'hkex'

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

export interface AppState {
  activeTab: TabType
  timePeriod: TimePeriod
  sourceFilter: SourceFilter
  selectedArticles: string[]
  articleStatus: Record<string, ArticleStatus>
  openDropdowns: string[]
  editingArticles: string[]
  editValues: Record<string, EditableArticleData>
  articleData: Article[]
} 