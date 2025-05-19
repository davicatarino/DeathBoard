"use client";

import { useState, useEffect } from 'react';

async function fetchRanking() {
  const res = await fetch('/api/ranking', { cache: 'no-store' }); // cache: 'no-store' para dados dinâmicos
  if (!res.ok) {
    // Isso ativará o Error Boundary mais próximo (ex: error.js)
    throw new Error('Falha ao buscar dados do ranking');
  }
  return res.json();
}

export default function RankingPage() {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchRanking();
        setRanking(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="container mx-auto p-4"><p className="text-center text-lg">Carregando ranking...</p></div>;
  }

  if (error) {
    return <div className="container mx-auto p-4"><p className="text-center text-red-500 text-lg">Erro: {error}</p></div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Ranking de Vendas</h1>
      {ranking.length === 0 ? (
        <p className="text-center text-gray-500">Nenhum dado de ranking disponível no momento.</p>
      ) : (
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Posição</th>
                <th scope="col" className="px-6 py-3">Nome do Vendedor</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3 text-right">Nº de Vendas</th>
                <th scope="col" className="px-6 py-3 text-right">Faturamento Total (R$)</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((vendedor, index) => (
                <tr key={vendedor.vendedor_id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {index + 1}º
                  </td>
                  <td className="px-6 py-4">
  {vendedor.foto_url ? (
    <img
      src={vendedor.foto_url}
      alt={`Foto de ${vendedor.nome_vendedor}`}
      className="h-10 w-10 rounded-full object-cover"
    />
  ) : (
    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-500">
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    </div>
  )}
</td>
                  <td className="px-6 py-4">
                    {vendedor.nome_vendedor}
                  </td>
                  <td className="px-6 py-4">
                    {vendedor.email_vendedor}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {vendedor.numero_de_vendas}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {parseFloat(vendedor.faturamento_total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Aqui você pode adicionar links/botões para gerenciar Vendedores e Vendas */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">Dica: Adicione funcionalidades para gerenciar vendedores e registrar novas vendas.</p>
      </div>
    </div>
  );
}

