import { useEffect } from 'react';
import { useTheme } from 'next-themes';

/**
 * This component listens for theme changes and applies the appropriate
 * class to the documentElement. This ensures the dark mode works properly.
 */
const ThemeListener = () => {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (resolvedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [resolvedTheme]);

  return null;
};

export default ThemeListener; 