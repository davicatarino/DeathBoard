"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Função para verificar se um link está ativo
  const isActive = (path) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-50 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
      <div className="container-responsive">
        <div className="flex justify-between items-center py-4">
          {/* Logo e nome do app */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center group">
              <div className="relative">
                <svg 
                  className="h-10 w-10 text-primary-600 dark:text-primary-400 transition-transform group-hover:scale-110" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                  />
                </svg>
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-success-500 rounded-full animate-pulse"></div>
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent">
                Death Board
              </span>
            </Link>
          </div>

          {/* Links de navegação */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              href="/vendedores" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                isActive('/vendedores') 
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
              }`}
            >
              Vendedores
            </Link>
            <Link 
              href="/sdrs" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                isActive('/sdrs') 
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
              }`}
            >
              SDRs
            </Link>
            <Link 
              href="/vendas" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                isActive('/vendas') 
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
              }`}
            >
              Vendas
            </Link>
            <Link 
              href="/reunioes" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                isActive('/reunioes') 
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
              }`}
            >
              Reuniões
            </Link>
            <Link 
              href="/ranking" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                isActive('/ranking') 
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
              }`}
            >
              Ranking
            </Link>
          </div>

          {/* Toggle de tema e menu mobile */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {/* Menu mobile (hamburger) */}
            <button 
              className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <svg 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile (dropdown) */}
      <div className={`md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-all duration-300 ${
        isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="container-responsive py-4 space-y-2">
          <Link 
            href="/vendedores" 
            className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive('/vendedores') 
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Vendedores
          </Link>
          <Link 
            href="/sdrs" 
            className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive('/sdrs') 
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            SDRs
          </Link>
          <Link 
            href="/vendas" 
            className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive('/vendas') 
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Vendas
          </Link>
          <Link 
            href="/reunioes" 
            className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive('/reunioes') 
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Reuniões
          </Link>
          <Link 
            href="/ranking" 
            className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive('/ranking') 
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Ranking
          </Link>
        </div>
      </div>
    </nav>
  );
}
