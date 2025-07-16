import type { TimePeriod, SourceFilter } from '../types'

interface FilterControlsProps {
  timePeriod: TimePeriod
  sourceFilter: SourceFilter
  selectedCount: number
  onTimePeriodChange: (period: TimePeriod) => void
  onSourceFilterChange: (filter: SourceFilter) => void
  onGenerateReport: () => void
}

export const FilterControls = ({
  timePeriod,
  sourceFilter,
  selectedCount,
  onTimePeriodChange,
  onSourceFilterChange,
  onGenerateReport
}: FilterControlsProps) => {
  return (
    <div className="filter-controls">
      <div className="filter-row">
        <div className="filter-group">
          <label>📅 Time Period:</label>
          <select 
            value={timePeriod} 
            onChange={(e) => onTimePeriodChange(e.target.value as TimePeriod)}
          >
            <option value="last-7-days">Last 7 days ▼</option>
            <option value="last-30-days">Last 30 days</option>
            <option value="last-90-days">Last 90 days</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>🔍 Source:</label>
          <select 
            value={sourceFilter} 
            onChange={(e) => onSourceFilterChange(e.target.value as SourceFilter)}
          >
            <option value="all-sources">All sources ▼</option>
            <option value="sfc">SFC</option>
            <option value="hkma">HKMA</option>
            <option value="sec">SEC</option>
            <option value="hkex">HKEX</option>
          </select>
        </div>
        
        <div className="action-controls">
          <span className="selected-count">Selected: {selectedCount} items</span>
          <button 
            className="email-report-btn" 
            disabled={selectedCount === 0}
            onClick={onGenerateReport}
          >
            📧 Generate Email Report
          </button>
        </div>
      </div>
    </div>
  )
} 