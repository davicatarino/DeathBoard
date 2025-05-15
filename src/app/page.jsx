// src/app/page.jsx
"use client";

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container mx-auto p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">Bem-vindo ao Sistema de Ranking de Vendas</h1>
        <p className="text-xl text-gray-600 mt-2">Gerencie seus vendedores, registre vendas e acompanhe o desempenho da equipe.</p>
      </header>

      <nav className="grid md:grid-cols-3 gap-6">
        <Link href="/ranking" legacyBehavior>
          <a className="block p-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-semibold mb-2">Ver Ranking de Vendas</h2>
            <p>Acompanhe a performance dos vendedores em tempo real.</p>
          </a>
        </Link>

        <Link href="/vendedores" legacyBehavior>
          <a className="block p-6 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-semibold mb-2">Gerenciar Vendedores</h2>
            <p>Adicione, edite ou remova vendedores da sua equipe.</p>
          </a>
        </Link>

        <Link href="/vendas" legacyBehavior>
          <a className="block p-6 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg shadow-md transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-semibold mb-2">Gerenciar Vendas</h2>
            <p>Registre novas vendas e consulte o histórico.</p>
          </a>
        </Link>
      </nav>

      <footer className="text-center mt-16 text-gray-500">
        <p>&copy; {new Date().getFullYear()} DeathBoard - Sales Ranking. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

