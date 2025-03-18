"use client";
import React, { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Loader from '../components/Loader';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import type { ChatGroup } from '@/types';

interface LayoutProps {
  children: ReactNode;
  setSelectedChat?: (chat: ChatGroup | null) => void;
}

interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, setSelectedChat }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const isMainPage = pathname === "/MainPage";

  // DEMO: Load mock notifications instead of fetching from API
  useEffect(() => {
    // Mock notifications data
    const mockNotifications: Notification[] = [
      {
        id: '1',
        message: 'New movie recommendation: "Dune: Part Two" based on your watchlist!',
        read: false,
        createdAt: new Date(Date.now() - 20 * 60000).toISOString() // 20 minutes ago
      },
      {
        id: '2',
        message: 'Your friend Alex just shared "Oppenheimer" with you',
        read: false,
        createdAt: new Date(Date.now() - 3 * 3600000).toISOString() // 3 hours ago
      },
      {
        id: '3',
        message: '"The Batman" that you added to your watchlist is now available on Netflix',
        read: true,
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString() // 2 days ago
      },
      {
        id: '4',
        message: 'Weekly movie night suggestion: "Everything Everywhere All at Once"',
        read: true,
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString() // 5 days ago
      }
    ];
    
    setNotifications(mockNotifications);
    
    // Count unread notifications
    const unread = mockNotifications.filter(notif => !notif.read).length;
    setUnreadCount(unread);
    
    // In a real implementation, you would fetch from API
  }, []);

  const handleNotificationClick = async () => {
    if (!showNotifications) {
      // Mark all as read when opening notifications
      setNotifications(notifications.map(notif => ({ ...notif, read: true })));
      setUnreadCount(0);
    }
    
    // Toggle notifications panel
    setShowNotifications(!showNotifications);
  };

  const handleDismissNotification = async (id: string) => {
    // Remove from local state
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const handleNavigation = (path: string) => {
    setIsLoading(true);
    router.push(path);
  };

  // This effect will run when page changes are complete
  React.useEffect(() => {
    const handleRouteComplete = () => {
      setIsLoading(false);
    };

    window.addEventListener('load', handleRouteComplete);

    return () => {
      window.removeEventListener('load', handleRouteComplete);
    };
  }, []);

  // Custom Link component with loading behavior
  const NavLink = ({ href, children, className }: { href: string; children: ReactNode; className?: string }) => (
    <span
      onClick={() => handleNavigation(href)}
      className={`cursor-pointer ${className || ''}`}
    >
      {children}
    </span>
  );

  return (
    <div className="min-h-screen flex flex-col !bg-gray-900 text-gray-100 text-base">
      {/* Full-screen loader with fixed positioning */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-70">
          <Loader />
        </div>
      )}
      
      <nav className="bg-gray bg-opacity-80 backdrop-filter backdrop-blur-md border-b border-indigo-900/30 shadow-lg shadow-indigo-500/20 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="hidden md:flex space-x-4">
                <NavLink href="/" className="hover:text-gray-300 transition">Home</NavLink>
                <NavLink href="/Discover" className="hover:text-gray-300 transition">Discover</NavLink>
                <NavLink href="/Trending" className="hover:text-gray-300 transition">Trending</NavLink>
              </div>
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center mr-24">
              {/* Replace this with conditional rendering based on current route */}
              {pathname === "/MainPage" ? (
                <div 
                  className="flex items-center cursor-pointer" 
                  onClick={() => setSelectedChat?.(null)}
                >
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
                </div>
              ) : (
                <NavLink href="/MainPage" className="flex items-center">
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
                </NavLink>
              )}
            </div>
            <div className="flex items-center space-x-4 pl-15">
              <NavLink href="/Personal" className="flex items-center hover:text-indigo-300 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 2H15M9 2a2 2 0 00-2 2v16a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2M9 2h6M9 12h6M9 16h3" />
                </svg>
                <span className="hidden md:inline">Personal Tracker</span>
              </NavLink>
              <NavLink href="/WatchList" className="flex items-center hover:text-indigo-300 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span className="hidden md:inline">Watchlist</span>
              </NavLink>
              
              <NavLink href="/UserProfile" className="px-2">
  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center ring-2 ring-purple-500 ring-offset-2 ring-offset-black cursor-pointer hover:opacity-80 transition">
    <User className="h-5 w-5 text-white" />
  </div>
</NavLink>

{/* Notification Button */}
<div className="relative px-2">
  <button 
    onClick={handleNotificationClick}
    className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center ring-2 ring-purple-500 ring-offset-2 ring-offset-black cursor-pointer hover:opacity-80 transition"
  >
    <Bell className="h-5 w-5 text-white" />
    {unreadCount > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
        {unreadCount > 9 ? '9+' : unreadCount}
      </span>
    )}
  </button>
</div>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Notifications Panel - Now aligned to the right side */}
      {showNotifications && (
        <div className="fixed right-0 top-16 z-30 p-4 max-h-96 overflow-y-auto bg-transparent">
          <div className="flex flex-col gap-4">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div key={notification.id} className="flex flex-col gap-2 w-60 sm:w-72 text-[10px] sm:text-xs">
                  <div className="info-alert cursor-default flex items-center justify-between w-full h-auto min-h-14 rounded-lg bg-[#232531] px-[10px] py-2">
                    <div className="flex gap-2">
                      <div className="text-[#1c56be] bg-white/5 backdrop-blur-xl p-1 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-6 h-6 shadow-[#1c569e]">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-white">{notification.message}</p>
                        <p className="text-gray-500 text-[8px] sm:text-[10px]">
                          {new Date(notification.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}, {new Date(notification.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button 
                      className="text-gray-600 hover:bg-white/10 p-1 rounded-md transition-colors ease-linear"
                      onClick={() => handleDismissNotification(notification.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 bg-[#232531] rounded-lg px-4">No notifications</div>
            )}
          </div>
        </div>
      )}
      
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