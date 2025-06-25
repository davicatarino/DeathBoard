// src/app/page.jsx
"use client";

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container mx-auto p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-100">Bem-vindo ao Sistema de Ranking de Vendas</h1>
        <p className="text-xl text-gray-300 mt-2">Gerencie seus vendedores, registre vendas e acompanhe o desempenho da equipe.</p>
      </header>

      <nav className="grid md:grid-cols-3 gap-6">
        <Link 
          href="/ranking" 
          className="block p-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-transform transform hover:scale-105"
        >
          <h2 className="text-2xl font-semibold mb-2">Ver Ranking de Vendas</h2>
          <p>Acompanhe a performance dos vendedores em tempo real.</p>
        </Link>

        <Link 
          href="/vendedores" 
          className="block p-6 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition-transform transform hover:scale-105"
        >
          <h2 className="text-2xl font-semibold mb-2">Gerenciar Vendedores</h2>
          <p>Adicione, edite ou remova vendedores da sua equipe.</p>
        </Link>

        <Link 
          href="/vendas" 
          className="block p-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-transform transform hover:scale-105"
        >
          <h2 className="text-2xl font-semibold mb-2">Gerenciar Vendas</h2>
          <p>Registre novas vendas e consulte o histórico.</p>
        </Link>

        <Link 
          href="/sdrs" 
          className="block p-6 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md transition-transform transform hover:scale-105"
        >
          <h2 className="text-2xl font-semibold mb-2">Gerenciar SDRs</h2>
          <p>Gerencie sua equipe de Sales Development Representatives.</p>
        </Link>

        <Link 
          href="/reunioes" 
          className="block p-6 bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-md transition-transform transform hover:scale-105"
        >
          <h2 className="text-2xl font-semibold mb-2">Gerenciar Reuniões</h2>
          <p>Agende e acompanhe reuniões com clientes.</p>
        </Link>

        <div className="block p-6 bg-gray-700 text-gray-300 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-2">Dashboard</h2>
          <p>Visão geral do desempenho da equipe (em desenvolvimento).</p>
        </div>
      </nav>

      <footer className="text-center mt-16 text-gray-400">
        <p>&copy; {new Date().getFullYear()} DeathBoard - Sales Ranking. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

