import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or default to system
    const savedTheme = localStorage.getItem('skillnest-theme');
    return savedTheme || THEMES.SYSTEM;
  });

  const [actualTheme, setActualTheme] = useState(THEMES.LIGHT);

  // System theme detection
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e) => {
      if (theme === THEMES.SYSTEM) {
        setActualTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
      }
    };

    // Set initial theme
    if (theme === THEMES.SYSTEM) {
      setActualTheme(mediaQuery.matches ? THEMES.DARK : THEMES.LIGHT);
    } else {
      setActualTheme(theme);
    }

    // Listen for system theme changes
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Add current theme class
    root.classList.add(actualTheme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content', 
        actualTheme === THEMES.DARK ? '#1f2937' : '#ffffff'
      );
    }
  }, [actualTheme]);

  // Change theme
  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('skillnest-theme', newTheme);
    
    if (newTheme !== THEMES.SYSTEM) {
      setActualTheme(newTheme);
    } else {
      // If switching to system, detect current system preference
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setActualTheme(mediaQuery.matches ? THEMES.DARK : THEMES.LIGHT);
    }
  };

  // Toggle between light and dark (ignores system)
  const toggleTheme = () => {
    const newTheme = actualTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
    changeTheme(newTheme);
  };

  // Get theme-specific values
  const getThemeValue = (lightValue, darkValue) => {
    return actualTheme === THEMES.DARK ? darkValue : lightValue;
  };

  // Theme-specific colors
  const colors = {
    primary: getThemeValue('#3b82f6', '#60a5fa'),
    secondary: getThemeValue('#6b7280', '#9ca3af'),
    background: getThemeValue('#ffffff', '#1f2937'),
    surface: getThemeValue('#f9fafb', '#374151'),
    text: getThemeValue('#111827', '#f9fafb'),
    textSecondary: getThemeValue('#6b7280', '#d1d5db'),
    border: getThemeValue('#e5e7eb', '#4b5563'),
    success: getThemeValue('#10b981', '#34d399'),
    warning: getThemeValue('#f59e0b', '#fbbf24'),
    error: getThemeValue('#ef4444', '#f87171'),
    info: getThemeValue('#3b82f6', '#60a5fa')
  };

  // Check if current theme is dark
  const isDark = actualTheme === THEMES.DARK;
  
  // Check if current theme is light
  const isLight = actualTheme === THEMES.LIGHT;
  
  // Check if using system theme
  const isSystem = theme === THEMES.SYSTEM;

  const value = {
    // Current theme states
    theme, // User selected theme (light/dark/system)
    actualTheme, // Actual applied theme (light/dark)
    isDark,
    isLight,
    isSystem,
    
    // Theme methods
    changeTheme,
    toggleTheme,
    getThemeValue,
    
    // Theme values
    colors,
    
    // Theme constants
    THEMES
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
