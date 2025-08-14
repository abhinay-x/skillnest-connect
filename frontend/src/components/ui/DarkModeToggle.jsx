import React, { useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme, THEMES } from '../../context/ThemeContext.jsx';

const DarkModeToggle = () => {
  const { theme, actualTheme, changeTheme, toggleTheme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const themeOptions = [
    { value: THEMES.LIGHT, icon: Sun, label: 'Light' },
    { value: THEMES.DARK, icon: Moon, label: 'Dark' },
    { value: THEMES.SYSTEM, icon: Monitor, label: 'System' }
  ];

  const currentThemeOption = themeOptions.find(option => option.value === theme) || themeOptions[0];
  const CurrentIcon = currentThemeOption.icon;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expanded Menu */}
      {isExpanded && (
        <div className="absolute bottom-16 right-0 mb-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 min-w-[120px]">
            {themeOptions.map((option) => {
              const Icon = option.icon;
              const isActive = theme === option.value;
              
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    changeTheme(option.value);
                    setIsExpanded(false);
                  }}
                  className={`w-full flex items-center px-4 py-2 text-sm transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {option.label}
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Toggle Button */}
      <div className="relative">
        {/* Quick Toggle (Click) */}
        <button
          onClick={toggleTheme}
          onContextMenu={(e) => {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }}
          className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 active:scale-95 ${
            actualTheme === THEMES.DARK
              ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          } border border-gray-200 dark:border-gray-600`}
          title={`Current: ${currentThemeOption.label} theme (Right-click for options)`}
        >
          <CurrentIcon className="w-6 h-6 mx-auto" />
        </button>

        {/* Options Button (Small) */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`absolute -top-2 -right-2 w-6 h-6 rounded-full shadow-md transition-all duration-200 ${
            actualTheme === THEMES.DARK
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          } border border-gray-300 dark:border-gray-500`}
          title="Theme options"
        >
          <div className="flex items-center justify-center">
            <div className={`w-1 h-1 rounded-full bg-current transform transition-transform duration-200 ${
              isExpanded ? 'rotate-45' : ''
            }`}></div>
            <div className={`w-1 h-1 rounded-full bg-current ml-0.5 transform transition-transform duration-200 ${
              isExpanded ? '-rotate-45' : ''
            }`}></div>
          </div>
        </button>

        {/* Theme Indicator Ring */}
        <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
          actualTheme === THEMES.DARK
            ? 'ring-2 ring-blue-400/30'
            : 'ring-2 ring-blue-500/30'
        } ${isExpanded ? 'ring-4' : ''}`}></div>
      </div>

      {/* Click Outside Handler */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};

export default DarkModeToggle;
