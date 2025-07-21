import { useState, useEffect } from 'react'
import { useNewsData } from './useNewsData'
import { useStatusUpdates } from './useStatusUpdates'
import type { 
  TabType, 
  DateRange, 
  SourceFilter, 
  StatusFilter, 
  ArticleStatus, 
  EditableArticleData,
  Article,
  ApiArticle
} from '../types'

// Helper function to get default date range (last 7 days to today)
const getDefaultDateRange = (): DateRange => {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(endDate.getDate() - 7)
  
  return {
    startDate: startDate.toISOString().split('T')[0], // YYYY-MM-DD format
    endDate: endDate.toISOString().split('T')[0]
  }
}

// Helper function to map API article to UI article format
const mapApiArticleToArticle = (apiArticle: ApiArticle): Article => ({
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

// Helper function to convert API status to ArticleStatus
const mapApiStatusToArticleStatus = (apiStatus: string): ArticleStatus => {
  switch (apiStatus.toUpperCase()) {
    case 'PENDING':
      return 'pending'
    case 'VERIFIED':
      return 'verified'
    case 'DISCARD':
      return 'discarded'
    default:
      return 'pending' // Default fallback
  }
}

export const useAppState = () => {
  // UI State
  const [activeTab, setActiveTab] = useState<TabType>('news-summary')
  const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange())
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all-sources')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all-statuses')
  const [selectedArticles, setSelectedArticles] = useState<string[]>([])
  const [articleStatus, setArticleStatus] = useState<Record<string, ArticleStatus>>({})
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([])
  const [editingArticles, setEditingArticles] = useState<string[]>([])
  const [editValues, setEditValues] = useState<Record<string, EditableArticleData>>({})
  
  // Use the news data hook for API integration
  const { articles: apiArticles, loading, filterLoading, error, refetch } = useNewsData(dateRange, sourceFilter, statusFilter)
  
  // Use the status updates hook
  const { 
    statusUpdateState, 
    notifications, 
    updateArticleStatus, 
    isStatusUpdateAllowed, 
    dismissNotification 
  } = useStatusUpdates()
  
  // Convert API articles to the format expected by existing components
  // Note: Status filtering is now handled by the API, so we don't need client-side filtering
  const articleData = apiArticles.map(mapApiArticleToArticle)

  // Sync article status from API when articles change
  useEffect(() => {
    const newArticleStatus: Record<string, ArticleStatus> = {}
    apiArticles.forEach(apiArticle => {
      newArticleStatus[apiArticle.id] = mapApiStatusToArticleStatus(apiArticle.status)
    })
    setArticleStatus(newArticleStatus)
  }, [apiArticles])

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

  const setArticleStatusAndCloseDropdown = async (articleId: string, status: ArticleStatus) => {
    const currentStatus = getArticleStatus(articleId)
    
    // Check if the status change is allowed
    if (!isStatusUpdateAllowed(currentStatus, status)) {
      console.log('Status change not allowed:', { from: currentStatus, to: status })
      return
    }

    try {
      // Call the API to update status
      await updateArticleStatus(articleId, status)
      
      // Update local state only if API call succeeds
      setArticleStatus(prev => ({
        ...prev,
        [articleId]: status
      }))
      
      // Close dropdown
      setOpenDropdowns(prev => prev.filter(id => id !== articleId))
      
      // Optionally refetch data to ensure consistency
      // Note: You might want to debounce this or only do it periodically
      // refetch()
      
    } catch (error) {
      console.error('Failed to update article status:', error)
      // Error is already handled by the useStatusUpdates hook with notifications
    }
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

  // Helper function to check if an article status is loading
  const isArticleStatusLoading = (articleId: string): boolean => {
    return statusUpdateState.loading[articleId] || false
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
    statusUpdateState,
    notifications,
    
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
    updateEditValue,
    isArticleStatusLoading,
    isStatusUpdateAllowed,
    dismissNotification
  }
} 