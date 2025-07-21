interface EditableFieldProps {
  id: string
  label: string
  value: string
  editValue?: string
  isInEditMode: boolean
  isTextArea?: boolean
  rows?: number
  onChange: (value: string) => void
  placeholder?: string
  // New checkbox props
  showCheckbox?: boolean
  isChecked?: boolean
  onCheckboxChange?: () => void
  checkboxAriaLabel?: string
}

export const EditableField = ({
  id,
  label,
  value,
  editValue,
  isInEditMode,
  isTextArea = false,
  rows = 3,
  onChange,
  placeholder,
  showCheckbox = false,
  isChecked = false,
  onCheckboxChange,
  checkboxAriaLabel
}: EditableFieldProps) => {
  const displayValue = isInEditMode ? (editValue || '') : value
  
  return (
    <div className="article-field">
      <div className="label-with-checkbox">
        {showCheckbox && (
          <input 
            type="checkbox" 
            checked={isChecked}
            onChange={onCheckboxChange}
            aria-label={checkboxAriaLabel}
            style={{
              width: '1.25rem',
              height: '1.25rem',
              cursor: 'pointer',
              marginRight: '0.5rem'
            }}
          />
        )}
        <label htmlFor={id}>{label}:</label>
      </div>
      <div className="editable-field">
        {isTextArea ? (
          <textarea 
            id={id}
            value={displayValue}
            onChange={(e) => onChange(e.target.value)}
            readOnly={!isInEditMode}
            rows={rows}
            className={isInEditMode ? 'editable' : 'readonly'}
            aria-label={label}
            placeholder={placeholder}
          />
        ) : (
          <input 
            id={id}
            type="text" 
            value={displayValue}
            onChange={(e) => onChange(e.target.value)}
            readOnly={!isInEditMode}
            className={isInEditMode ? 'editable' : 'readonly'}
            aria-label={label}
            placeholder={placeholder}
          />
        )}
      </div>
    </div>
  )
} 