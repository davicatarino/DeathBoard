"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function RankingPage() {
  const [vendedoresRanking, setVendedoresRanking] = useState([]);
  const [sdrsRanking, setSdrsRanking] = useState([]);
  const [loadingVendedores, setLoadingVendedores] = useState(true);
  const [loadingSDRs, setLoadingSDRs] = useState(true);
  const [errorVendedores, setErrorVendedores] = useState(null);
  const [errorSDRs, setErrorSDRs] = useState(null);
  
  // Estados para filtro de período
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  useEffect(() => {
    fetchVendedoresRanking();
    fetchSDRsRanking();
  }, []);

  async function fetchVendedoresRanking() {
    setLoadingVendedores(true);
    setErrorVendedores(null);
    try {
      let url = "/api/ranking";
      if (dataInicio || dataFim) {
        const params = new URLSearchParams();
        if (dataInicio) params.append("data_inicio", dataInicio);
        if (dataFim) params.append("data_fim", dataFim);
        url += `?${params.toString()}`;
      }
      
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Falha ao buscar ranking de vendedores");
      }
      const data = await res.json();
      setVendedoresRanking(data);
    } catch (err) {
      console.error(err);
      setErrorVendedores("Erro ao carregar ranking de vendedores");
    } finally {
      setLoadingVendedores(false);
    }
  }

  async function fetchSDRsRanking() {
    setLoadingSDRs(true);
    setErrorSDRs(null);
    try {
      let url = "/api/ranking/sdrs";
      if (dataInicio || dataFim) {
        const params = new URLSearchParams();
        if (dataInicio) params.append("data_inicio", dataInicio);
        if (dataFim) params.append("data_fim", dataFim);
        url += `?${params.toString()}`;
      }
      
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Falha ao buscar ranking de SDRs");
      }
      const data = await res.json();
      setSdrsRanking(data);
    } catch (err) {
      console.error(err);
      setErrorSDRs("Erro ao carregar ranking de SDRs");
    } finally {
      setLoadingSDRs(false);
    }
  }

  const handleFilter = () => {
    fetchVendedoresRanking();
    fetchSDRsRanking();
  };

  const clearFilter = () => {
    setDataInicio("");
    setDataFim("");
    setTimeout(() => {
      fetchVendedoresRanking();
      fetchSDRsRanking();
    }, 0);
  };

  const getMedalIcon = (position) => {
    if (position === 0) return "🥇";
    if (position === 1) return "🥈";
    if (position === 2) return "🥉";
    return null;
  };

  const getPositionClass = (position) => {
    if (position === 0) return "medal-gold";
    if (position === 1) return "medal-silver";
    if (position === 2) return "medal-bronze";
    return "text-muted-foreground";
  };

  const RankingCard = ({ title, data, loading, error, type }) => (
    <div className="ranking-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <div className="flex space-x-2">
          {type === 'vendedores' && (
            <>
              <div className="w-3 h-3 rounded-full bg-gold"></div>
              <div className="w-3 h-3 rounded-full bg-silver"></div>
              <div className="w-3 h-3 rounded-full bg-bronze"></div>
            </>
          )}
        </div>
      </div>
      
      {error && (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-danger-100 dark:bg-danger-900/30 mb-4">
            <svg className="w-8 h-8 text-danger-600 dark:text-danger-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-danger-600 dark:text-danger-400 font-medium">{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 dark:border-primary-400"></div>
          </div>
          <p className="text-muted-foreground">Carregando ranking...</p>
        </div>
      ) : data.length > 0 ? (
        <div className="space-y-4">
          {data.map((item, index) => (
            <div 
              key={type === 'vendedores' ? item.vendedor_id : item.sdr_id}
              className={`relative p-4 rounded-lg border transition-all duration-200 hover:scale-105 hover:shadow-md ${
                index === 0 
                  ? 'bg-gradient-to-r from-gold/10 to-gold/5 border-gold/30' 
                  : index === 1 
                  ? 'bg-gradient-to-r from-silver/10 to-silver/5 border-silver/30'
                  : index === 2 
                  ? 'bg-gradient-to-r from-bronze/10 to-bronze/5 border-bronze/30'
                  : 'bg-card border-gray-200 dark:border-gray-700 hover:border-primary/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                      index === 0 ? 'bg-gold text-white' :
                      index === 1 ? 'bg-silver text-gray-800' :
                      index === 2 ? 'bg-bronze text-white' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {getMedalIcon(index) || (index + 1)}
                    </div>
                    {index < 3 && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-current flex items-center justify-center">
                        <div className={`w-2 h-2 rounded-full ${
                          index === 0 ? 'bg-gold' :
                          index === 1 ? 'bg-silver' :
                          'bg-bronze'
                        }`}></div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {item.foto_url ? (
                      <img
                        src={item.foto_url}
                        alt={type === 'vendedores' ? item.nome_vendedor : item.nome_sdr}
                        className="h-10 w-10 rounded-full object-cover border-2 border-primary/30"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/30">
                        <span className="font-bold text-primary-600 dark:text-primary-400">
                          {(type === 'vendedores' ? item.nome_vendedor : item.nome_sdr).charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {type === 'vendedores' ? item.nome_vendedor : item.nome_sdr}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {type === 'vendedores' ? item.email_vendedor : item.email_sdr}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  {type === 'vendedores' ? (
                    <>
                      <div className="text-lg font-bold text-foreground">
                        {parseFloat(item.faturamento_total).toLocaleString('pt-BR', { 
                          style: 'currency', 
                          currency: 'BRL' 
                        })}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.numero_de_vendas} vendas
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-lg font-bold text-foreground">
                        {item.taxa_conversao}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.total_reunioes_realizadas}/{item.total_reunioes_agendadas} reuniões
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {/* Barra de progresso gamificada */}
              {type === 'vendedores' && data.length > 0 && (
                <div className="mt-3">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${(item.faturamento_total / data[0].faturamento_total) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-muted-foreground">Nenhum {type === 'vendedores' ? 'vendedor' : 'SDR'} encontrado no período selecionado.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent">
          Ranking de Desempenho
        </h1>
        <p className="text-muted-foreground text-lg">
          Acompanhe a performance da sua equipe com rankings gamificados
        </p>
      </div>
      
      {/* Filtro de Período */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Filtrar por Período</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            handleFilter();
          }}
          className="flex flex-wrap gap-4 items-end"
        >
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="dataInicio" className="block text-sm font-medium text-foreground mb-2">
              Data Início:
            </label>
            <input 
              type="date" 
              id="dataInicio" 
              value={dataInicio} 
              onChange={(e) => setDataInicio(e.target.value)} 
              className="input"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="dataFim" className="block text-sm font-medium text-foreground mb-2">
              Data Fim:
            </label>
            <input 
              type="date" 
              id="dataFim" 
              value={dataFim} 
              onChange={(e) => setDataFim(e.target.value)} 
              className="input"
            />
          </div>
          <div className="flex gap-2">
            <button 
              type="submit"
              className="btn-primary btn-md"
            >
              Filtrar
            </button>
            <button 
              type="button"
              onClick={clearFilter}
              className="btn-outline btn-md"
            >
              Limpar
            </button>
          </div>
        </form>
      </div>

      {/* Grid para os dois rankings lado a lado */}
      <div className="grid lg:grid-cols-2 gap-6">
        <RankingCard
          title="🏆 Ranking de Vendedores"
          data={vendedoresRanking}
          loading={loadingVendedores}
          error={errorVendedores}
          type="vendedores"
        />
        
        <RankingCard
          title="🎯 Ranking de SDRs"
          data={sdrsRanking}
          loading={loadingSDRs}
          error={errorSDRs}
          type="sdrs"
        />
      </div>

      {/* Botão voltar */}
      <div className="text-center pt-6">
        <Link 
          href="/" 
          className="btn-outline btn-md"
        >
          ← Voltar para Home
        </Link>
      </div>
    </div>
  );
}
