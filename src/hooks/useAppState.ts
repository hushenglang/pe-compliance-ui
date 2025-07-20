import { useState, useEffect } from 'react'
import type { AppState, ArticleStatus, EditableArticleData, Article, DateRange, StatusFilter } from '../types'
import { useNewsData } from './useNewsData'

// Helper function to get default date range (last 7 days)
const getDefaultDateRange = (): DateRange => {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(endDate.getDate() - 7)
  
  return {
    startDate: startDate.toISOString().split('T')[0], // YYYY-MM-DD format
    endDate: endDate.toISOString().split('T')[0]
  }
}

// Helper function to convert ApiArticle to Article format
const mapApiArticleToArticle = (apiArticle: any): Article => ({
  id: apiArticle.id,
  source: apiArticle.source,
  icon: apiArticle.icon,
  date: apiArticle.date,
  time: apiArticle.time,
  title: apiArticle.title,
  aiSummary: apiArticle.aiSummary,
  content: apiArticle.content || '',
  contentUrl: apiArticle.contentUrl
})

export const useAppState = () => {
  const [activeTab, setActiveTab] = useState<AppState['activeTab']>('news-summary')
  const [dateRange, setDateRange] = useState<AppState['dateRange']>(getDefaultDateRange())
  const [sourceFilter, setSourceFilter] = useState<AppState['sourceFilter']>('all-sources')
  const [statusFilter, setStatusFilter] = useState<AppState['statusFilter']>('all-statuses')
  const [selectedArticles, setSelectedArticles] = useState<string[]>([])
  const [articleStatus, setArticleStatus] = useState<Record<string, ArticleStatus>>({})
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([])
  const [editingArticles, setEditingArticles] = useState<string[]>([])
  const [editValues, setEditValues] = useState<Record<string, EditableArticleData>>({})
  
  // Use the news data hook for API integration
  const { articles: apiArticles, loading, filterLoading, error, refetch } = useNewsData(dateRange, sourceFilter)
  
  // Convert API articles to the format expected by existing components and filter by status
  const allArticleData = apiArticles.map(mapApiArticleToArticle)
  
  // Filter articles by status
  const articleData = statusFilter === 'all-statuses' 
    ? allArticleData 
    : allArticleData.filter(article => {
        const status = articleStatus[article.id] || 'pending'
        return status === statusFilter
      })

  const handleArticleSelection = (articleId: string) => {
    setSelectedArticles(prev => 
      prev.includes(articleId) 
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    )
  }

  const getArticleStatus = (articleId: string): ArticleStatus => {
    return articleStatus[articleId] || 'pending'
  }

  const toggleDropdown = (articleId: string) => {
    setOpenDropdowns(prev => 
      prev.includes(articleId) 
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    )
  }

  const setArticleStatusAndCloseDropdown = (articleId: string, status: ArticleStatus) => {
    setArticleStatus(prev => ({
      ...prev,
      [articleId]: status
    }))
    setOpenDropdowns(prev => prev.filter(id => id !== articleId))
  }

  const isArticleInEditMode = (articleId: string): boolean => {
    return editingArticles.includes(articleId)
  }

  const toggleEditMode = (articleId: string) => {
    const isEditing = isArticleInEditMode(articleId)
    
    if (isEditing) {
      // Save changes - in a real app, this would typically sync back to the API
      const editData = editValues[articleId]
      if (editData) {
        // For now, we just update local state
        // In a production app, you'd want to call an API to save changes
        console.log('Saving changes for article:', articleId, editData)
      }
      // Remove from editing
      setEditingArticles(prev => prev.filter(id => id !== articleId))
      // Clear edit values
      setEditValues(prev => {
        const newValues = { ...prev }
        delete newValues[articleId]
        return newValues
      })
    } else {
      // Start editing
      const article = articleData.find(a => a.id === articleId)
      if (article) {
        setEditValues(prev => ({
          ...prev,
          [articleId]: { title: article.title, aiSummary: article.aiSummary }
        }))
        setEditingArticles(prev => [...prev, articleId])
      }
    }
  }

  const updateEditValue = (articleId: string, field: 'title' | 'aiSummary', value: string) => {
    setEditValues(prev => ({
      ...prev,
      [articleId]: {
        ...prev[articleId],
        [field]: value
      }
    }))
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.relative.inline-block')) {
        setOpenDropdowns([])
      }
    }

    if (openDropdowns.length > 0) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openDropdowns])

  return {
    // State
    activeTab,
    dateRange,
    sourceFilter,
    statusFilter,
    selectedArticles,
    articleStatus,
    openDropdowns,
    editingArticles,
    editValues,
    articleData,
    
    // API state
    loading,
    filterLoading,
    error,
    refetch,
    
    // Setters
    setActiveTab,
    setDateRange,
    setSourceFilter,
    setStatusFilter,
    
    // Computed/Actions
    handleArticleSelection,
    getArticleStatus,
    toggleDropdown,
    setArticleStatusAndCloseDropdown,
    isArticleInEditMode,
    toggleEditMode,
    updateEditValue
  }
} 