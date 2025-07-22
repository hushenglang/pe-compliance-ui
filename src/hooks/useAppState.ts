import { useState, useEffect } from 'react'
import { useNewsData } from './useNewsData'
import { useStatusUpdates } from './useStatusUpdates'
import { apiService } from '../services/api'
import type { 
  TabType, 
  DateRange, 
  SourceFilter, 
  StatusFilter, 
  ArticleStatus, 
  EditableArticleData,
  StatusNotification,
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
  
  // Content update loading state
  const [contentUpdateLoading, setContentUpdateLoading] = useState<Record<string, boolean>>({})
  const [contentUpdateNotifications, setContentUpdateNotifications] = useState<StatusNotification[]>([])
  
  // Local state to track updated articles (to avoid unnecessary API calls)
  const [updatedArticles, setUpdatedArticles] = useState<Record<string, { title?: string; aiSummary?: string }>>({})
  
  // Use the news data hook for API integration
  const { articles: apiArticles, loading, filterLoading, error, refetch } = useNewsData(dateRange, sourceFilter, statusFilter)
  
  // Use the status updates hook
  const { 
    statusUpdateState, 
    notifications: statusNotifications, 
    updateArticleStatus, 
    isStatusUpdateAllowed, 
    dismissNotification: dismissStatusNotification 
  } = useStatusUpdates()
  
  // Combine all notifications
  const notifications = [...statusNotifications, ...contentUpdateNotifications]

  // Convert API articles to the format expected by existing components and merge with local updates
  const articleData = apiArticles.map(apiArticle => {
    const mapped = mapApiArticleToArticle(apiArticle)
    const updates = updatedArticles[mapped.id]
    
    if (updates) {
      return {
        ...mapped,
        title: updates.title !== undefined ? updates.title : mapped.title,
        aiSummary: updates.aiSummary !== undefined ? updates.aiSummary : mapped.aiSummary
      }
    }
    
    return mapped
  })

  // Clear selectedArticles and updatedArticles when filters change
  useEffect(() => {
    setSelectedArticles([])
    setUpdatedArticles({}) // Clear local updates when data changes
  }, [dateRange.startDate, dateRange.endDate, sourceFilter, statusFilter])

  // Filter selectedArticles to only include articles that exist in current results
  useEffect(() => {
    const currentArticleIds = new Set(apiArticles.map(article => article.id))
    setSelectedArticles(prev => prev.filter(id => currentArticleIds.has(id)))
    
    // Also clean up local updates for articles that are no longer in current view
    setUpdatedArticles(prev => {
      const filtered: Record<string, { title?: string; aiSummary?: string }> = {}
      Object.keys(prev).forEach(id => {
        if (currentArticleIds.has(id)) {
          filtered[id] = prev[id]
        }
      })
      return filtered
    })
  }, [apiArticles])

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

  const addContentUpdateNotification = (message: string, type: 'success' | 'error') => {
    const notification: StatusNotification = {
      id: `content-notification-${Date.now()}-${Math.random()}`,
      message,
      type,
      timestamp: Date.now()
    }

    setContentUpdateNotifications(prev => [...prev, notification])

    // Auto-dismiss notification after 4 seconds
    setTimeout(() => {
      setContentUpdateNotifications(prev => prev.filter(n => n.id !== notification.id))
    }, 4000)
  }

  const dismissNotification = (notificationId: string) => {
    // Try to dismiss from both notification arrays
    dismissStatusNotification(notificationId)
    setContentUpdateNotifications(prev => prev.filter(n => n.id !== notificationId))
  }

  const isContentUpdateLoading = (articleId: string): boolean => {
    return contentUpdateLoading[articleId] || false
  }

  const toggleEditMode = async (articleId: string) => {
    const isEditing = isArticleInEditMode(articleId)
    
    if (isEditing) {
      // Save changes - call the API
      const editData = editValues[articleId]
      if (editData) {
        // Set loading state
        setContentUpdateLoading(prev => ({ ...prev, [articleId]: true }))
        
        try {
          const article = articleData.find(a => a.id === articleId)
          const originalTitle = article?.title || ''
          const originalSummary = article?.aiSummary || ''
          
          // Only send fields that have actually changed
          const titleChanged = editData.title !== originalTitle
          const summaryChanged = editData.aiSummary !== originalSummary
          
          if (titleChanged || summaryChanged) {
            const response = await apiService.updateNewsContent(
              articleId,
              titleChanged ? editData.title : undefined,
              summaryChanged ? editData.aiSummary : undefined
            )
            
            // Update local state instead of refetching
            setUpdatedArticles(prev => ({
              ...prev,
              [articleId]: {
                ...(titleChanged && { title: editData.title }),
                ...(summaryChanged && { aiSummary: editData.aiSummary })
              }
            }))
            
            // Show success notification
            addContentUpdateNotification(response.message, 'success')
          }
        } catch (error) {
          // Show error notification
          const errorMessage = error instanceof Error ? error.message : 'Failed to update content'
          addContentUpdateNotification(errorMessage, 'error')
          
          // Clear loading state
          setContentUpdateLoading(prev => ({ ...prev, [articleId]: false }))
          
          // Don't exit edit mode on error
          return
        }
        
        // Clear loading state
        setContentUpdateLoading(prev => ({ ...prev, [articleId]: false }))
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
    isContentUpdateLoading,
    isStatusUpdateAllowed,
    dismissNotification
  }
} 