import { Sidebar, NewsSummary, NewsEditor } from './components'
import { useAppState } from './hooks/useAppState'
import './App.css'

function App() {
  const {
    // State
    activeTab,
    dateRange,
    sourceFilter,
    selectedArticles,
    articleStatus,
    openDropdowns,
    editingArticles,
    editValues,
    articleData,
    
    // Setters
    setActiveTab,
    setDateRange,
    setSourceFilter,
    
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
          <NewsEditor
            dateRange={dateRange}
            sourceFilter={sourceFilter}
            selectedArticles={selectedArticles}
            articles={articleData}
            articleStatus={articleStatus}
            openDropdowns={openDropdowns}
            editingArticles={editingArticles}
            editValues={editValues}
            onDateRangeChange={setDateRange}
            onSourceFilterChange={setSourceFilter}
            onArticleSelection={handleArticleSelection}
            onStatusToggle={toggleDropdown}
            onStatusChange={setArticleStatusAndCloseDropdown}
            onEditToggle={toggleEditMode}
            onEditValueChange={updateEditValue}
            onGenerateReport={handleGenerateReport}
          />
        )}
      </div>
    </div>
  )
}

export default App
