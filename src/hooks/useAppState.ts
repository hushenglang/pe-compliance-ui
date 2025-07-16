import { useState, useEffect } from 'react'
import type { AppState, ArticleStatus, EditableArticleData, Article } from '../types'
import { mockArticles } from '../data/mockData'

export const useAppState = () => {
  const [activeTab, setActiveTab] = useState<AppState['activeTab']>('news-summary')
  const [timePeriod, setTimePeriod] = useState<AppState['timePeriod']>('last-7-days')
  const [sourceFilter, setSourceFilter] = useState<AppState['sourceFilter']>('all-sources')
  const [selectedArticles, setSelectedArticles] = useState<string[]>([])
  const [articleStatus, setArticleStatus] = useState<Record<string, ArticleStatus>>({})
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([])
  const [editingArticles, setEditingArticles] = useState<string[]>([])
  const [editValues, setEditValues] = useState<Record<string, EditableArticleData>>({})
  const [articleData, setArticleData] = useState<Article[]>([])

  // Initialize article data
  useEffect(() => {
    setArticleData(mockArticles)
  }, [])

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
      // Save changes
      const editData = editValues[articleId]
      if (editData) {
        setArticleData(prev => prev.map(article => 
          article.id === articleId 
            ? { ...article, title: editData.title, aiSummary: editData.aiSummary }
            : article
        ))
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
    timePeriod,
    sourceFilter,
    selectedArticles,
    articleStatus,
    openDropdowns,
    editingArticles,
    editValues,
    articleData,
    
    // Setters
    setActiveTab,
    setTimePeriod,
    setSourceFilter,
    
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