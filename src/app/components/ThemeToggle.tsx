/**
 * AI Symptom Checker - Theme Toggle Component
 * 
 * @author Fazilkhan Malek
 * @created 2026
 * @license MIT with Attribution
 * @description Component for switching between light and dark themes
 */

'use client';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../app/contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-blue-100 dark:border-gray-700 hover:scale-105 transition-all"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-blue-600" />
      ) : (
        <Sun className="w-5 h-5 text-yellow-500" />
      )}
    </button>
  );
}
