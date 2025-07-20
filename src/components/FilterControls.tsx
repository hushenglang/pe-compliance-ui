import type { DateRange, SourceFilter } from '../types'

interface FilterControlsProps {
  dateRange: DateRange
  sourceFilter: SourceFilter
  selectedCount: number
  onDateRangeChange: (dateRange: DateRange) => void
  onSourceFilterChange: (filter: SourceFilter) => void
  onGenerateReport: () => void
}

export const FilterControls = ({
  dateRange,
  sourceFilter,
  selectedCount,
  onDateRangeChange,
  onSourceFilterChange,
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
            <option value="all-sources">All</option>
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