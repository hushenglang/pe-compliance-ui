import type { TabType } from '../../types'
import styles from './Sidebar.module.css'

interface SidebarProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h2>📊 PE Compliance</h2>
      </div>
      <nav className={styles.nav}>
        <button 
          className={`${styles.navItem} ${activeTab === 'news-summary' ? styles.active : ''}`}
          onClick={() => onTabChange('news-summary')}
        >
          <span className={styles.navIcon}>📊</span>
          <span className={styles.navText}>News Summary</span>
          {activeTab === 'news-summary' && <span className={styles.navIndicator}>📍</span>}
        </button>
        <button 
          className={`${styles.navItem} ${activeTab === 'news-editor' ? styles.active : ''}`}
          onClick={() => onTabChange('news-editor')}
        >
          <span className={styles.navIcon}>📝</span>
          <span className={styles.navText}>News Editor</span>
          {activeTab === 'news-editor' && <span className={styles.navIndicator}>📍</span>}
        </button>
      </nav>
    </div>
  )
} 