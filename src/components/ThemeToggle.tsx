import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from "@/components/ui/button";
import { SunIcon, MoonIcon } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // After mounting, we can safely show the toggle
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Button variant="ghost" size="icon" className="rounded-full w-9 h-9" />;
  }

  const toggleTheme = () => {
    const currentTheme = theme === 'system' ? resolvedTheme : theme;
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };

  const currentTheme = theme === 'system' ? resolvedTheme : theme;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="rounded-full w-9 h-9"
    >
      {currentTheme === 'dark' ? (
        <SunIcon className="h-5 w-5 text-yellow-400" />
      ) : (
        <MoonIcon className="h-5 w-5 text-slate-700" />
      )}
    </Button>
  );
};

export default ThemeToggle; 