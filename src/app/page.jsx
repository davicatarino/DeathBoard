// src/app/page.jsx
"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [stats, setStats] = useState({
    totalVendedores: 0,
    totalVendas: 0,
    totalReunioes: 0,
    faturamentoTotal: 0
  });

  useEffect(() => {
    // Simular carregamento de estatísticas
    const fetchStats = async () => {
      try {
        const [vendedoresRes, vendasRes, reunioesRes, rankingRes] = await Promise.all([
          fetch('/api/vendedores?ativo=true'),
          fetch('/api/vendas'),
          fetch('/api/reunioes'),
          fetch('/api/ranking')
        ]);

        const vendedores = await vendedoresRes.json();
        const vendas = await vendasRes.json();
        const reunioes = await reunioesRes.json();
        const ranking = await rankingRes.json();

        const faturamentoTotal = ranking.reduce((sum, v) => sum + v.faturamento_total, 0);

        setStats({
          totalVendedores: vendedores.length,
          totalVendas: vendas.length,
          totalReunioes: reunioes.length,
          faturamentoTotal
        });
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon, color, delay = 0 }) => (
    <div 
      className={`card p-6 text-center transition-all duration-500 hover:scale-105 hover:shadow-lg animate-float`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${color} mb-4`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-2">{value}</h3>
      <p className="text-muted-foreground text-sm">{title}</p>
    </div>
  );

  const FeatureCard = ({ title, description, icon, href, gradient }) => (
    <Link href={href}>
      <div className={`group relative overflow-hidden rounded-xl p-6 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${gradient} cursor-pointer`}>
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mb-4 group-hover:bg-white/30 transition-colors duration-300">
            {icon}
          </div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-white/90 text-sm">{description}</p>
        </div>
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent">
            Bem-vindo ao Death Board
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Sistema completo para gerenciamento de equipes de vendas, 
            <br className="hidden md:block" />
            com ranking gamificado e acompanhamento de performance em tempo real.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/ranking" className="btn-primary btn-lg">
              Ver Ranking
            </Link>
            <Link href="/vendedores" className="btn-outline btn-lg">
              Gerenciar Equipe
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
          Estatísticas Gerais
        </h2>
        <div className="grid-responsive">
          <StatCard
            title="Vendedores Ativos"
            value={stats.totalVendedores}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            }
            color="bg-primary-500"
            delay={0}
          />
          <StatCard
            title="Total de Vendas"
            value={stats.totalVendas}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            }
            color="bg-success-500"
            delay={100}
          />
          <StatCard
            title="Reuniões Agendadas"
            value={stats.totalReunioes}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            color="bg-warning-500"
            delay={200}
          />
          <StatCard
            title="Faturamento Total"
            value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.faturamentoTotal)}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
            color="bg-danger-500"
            delay={300}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
          Funcionalidades Principais
        </h2>
        <div className="grid-responsive">
          <FeatureCard
            title="Ranking Gamificado"
            description="Acompanhe a performance dos vendedores com rankings dinâmicos e conquistas."
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            href="/ranking"
            gradient="bg-gradient-to-br from-primary-500 to-primary-700"
          />
          <FeatureCard
            title="Gestão de Vendedores"
            description="Cadastre, edite e gerencie sua equipe de vendas de forma eficiente."
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            }
            href="/vendedores"
            gradient="bg-gradient-to-br from-success-500 to-success-700"
          />
          <FeatureCard
            title="Controle de Vendas"
            description="Registre vendas, acompanhe histórico e analise performance por período."
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            }
            href="/vendas"
            gradient="bg-gradient-to-br from-warning-500 to-warning-700"
          />
          <FeatureCard
            title="Gestão de SDRs"
            description="Gerencie Sales Development Representatives e acompanhe suas atividades."
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            href="/sdrs"
            gradient="bg-gradient-to-br from-purple-500 to-purple-700"
          />
          <FeatureCard
            title="Agendamento de Reuniões"
            description="Agende e acompanhe reuniões com clientes de forma organizada."
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            href="/reunioes"
            gradient="bg-gradient-to-br from-pink-500 to-pink-700"
          />
          <div className="card p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-500 mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Dashboard Avançado</h3>
            <p className="text-muted-foreground text-sm mb-4">Visão geral do desempenho da equipe com métricas avançadas.</p>
            <span className="badge badge-secondary">Em Desenvolvimento</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 border-t border-gray-200 dark:border-gray-700">
        <p className="text-muted-foreground">
          &copy; {new Date().getFullYear()} Death Board - Sistema de Ranking de Vendas. 
          Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}

