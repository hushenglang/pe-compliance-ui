import { useState, useCallback } from 'react'
import { apiService } from '../services/api'
import { API_STATUS_MAPPING } from '../utils/constants'
import type { ArticleStatus, StatusUpdateState, StatusNotification } from '../types'

interface UseStatusUpdatesResult {
  statusUpdateState: StatusUpdateState
  notifications: StatusNotification[]
  updateArticleStatus: (articleId: string, newStatus: ArticleStatus) => Promise<void>
  isStatusUpdateAllowed: (currentStatus: ArticleStatus, newStatus: ArticleStatus) => boolean
  dismissNotification: (notificationId: string) => void
}

export const useStatusUpdates = (): UseStatusUpdatesResult => {
  const [statusUpdateState, setStatusUpdateState] = useState<StatusUpdateState>({
    loading: {},
    lastUpdated: {}
  })
  const [notifications, setNotifications] = useState<StatusNotification[]>([])

  // Business rules for status transitions
  const isStatusUpdateAllowed = useCallback((currentStatus: ArticleStatus, newStatus: ArticleStatus): boolean => {
    // Same status - no change needed
    if (currentStatus === newStatus) {
      return false
    }

    // "VERIFIED" and "DISCARDED" can not be updated to "PENDING" again
    if ((currentStatus === 'verified' || currentStatus === 'discarded') && newStatus === 'pending') {
      return false
    }

    // "VERIFIED" and "DISCARDED" can be changed to each other
    if ((currentStatus === 'verified' && newStatus === 'discarded') || 
        (currentStatus === 'discarded' && newStatus === 'verified')) {
      return true
    }

    // PENDING can be changed to VERIFIED or DISCARDED
    if (currentStatus === 'pending' && (newStatus === 'verified' || newStatus === 'discarded')) {
      return true
    }

    return false
  }, [])

  const addNotification = useCallback((message: string, type: 'success' | 'error') => {
    const notification: StatusNotification = {
      id: `notification-${Date.now()}-${Math.random()}`,
      message,
      type,
      timestamp: Date.now()
    }

    setNotifications(prev => [...prev, notification])

    // Auto-dismiss notification after 4 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id))
    }, 4000)
  }, [])

  const dismissNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
  }, [])

  const updateArticleStatus = useCallback(async (articleId: string, newStatus: ArticleStatus) => {
    // Set loading state
    setStatusUpdateState(prev => ({
      ...prev,
      loading: { ...prev.loading, [articleId]: true }
    }))

    try {
      // Map frontend status to backend status using centralized mapping
      const backendStatus = API_STATUS_MAPPING[newStatus]
      
      const response = await apiService.updateNewsStatus(articleId, backendStatus)
      
      // Update last updated timestamp
      setStatusUpdateState(prev => ({
        ...prev,
        loading: { ...prev.loading, [articleId]: false },
        lastUpdated: { ...prev.lastUpdated, [articleId]: Date.now() }
      }))

      // Show success notification
      addNotification(response.message, 'success')
    } catch (error) {
      // Clear loading state
      setStatusUpdateState(prev => ({
        ...prev,
        loading: { ...prev.loading, [articleId]: false }
      }))

      // Show error notification
      const errorMessage = error instanceof Error ? error.message : 'Failed to update status'
      addNotification(errorMessage, 'error')
      
      throw error
    }
  }, [addNotification])

  return {
    statusUpdateState,
    notifications,
    updateArticleStatus,
    isStatusUpdateAllowed,
    dismissNotification
  }
} 