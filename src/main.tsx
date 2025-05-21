import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

// Initialize dark mode right away to prevent flash
const initializeTheme = () => {
  try {
    const storedTheme = localStorage.getItem('symp-to-care-theme');
    if (!storedTheme) return;
    
    const theme = JSON.parse(storedTheme);
    const isDark = theme === 'dark' || 
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {
    console.error("Error initializing theme:", e);
  }
};

// Configure scroll behavior with special handling for Home and AI Health Assistant
const configureScrollBehavior = () => {
  // Use manual scroll restoration to have more control
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  
  // Listen for clicks on specific navigation links
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a');
    
    if (link && link instanceof HTMLAnchorElement) {
      const href = link.getAttribute('href');
      
      // If it's the home or health assistant link, force scroll to top
      if (href === '/' || href === '/health-assistant') {
        // Force immediate scroll to top
        window.scrollTo(0, 0);
        
        // Store the information that we want to scroll to top
        sessionStorage.setItem('forceScrollTop', 'true');
      }
    }
  }, true);
  
  // Check URL changes
  const checkPathChange = () => {
    const path = window.location.pathname;
    // For home or health assistant paths, ensure we're at the top
    if (path === '/' || path === '/health-assistant') {
      window.scrollTo(0, 0);
      
      // If we've stored that we need to force scroll to top, do it again after a delay
      if (sessionStorage.getItem('forceScrollTop') === 'true') {
        setTimeout(() => window.scrollTo(0, 0), 10);
        setTimeout(() => window.scrollTo(0, 0), 50);
        sessionStorage.removeItem('forceScrollTop');
      }
    }
  };
  
  // Listen for popstate events (browser back/forward)
  window.addEventListener('popstate', checkPathChange);
  
  // Initial check
  checkPathChange();
};

// Run initializations before app renders
initializeTheme();
configureScrollBehavior();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
