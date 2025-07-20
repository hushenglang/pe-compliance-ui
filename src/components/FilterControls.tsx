import type { DateRange, SourceFilter, StatusFilter } from '../types'

interface FilterControlsProps {
  dateRange: DateRange
  sourceFilter: SourceFilter
  statusFilter: StatusFilter
  selectedCount: number
  totalCount: number
  onDateRangeChange: (dateRange: DateRange) => void
  onSourceFilterChange: (filter: SourceFilter) => void
  onStatusFilterChange: (filter: StatusFilter) => void
  onGenerateReport: () => void
}

export const FilterControls = ({
  dateRange,
  sourceFilter,
  statusFilter,
  selectedCount,
  totalCount,
  onDateRangeChange,
  onSourceFilterChange,
  onStatusFilterChange,
  onGenerateReport
}: FilterControlsProps) => {
  const handleStartDateChange = (value: string) => {
    // If start date is after end date, adjust end date to be same as start date
    const newEndDate = value > dateRange.endDate ? value : dateRange.endDate
    
    onDateRangeChange({
      startDate: value,
      endDate: newEndDate
    })
  }

  const handleEndDateChange = (value: string) => {
    // If end date is before start date, adjust start date to be same as end date
    const newStartDate = value < dateRange.startDate ? value : dateRange.startDate
    
    onDateRangeChange({
      startDate: newStartDate,
      endDate: value
    })
  }

  return (
    <div className="filter-controls">
      <div className="filter-row">
        <div className="filter-group">
          <div className="date-range-inputs">
            <input 
              id="start-date"
              type="date" 
              value={dateRange.startDate} 
              max={dateRange.endDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              className="date-input"
            />
            <input 
              id="end-date"
              type="date" 
              value={dateRange.endDate} 
              min={dateRange.startDate}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => handleEndDateChange(e.target.value)}
              className="date-input"
            />
          </div>
        </div>
        
        <div className="filter-group">
          <select 
            value={sourceFilter} 
            onChange={(e) => onSourceFilterChange(e.target.value as SourceFilter)}
          >
            <option value="all-sources">All Sources</option>
            <option value="sfc">SFC</option>
            <option value="hkma">HKMA</option>
            <option value="sec">SEC</option>
            <option value="hkex">HKEX</option>
          </select>
        </div>
        
        <div className="filter-group">
          <select 
            value={statusFilter} 
            onChange={(e) => onStatusFilterChange(e.target.value as StatusFilter)}
          >
            <option value="all-statuses">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="discarded">Discarded</option>
          </select>
        </div>
        
        <div className="action-controls">
          <span className="selected-count">Selected: {selectedCount} of {totalCount} items</span>
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