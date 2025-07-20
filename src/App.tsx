import { Sidebar, NewsSummary, NewsEditor, LoadingSpinner } from './components'
import { useAppState } from './hooks/useAppState'
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
    updateEditValue
  } = useAppState()

  const handleGenerateReport = () => {
    // TODO: Implement email report generation
    console.log('Generating report for articles:', selectedArticles)
    alert(`Generating email report for ${selectedArticles.length} selected articles`)
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
    </div>
  )
}

export default App
