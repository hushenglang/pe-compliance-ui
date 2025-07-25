import { Sidebar, NewsSummary, NewsEditor, LoadingSpinner, NotificationContainer, EmailReportModal } from './components'
import { useAppState } from './hooks/useAppState'
import { apiService } from './services/api'
import { useState } from 'react'
import './App.css'

function App() {
  const {
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
    
    // Actions
    handleArticleSelection,
    toggleDropdown,
    setArticleStatusAndCloseDropdown,
    toggleEditMode,
    updateEditValue,
    isArticleStatusLoading,
    isContentUpdateLoading,
    isStatusUpdateAllowed,
    dismissNotification
  } = useAppState()

  // Email report modal state
  const [emailModalState, setEmailModalState] = useState({
    isOpen: false,
    loading: false,
    htmlContent: '',
    error: ''
  })

  const handleGenerateReport = async () => {
    if (selectedArticles.length === 0) {
      alert('Please select at least one article to generate a report.')
      return
    }

    // Convert string IDs to numbers for the API
    const newsIds = selectedArticles.map(id => parseInt(id, 10))

    setEmailModalState({
      isOpen: true,
      loading: true,
      htmlContent: '',
      error: ''
    })

    try {
      const htmlContent = await apiService.getHtmlEmailByIds(newsIds)
      setEmailModalState(prev => ({
        ...prev,
        loading: false,
        htmlContent
      }))
    } catch (error) {
      console.error('Error generating email report:', error)
      setEmailModalState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to generate email report'
      }))
    }
  }

  const closeEmailModal = () => {
    setEmailModalState({
      isOpen: false,
      loading: false,
      htmlContent: '',
      error: ''
    })
  }

  return (
    <div className="app-container">
      <Sidebar 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className={`main-content ${activeTab === 'news-editor' ? 'editor-mode' : ''}`}>
        {activeTab === 'news-summary' ? (
          <NewsSummary />
        ) : (
          <>
            {/* Show error banner if there's an error */}
            {error && (
              <div className="error-banner" style={{ 
                marginBottom: '16px',
                padding: '12px 16px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span className="error-message" style={{ color: '#dc2626' }}>
                  ⚠️ {error}
                </span>
                <button 
                  onClick={refetch} 
                  className="retry-button"
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  🔄 Retry
                </button>
              </div>
            )}
            
            {/* Show loading spinner or news editor */}
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                <LoadingSpinner />
              </div>
            ) : (
              <NewsEditor
                dateRange={dateRange}
                sourceFilter={sourceFilter}
                statusFilter={statusFilter}
                selectedArticles={selectedArticles}
                articles={articleData}
                articleStatus={articleStatus}
                openDropdowns={openDropdowns}
                editingArticles={editingArticles}
                editValues={editValues}
                filterLoading={filterLoading}
                isArticleStatusLoading={isArticleStatusLoading}
                isContentUpdateLoading={isContentUpdateLoading}
                isStatusUpdateAllowed={isStatusUpdateAllowed}
                onDateRangeChange={setDateRange}
                onSourceFilterChange={setSourceFilter}
                onStatusFilterChange={setStatusFilter}
                onArticleSelection={handleArticleSelection}
                onStatusToggle={toggleDropdown}
                onStatusChange={setArticleStatusAndCloseDropdown}
                onEditToggle={toggleEditMode}
                onEditValueChange={updateEditValue}
                onGenerateReport={handleGenerateReport}
              />
            )}
          </>
        )}
      </div>

      {/* Status Update Notifications */}
      <NotificationContainer 
        notifications={notifications}
        onDismiss={dismissNotification}
      />

      {/* Email Report Modal */}
      <EmailReportModal
        isOpen={emailModalState.isOpen}
        onClose={closeEmailModal}
        htmlContent={emailModalState.htmlContent}
        selectedCount={selectedArticles.length}
        isLoading={emailModalState.loading}
        error={emailModalState.error}
      />
    </div>
  )
}

export default App
