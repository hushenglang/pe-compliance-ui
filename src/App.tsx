import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('news-summary')
  const [timePeriod, setTimePeriod] = useState('last-7-days')
  const [sourceFilter, setSourceFilter] = useState('all-sources')
  const [selectedArticles, setSelectedArticles] = useState<string[]>([])
  const [articleStatus, setArticleStatus] = useState<Record<string, 'pending' | 'verified' | 'discarded'>>({})
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([])
  const [editingArticles, setEditingArticles] = useState<string[]>([])
  const [editValues, setEditValues] = useState<Record<string, { title: string; aiSummary: string }>>({})
  const [articleData, setArticleData] = useState<any[]>([])

  // Mock data for news sources
  const newsData = {
    sfc: { toProcess: 15, processed: 8, icon: '🏢' },
    hkma: { toProcess: 8, processed: 6, icon: '🏦' },
    sec: { toProcess: 12, processed: 9, icon: '🇺🇸' },
    hkex: { toProcess: 6, processed: 4, icon: '📈' }
  }

  // Mock data for news articles
  const mockArticles = [
    {
      id: 'sfc-001',
      source: 'SFC',
      icon: '🏢',
      date: '2024-01-15',
      time: '09:30 AM',
      title: 'Latest SFC Guidelines on Digital Assets Trading',
      aiSummary: 'The SFC has issued new guidelines for digital asset trading platforms, focusing on enhanced risk management and investor protection measures.',
      content: 'The Securities and Futures Commission (SFC) today announced comprehensive new guidelines for digital asset trading platforms operating in Hong Kong. The new regulations emphasize enhanced risk management protocols, mandatory investor protection measures, and stricter compliance requirements for all licensed operators.'
    },
    {
      id: 'hkma-001',
      source: 'HKMA',
      icon: '🏦',
      date: '2024-01-14',
      time: '14:20 PM',
      title: 'Banking Sector Risk Management Updates',
      aiSummary: 'New risk assessment requirements for Hong Kong banks focusing on climate-related financial risks and operational resilience.',
      content: 'The Hong Kong Monetary Authority (HKMA) has updated its risk management guidelines for the banking sector, introducing new requirements for climate-related financial risk assessments and enhanced operational resilience standards.'
    },
    {
      id: 'sec-001',
      source: 'SEC',
      icon: '🇺🇸',
      date: '2024-01-14',
      time: '22:15 PM',
      title: 'SEC Enforcement Actions Against Market Manipulation',
      aiSummary: 'The SEC announced multiple enforcement actions targeting market manipulation schemes in cryptocurrency markets.',
      content: 'The U.S. Securities and Exchange Commission (SEC) today announced enforcement actions against several individuals and entities involved in market manipulation schemes affecting cryptocurrency trading platforms.'
    }
  ]

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

  const getArticleStatus = (articleId: string) => {
    return articleStatus[articleId] || 'pending'
  }

  const toggleDropdown = (articleId: string) => {
    setOpenDropdowns(prev => 
      prev.includes(articleId) 
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    )
  }

  const setArticleStatusAndCloseDropdown = (articleId: string, status: 'pending' | 'verified' | 'discarded') => {
    setArticleStatus(prev => ({
      ...prev,
      [articleId]: status
    }))
    setOpenDropdowns(prev => prev.filter(id => id !== articleId))
  }

  const getStatusDisplay = (status: 'pending' | 'verified' | 'discarded') => {
    switch(status) {
      case 'pending': return { icon: '⏳', label: 'Pending' }
      case 'verified': return { icon: '✅', label: 'Verified' }
      case 'discarded': return { icon: '❌', label: 'Discarded' }
    }
  }

  const isArticleInEditMode = (articleId: string) => {
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

  return (
    <div className="app-container">
      {/* Left Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>📊 PE Compliance</h2>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'news-summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('news-summary')}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">News Summary</span>
            {activeTab === 'news-summary' && <span className="nav-indicator">📍</span>}
          </button>
          <button 
            className={`nav-item ${activeTab === 'news-editor' ? 'active' : ''}`}
            onClick={() => setActiveTab('news-editor')}
          >
            <span className="nav-icon">📝</span>
            <span className="nav-text">News Editor</span>
            {activeTab === 'news-editor' && <span className="nav-indicator">📍</span>}
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`main-content ${activeTab === 'news-editor' ? 'editor-mode' : ''}`}>
        {activeTab === 'news-summary' && (
          <>
            {/* Header */}
            <div className="header">
              <h1>📰 PE Compliance News Dashboard</h1>
            </div>

            {/* News Sources Section */}
            <div className="news-sources-section">
              <div className="news-sources-grid">
                {/* SFC Card */}
                <div className="news-source-card">
                  <div className="card-header">
                    <span className="source-icon">{newsData.sfc.icon}</span>
                    <span className="source-name">SFC</span>
                  </div>
                  <div className="card-content">
                    <div className="process-status">
                      <div className="to-process">To Process: {newsData.sfc.toProcess}</div>
                      <div className="processed">Processed: {newsData.sfc.processed}</div>
                    </div>
                  </div>
                </div>

                {/* HKMA Card */}
                <div className="news-source-card">
                  <div className="card-header">
                    <span className="source-icon">{newsData.hkma.icon}</span>
                    <span className="source-name">HKMA</span>
                  </div>
                  <div className="card-content">
                    <div className="process-status">
                      <div className="to-process">To Process: {newsData.hkma.toProcess}</div>
                      <div className="processed">Processed: {newsData.hkma.processed}</div>
                    </div>
                  </div>
                </div>

                {/* SEC Card */}
                <div className="news-source-card">
                  <div className="card-header">
                    <span className="source-icon">{newsData.sec.icon}</span>
                    <span className="source-name">SEC</span>
                  </div>
                  <div className="card-content">
                    <div className="process-status">
                      <div className="to-process">To Process: {newsData.sec.toProcess}</div>
                      <div className="processed">Processed: {newsData.sec.processed}</div>
                    </div>
                  </div>
                </div>

                {/* HKEX Card */}
                <div className="news-source-card">
                  <div className="card-header">
                    <span className="source-icon">{newsData.hkex.icon}</span>
                    <span className="source-name">HKEX</span>
                  </div>
                  <div className="card-content">
                    <div className="process-status">
                      <div className="to-process">To Process: {newsData.hkex.toProcess}</div>
                      <div className="processed">Processed: {newsData.hkex.processed}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'news-editor' && (
          <>
            {/* News Editor Header */}
            <div className="editor-header">
              <h1>📝 News Editor</h1>
              
              {/* Filter Controls */}
              <div className="filter-controls">
                <div className="filter-row">
                  <div className="filter-group">
                    <label>📅 Time Period:</label>
                    <select value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)}>
                      <option value="last-7-days">Last 7 days ▼</option>
                      <option value="last-30-days">Last 30 days</option>
                      <option value="last-90-days">Last 90 days</option>
                    </select>
                  </div>
                  
                  <div className="filter-group">
                    <label>🔍 Source:</label>
                    <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
                      <option value="all-sources">All sources ▼</option>
                      <option value="sfc">SFC</option>
                      <option value="hkma">HKMA</option>
                      <option value="sec">SEC</option>
                      <option value="hkex">HKEX</option>
                    </select>
                  </div>
                  
                  <div className="action-controls">
                    <span className="selected-count">Selected: {selectedArticles.length} items</span>
                    <button className="email-report-btn" disabled={selectedArticles.length === 0}>
                      📧 Generate Email Report
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Articles List */}
            <div className="articles-list">
              {articleData.map(article => (
                <div key={article.id} className="article-item">
                  <div className="article-header">
                    <input 
                      type="checkbox" 
                      checked={selectedArticles.includes(article.id)}
                      onChange={() => handleArticleSelection(article.id)}
                    />
                    <span className="article-source">
                      {article.icon} {article.source}
                    </span>
                    <span className="article-date">
                      {article.date} | {article.time}
                    </span>
                  </div>
                  
                  <div className="article-content">
                    <div className="article-field">
                      <label>Title:</label>
                      <div className="editable-field">
                        <input 
                          type="text" 
                          value={isArticleInEditMode(article.id) ? (editValues[article.id]?.title || '') : article.title}
                          onChange={(e) => updateEditValue(article.id, 'title', e.target.value)}
                          readOnly={!isArticleInEditMode(article.id)}
                          className={isArticleInEditMode(article.id) ? 'editable' : 'readonly'}
                        />
                      </div>
                    </div>
                    
                    <div className="article-field">
                      <label>AI Summary:</label>
                      <div className="editable-field">
                        <textarea 
                          value={isArticleInEditMode(article.id) ? (editValues[article.id]?.aiSummary || '') : article.aiSummary}
                          onChange={(e) => updateEditValue(article.id, 'aiSummary', e.target.value)}
                          readOnly={!isArticleInEditMode(article.id)}
                          rows={2}
                          className={isArticleInEditMode(article.id) ? 'editable' : 'readonly'}
                        />
                      </div>
                    </div>
                    
                    <div className="article-actions" style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px',
                      marginTop: '16px'
                    }}>
                      <div className="verification-section">
                        <div className="relative inline-block text-left">
                          {/* Button Group */}
                          <div className="inline-flex divide-x divide-gray-300 rounded-md shadow-sm status-button-group">
                            {/* Status Display Button */}
                            <div className={`relative inline-flex items-center px-3 py-2 rounded-l-md border text-sm font-medium status-display ${
                              getArticleStatus(article.id) === 'pending' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                              getArticleStatus(article.id) === 'verified' ? 'bg-green-50 border-green-200 text-green-800' :
                              'bg-red-50 border-red-200 text-red-800'
                            }`}>
                              <span className="text-base status-icon">{getStatusDisplay(getArticleStatus(article.id)).icon}</span>
                              <span className="ml-2 font-medium">{getStatusDisplay(getArticleStatus(article.id)).label}</span>
                            </div>
                            
                            {/* Dropdown Toggle Button */}
                            <button
                              type="button"
                              onClick={() => toggleDropdown(article.id)}
                              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                getArticleStatus(article.id) === 'pending' ? 'bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100' :
                                getArticleStatus(article.id) === 'verified' ? 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100' :
                                'bg-red-50 border-red-200 text-red-800 hover:bg-red-100'
                              }`}
                            >
                              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                          
                          {/* Dropdown Menu */}
                          {openDropdowns.includes(article.id) && (
                            <div className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              <div className="py-1" role="menu">
                                <button
                                  onClick={() => setArticleStatusAndCloseDropdown(article.id, 'pending')}
                                  className={`group flex w-full items-center px-4 py-2 text-sm hover:bg-gray-100 ${
                                    getArticleStatus(article.id) === 'pending' ? 'bg-yellow-50 text-yellow-900' : 'text-gray-700'
                                  }`}
                                  role="menuitem"
                                >
                                  <span className="text-base mr-3">⏳</span>
                                  Pending
                                  {getArticleStatus(article.id) === 'pending' && (
                                    <svg className="ml-auto h-4 w-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </button>
                                <button
                                  onClick={() => setArticleStatusAndCloseDropdown(article.id, 'verified')}
                                  className={`group flex w-full items-center px-4 py-2 text-sm hover:bg-gray-100 ${
                                    getArticleStatus(article.id) === 'verified' ? 'bg-green-50 text-green-900' : 'text-gray-700'
                                  }`}
                                  role="menuitem"
                                >
                                  <span className="text-base mr-3">✅</span>
                                  Verified
                                  {getArticleStatus(article.id) === 'verified' && (
                                    <svg className="ml-auto h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </button>
                                <button
                                  onClick={() => setArticleStatusAndCloseDropdown(article.id, 'discarded')}
                                  className={`group flex w-full items-center px-4 py-2 text-sm hover:bg-gray-100 ${
                                    getArticleStatus(article.id) === 'discarded' ? 'bg-red-50 text-red-900' : 'text-gray-700'
                                  }`}
                                  role="menuitem"
                                >
                                  <span className="text-base mr-3">❌</span>
                                  Discarded
                                  {getArticleStatus(article.id) === 'discarded' && (
                                    <svg className="ml-auto h-4 w-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <button 
                        className="link-btn"
                        style={{
                          minWidth: '120px',
                          padding: '8px 16px',
                          backgroundColor: '#6b7280',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'background-color 0.2s',
                          textDecoration: 'none'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#4b5563'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#6b7280'
                        }}
                      >
                        🔗 View Original
                      </button>
                      <button 
                        className="edit-save-btn"
                        onClick={() => toggleEditMode(article.id)}
                        title={isArticleInEditMode(article.id) ? 'Save changes' : 'Edit article'}
                        style={{
                          minWidth: '80px',
                          padding: '8px 16px',
                          backgroundColor: isArticleInEditMode(article.id) ? '#10b981' : '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = isArticleInEditMode(article.id) ? '#059669' : '#2563eb'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = isArticleInEditMode(article.id) ? '#10b981' : '#3b82f6'
                        }}
                      >
                        <span>{isArticleInEditMode(article.id) ? '💾' : '✏️'}</span>
                        {isArticleInEditMode(article.id) ? 'Save' : 'Edit'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>


          </>
        )}
      </div>
    </div>
  )
}

export default App
