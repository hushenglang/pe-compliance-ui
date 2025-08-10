import { useState, useEffect, useCallback } from 'react'
import { apiService } from '../services/api'
import { SOURCE_CONFIG } from '../utils/constants'
import type { 
  ComplianceNewsLightResponse,
  ApiArticle,
  NewsSource,
  SourceFilter,
  StatusFilter,
  DateRange
} from '../types'

// Helper function to map API response to UI format
const mapApiResponseToArticles = (groupedNews: Record<string, ComplianceNewsLightResponse[]>): ApiArticle[] => {
  const articles: ApiArticle[] = []
  
  Object.entries(groupedNews).forEach(([source, newsList]) => {
    newsList.forEach(news => {
      const issueDate = news.issue_date ? new Date(news.issue_date) : new Date(news.creation_date)
      
      articles.push({
        id: news.id.toString(),
        source: source as NewsSource,
        icon: SOURCE_CONFIG[source as NewsSource]?.icon || '📰',
        date: issueDate.toISOString().split('T')[0], // YYYY-MM-DD format
        time: issueDate.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
        title: news.title,
        aiSummary: news.llm_summary || 'No summary available',
        content: '', // Not provided in light response
        contentUrl: news.content_url,
        creationDate: news.creation_date,
        creationUser: news.creation_user,
        status: news.status
      })
    })
  })
  
  // Sort by date (most recent first)
  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Helper function to convert SourceFilter to API sources parameter
const getApiSourcesParam = (sourceFilter: SourceFilter): string | undefined => {
  if (sourceFilter === 'all-sources') {
    return undefined
  }
  
  const sourceMap: Record<SourceFilter, string> = {
    'all-sources': '',
    'sfc': 'SFC',
    'hkma': 'HKMA', 
    'sec': 'SEC',
    'hkex': 'HKEX'
  }
  
  return sourceMap[sourceFilter]
}

// Helper function to convert StatusFilter to API status parameter
const getApiStatusParam = (statusFilter: StatusFilter): string | undefined => {
  if (statusFilter === 'all-statuses') {
    return undefined
  }
  
  const statusMap: Record<StatusFilter, string> = {
    'all-statuses': '',
    'pending': 'PENDING',
    'verified': 'VERIFIED', 
    'discarded': 'DISCARD'
  }
  
  return statusMap[statusFilter]
}

export interface UseNewsDataResult {
  articles: ApiArticle[]
  loading: boolean
  filterLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  refresh: () => Promise<void>
}

export const useNewsData = (dateRange: DateRange, sourceFilter: SourceFilter, statusFilter: StatusFilter): UseNewsDataResult => {
  const [articles, setArticles] = useState<ApiArticle[]>([])
  const [loading, setLoading] = useState(true) // Initial loading
  const [filterLoading, setFilterLoading] = useState(false) // Filter-triggered loading
  const [error, setError] = useState<string | null>(null)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  const fetchNews = useCallback(async () => {
    if (isInitialLoad) {
      setLoading(true)
    } else {
      setFilterLoading(true)
    }
    setError(null)
    
    try {
      const sourcesParam = getApiSourcesParam(sourceFilter)
      const statusParam = getApiStatusParam(statusFilter)
      const response = await apiService.getGroupedNewsByDateRange(
        dateRange.startDate,
        dateRange.endDate,
        sourcesParam,
        statusParam
      )
      
      const mappedArticles = mapApiResponseToArticles(response.grouped_news)
      setArticles(mappedArticles)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch news data'
      setError(errorMessage)
      console.error('Failed to fetch news data:', err)
    } finally {
      if (isInitialLoad) {
        setLoading(false)
        setIsInitialLoad(false)
      } else {
        setFilterLoading(false)
      }
    }
  }, [dateRange.startDate, dateRange.endDate, sourceFilter, statusFilter, isInitialLoad])

  // Fetch data when dependencies change
  useEffect(() => {
    fetchNews()
  }, [fetchNews])

  const refetch = useCallback(async () => {
    // Force a full reload state
    setIsInitialLoad(true)
    await fetchNews()
  }, [fetchNews])

  const refresh = useCallback(async () => {
    // Soft refresh using filter loading state
    setIsInitialLoad(false)
    await fetchNews()
  }, [fetchNews])

  return {
    articles,
    loading,
    filterLoading,
    error,
    refetch,
    refresh
  }
} 