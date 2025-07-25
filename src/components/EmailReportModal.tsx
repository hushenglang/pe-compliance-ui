import React, { useEffect, useState } from 'react'

interface EmailReportModalProps {
  isOpen: boolean
  onClose: () => void
  htmlContent: string
  selectedCount: number
  isLoading: boolean
  error?: string
}

export const EmailReportModal: React.FC<EmailReportModalProps> = ({
  isOpen,
  onClose,
  htmlContent,
  selectedCount,
  isLoading,
  error
}) => {
  const [copyStatus, setCopyStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  // Close modal with Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open and reset copy status
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      setCopyStatus(null) // Reset copy status when modal closes
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(htmlContent)
      setCopyStatus({ message: 'Copied!', type: 'success' })
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
      setCopyStatus({ message: 'Copy failed', type: 'error' })
    }

    // Auto-hide the status message after 2 seconds
    setTimeout(() => {
      setCopyStatus(null)
    }, 2000)
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="email-modal">
        <div className="email-modal-header">
          <h2>Email Report</h2>
          <button 
            className="close-button"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        
        <div className="email-modal-content">
          {isLoading ? (
            <div className="email-modal-loading">
              <div className="spinner"></div>
              <p>Generating email report for {selectedCount} selected articles...</p>
            </div>
          ) : error ? (
            <div className="email-modal-error">
              <h3>Error</h3>
              <p>{error}</p>
            </div>
          ) : (
            <>
              <div className="email-content-wrapper">
                <div className="email-content-preview">
                  <div 
                    className="email-preview"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="email-modal-footer">
          <div className="copy-section">
            <button 
              className="copy-button"
              onClick={handleCopyToClipboard}
              title="Copy HTML content to clipboard"
            >
              Copy
            </button>
            {copyStatus && (
              <span className={`copy-status ${copyStatus.type}`}>
                {copyStatus.message}
              </span>
            )}
          </div>
          <button className="cancel-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
} 