/**
 * AI Symptom Checker - Root Layout Component
 * 
 * @author Fazilkhan Malek
 * @created 2026
 * @license MIT with Attribution
 * @description Main layout wrapper for the entire application
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '../app/contexts/LanguageContext';
import { ThemeProvider } from '../app/contexts/ThemeContext';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Symptom Checker',
  description: 'Analyze your symptoms with AI-powered insights',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
