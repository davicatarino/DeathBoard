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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-white">Ranking de Desempenho</h1>
      
      {/* Filtro de Período */}
      <div className="mb-6 p-4 bg-gray-900 rounded-lg shadow border border-gray-700">
        <h2 className="text-xl font-semibold mb-3 text-blue-300">Filtrar por Período</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            handleFilter();
          }}
          className="flex flex-wrap gap-4 items-end"
        >
          <div>
            <label htmlFor="dataInicio" className="block text-sm font-medium text-gray-200 mb-1">Data Início:</label>
            <input 
              type="date" 
              id="dataInicio" 
              value={dataInicio} 
              onChange={(e) => setDataInicio(e.target.value)} 
              className="block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
            />
          </div>
          <div>
            <label htmlFor="dataFim" className="block text-sm font-medium text-gray-200 mb-1">Data Fim:</label>
            <input 
              type="date" 
              id="dataFim" 
              value={dataFim} 
              onChange={(e) => setDataFim(e.target.value)} 
              className="block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
            />
          </div>
          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Filtrar
          </button>
          <button 
            type="button"
            onClick={clearFilter}
            className="bg-gray-700 hover:bg-gray-600 text-gray-200 font-bold py-2 px-6 rounded shadow transition-all focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Limpar Filtro
          </button>
        </form>
      </div>

      {/* Grid para os dois rankings lado a lado */}
      <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ranking de Vendedores */}
        <div className="bg-gray-900 p-4 rounded-lg shadow border border-gray-700">
          <h2 className="text-2xl font-bold mb-4 text-center text-blue-300">Ranking de Vendedores</h2>
          {errorVendedores && <p className="text-red-400 mb-4 text-center">{errorVendedores}</p>}
          {loadingVendedores ? (
            <p className="text-center py-8 text-gray-300">Carregando ranking de vendedores...</p>
          ) : vendedoresRanking.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-900 rounded-lg">
                <thead className="sticky top-0 z-10 bg-slate-800 text-white">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Posição</th>
                    <th className="py-3 px-4 font-semibold">Vendedor</th>
                    <th className="py-3 px-4 font-semibold text-right">Faturamento</th>
                    <th className="py-3 px-4 font-semibold text-right">Vendas</th>
                  </tr>
                </thead>
                <tbody className="text-gray-100">
                  {vendedoresRanking.map((vendedor, index) => (
                    <tr key={vendedor.vendedor_id}
                      className={`border-b border-gray-800 ${index === 0 ? "bg-blue-950" : index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}`}>
                      <td className="py-3 px-4 font-bold text-blue-400">{index + 1}º</td>
                      <td className="py-3 px-4 flex items-center gap-3">
                        {vendedor.foto_url ? (
                          <img
                            src={vendedor.foto_url}
                            alt={vendedor.nome_vendedor}
                            className="h-10 w-10 rounded-full object-cover border-2 border-blue-400"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 border-2 border-gray-600">
                            <span className="font-bold">{vendedor.nome_vendedor.charAt(0)}</span>
                          </div>
                        )}
                        <span className="font-semibold">{vendedor.nome_vendedor}</span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono">{parseFloat(vendedor.faturamento_total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                      <td className="py-3 px-4 text-right">{vendedor.numero_de_vendas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-8 text-gray-400">Nenhum vendedor encontrado no período selecionado.</p>
          )}
        </div>

        {/* Ranking de SDRs */}
        <div className="bg-gray-900 p-4 rounded-lg shadow border border-gray-700">
          <h2 className="text-2xl font-bold mb-4 text-center text-blue-300">Ranking de SDRs</h2>
          {errorSDRs && <p className="text-red-400 mb-4 text-center">{errorSDRs}</p>}
          {loadingSDRs ? (
            <p className="text-center py-8 text-gray-300">Carregando ranking de SDRs...</p>
          ) : sdrsRanking.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-900 rounded-lg">
                <thead className="sticky top-0 z-10 bg-slate-800 text-white">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Posição</th>
                    <th className="py-3 px-4 font-semibold">SDR</th>
                    <th className="py-3 px-4 font-semibold text-right">Reuniões Agendadas</th>
                    <th className="py-3 px-4 font-semibold text-right">Realizadas</th>
                    <th className="py-3 px-4 font-semibold text-right">Taxa</th>
                  </tr>
                </thead>
                <tbody className="text-gray-100">
                  {sdrsRanking.map((sdr, index) => (
                    <tr key={sdr.sdr_id}
                      className={`border-b border-gray-800 ${index === 0 ? "bg-blue-950" : index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}`}>
                      <td className="py-3 px-4 font-bold text-blue-400">{index + 1}º</td>
                      <td className="py-3 px-4 flex items-center gap-3">
                        {sdr.foto_url ? (
                          <img
                            src={sdr.foto_url}
                            alt={sdr.nome_sdr}
                            className="h-10 w-10 rounded-full object-cover border-2 border-blue-400"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 border-2 border-gray-600">
                            <span className="font-bold">{sdr.nome_sdr.charAt(0)}</span>
                          </div>
                        )}
                        <span className="font-semibold">{sdr.nome_sdr}</span>
                      </td>
                      <td className="py-3 px-4 text-right">{sdr.total_reunioes_agendadas}</td>
                      <td className="py-3 px-4 text-right">{sdr.total_reunioes_realizadas}</td>
                      <td className="py-3 px-4 text-right">{sdr.taxa_conversao}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-8 text-gray-400">Nenhum SDR encontrado no período selecionado.</p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <Link href="/" legacyBehavior>
          <a className="text-blue-500 hover:underline">&larr; Voltar para Home</a>
        </Link>
      </div>
    </div>
  );
}
