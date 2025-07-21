import type { StatusNotification } from '../types'

interface NotificationContainerProps {
  notifications: StatusNotification[]
  onDismiss: (notificationId: string) => void
}

export const NotificationContainer = ({ notifications, onDismiss }: NotificationContainerProps) => {
  if (notifications.length === 0) {
    return null
  }

  return (
    <div className="notification-container" style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      maxWidth: '400px'
    }}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification ${notification.type}`}
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid',
            backgroundColor: notification.type === 'success' ? '#f0f9ff' : '#fef2f2',
            borderColor: notification.type === 'success' ? '#bae6fd' : '#fecaca',
            color: notification.type === 'success' ? '#0c4a6e' : '#dc2626',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minWidth: '300px',
            animation: 'slideInRight 0.3s ease-out'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>
              {notification.type === 'success' ? '✅' : '❌'}
            </span>
            <span style={{ fontSize: '14px', fontWeight: '500' }}>
              {notification.message}
            </span>
          </div>
          <button
            onClick={() => onDismiss(notification.id)}
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.7,
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.7' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
            </svg>
          </button>
        </div>
      ))}
      
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
} 