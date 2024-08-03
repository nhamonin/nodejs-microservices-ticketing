import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from './components/Header';
import { AuthProvider } from './context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Ticketing App',
  description: 'Ticketing App',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          <main className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-700">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
