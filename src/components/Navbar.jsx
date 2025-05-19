"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  // Função para verificar se um link está ativo
  const isActive = (path) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo e nome do app */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center">
              <svg 
                className="h-8 w-8 text-blue-400" 
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
              <span className="ml-2 text-xl font-bold">Death Board</span>
            </Link>
          </div>

          {/* Links de navegação */}
          <div className="hidden md:flex space-x-8">
            <Link 
              href="/vendedores" 
              className={`hover:text-blue-300 transition-colors duration-200 ${
                isActive('/vendedores') ? 'text-blue-400 font-medium' : ''
              }`}
            >
              Vendedores
            </Link>
            <Link 
              href="/sdrs" 
              className={`hover:text-blue-300 transition-colors duration-200 ${
                isActive('/sdrs') ? 'text-blue-400 font-medium' : ''
              }`}
            >
              SDRs
            </Link>
            <Link 
              href="/vendas" 
              className={`hover:text-blue-300 transition-colors duration-200 ${
                isActive('/vendas') ? 'text-blue-400 font-medium' : ''
              }`}
            >
              Vendas
            </Link>
            <Link 
              href="/reunioes" 
              className={`hover:text-blue-300 transition-colors duration-200 ${
                isActive('/reunioes') ? 'text-blue-400 font-medium' : ''
              }`}
            >
              Reuniões
            </Link>
            <Link 
              href="/ranking" 
              className={`hover:text-blue-300 transition-colors duration-200 ${
                isActive('/ranking') ? 'text-blue-400 font-medium' : ''
              }`}
            >
              Ranking
            </Link>
          </div>

          {/* Menu mobile (hamburger) */}
          <div className="md:hidden">
            <button className="mobile-menu-button">
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

      {/* Menu mobile (dropdown) - Implementar lógica de toggle */}
      <div className="mobile-menu hidden md:hidden">
        <Link 
          href="/vendedores" 
          className={`block py-2 px-4 text-sm hover:bg-gray-800 ${
            isActive('/vendedores') ? 'bg-gray-800 text-blue-400' : ''
          }`}
        >
          Vendedores
        </Link>
        <Link 
          href="/sdrs" 
          className={`block py-2 px-4 text-sm hover:bg-gray-800 ${
            isActive('/sdrs') ? 'bg-gray-800 text-blue-400' : ''
          }`}
        >
          SDRs
        </Link>
        <Link 
          href="/vendas" 
          className={`block py-2 px-4 text-sm hover:bg-gray-800 ${
            isActive('/vendas') ? 'bg-gray-800 text-blue-400' : ''
          }`}
        >
          Vendas
        </Link>
        <Link 
          href="/reunioes" 
          className={`block py-2 px-4 text-sm hover:bg-gray-800 ${
            isActive('/reunioes') ? 'bg-gray-800 text-blue-400' : ''
          }`}
        >
          Reuniões
        </Link>
        <Link 
          href="/ranking" 
          className={`block py-2 px-4 text-sm hover:bg-gray-800 ${
            isActive('/ranking') ? 'bg-gray-800 text-blue-400' : ''
          }`}
        >
          Ranking
        </Link>
      </div>
    </nav>
  );
}
