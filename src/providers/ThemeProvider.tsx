import { createContext, useContext, useEffect, useState } from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: string
  storageKey?: string
}

// This helper component ensures the "dark" class is applied to the <html> element
// when the theme changes
const ThemeScript = () => {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              const key = localStorage.getItem('symp-to-care-theme');
              if (!key) return;
              const theme = JSON.parse(key);
              const isDark = theme === 'dark' || 
                (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
              if (isDark) document.documentElement.classList.add('dark');
            } catch (e) {}
          })();
        `,
      }}
    />
  );
};

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'symp-to-care-theme',
  ...props
}: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Handle system theme changes
    const handleChange = () => {
      if (localStorage.getItem(storageKey) === '"system"') {
        if (mediaQuery.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    // Add listener for system theme changes
    mediaQuery.addEventListener('change', handleChange);
    
    // Clean up
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [storageKey]);

  if (!mounted) {
    // Return a placeholder with the same structure but no content
    // to prevent layout shift when the theme is applied
    return (
      <>
        <ThemeScript />
        {children}
      </>
    )
  }

  return (
    <NextThemesProvider
      defaultTheme={defaultTheme}
      storageKey={storageKey}
      enableSystem
      attribute="class"
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}

export default ThemeProvider 