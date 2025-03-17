"use client";
import React, { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col !bg-gray-900 text-gray-100 text-base">
      <nav className="bg-gray bg-opacity-80 backdrop-filter backdrop-blur-md border-b border-indigo-900/30 shadow-lg shadow-indigo-500/20 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="hidden md:flex space-x-4">
                <Link href="/" className="hover:text-gray-300 transition">Home</Link>
                <Link href="/Discover" className="hover:text-gray-300 transition">Discover</Link>
                <Link href="/Trending" className="hover:text-gray-300 transition">Trending</Link>
              </div>
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
              <Link href="/MainPage" className="flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                  CineGenie
                </span>
                <Image 
                  src="/cinegenie logo.png" 
                  alt="CineGenie Logo" 
                  width={40} 
                  height={40} 
                  priority
                />
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/Personal" className="flex items-center hover:text-indigo-300 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 2H15M9 2a2 2 0 00-2 2v16a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2M9 2h6M9 12h6M9 16h3" />
                </svg>
                <span className="hidden md:inline">Personal Tracker</span>
              </Link>
              <Link href="/WatchList" className="flex items-center hover:text-indigo-300 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span className="hidden md:inline">Watchlist</span>
              </Link>
              <Link href="/Profile">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center ring-2 ring-purple-500 ring-offset-2 ring-offset-black cursor-pointer hover:opacity-80 transition">
  <User className="h-5 w-5 text-white" />
</div>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main content */}
      <main className="flex-grow">
        {children}
      </main>
      
      <footer className="bg-black bg-opacity-80 py-2 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>
        <div className="container mx-auto px-4 flex justify-center items-center">
          <p className="text-sm text-gray-400">© 2025 CineGenie - For the true movie enthusiast</p>
        </div>
      </footer>
    </div>
  );
};
