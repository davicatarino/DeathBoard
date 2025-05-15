// Path: /home/ubuntu/projects/nextjs-mysql-crud/src/app/sales_ranking_ui_examples/RankingTable.jsx
// Exemplo de Componente React para exibir a Tabela de Ranking
"use client";
import { useState, useEffect } from "react";

function RankingTable() {
  const [ranking, setRanking] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRanking();
  }, []);

  const fetchRanking = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ranking");
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Falha ao buscar o ranking de vendas");
      }
      const data = await res.json();
      setRanking(data);
    } catch (err) {
      console.error("Erro ao buscar ranking:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <p className="text-center text-gray-300 mt-10">Carregando ranking...</p>;
  }

  if (error) {
    return <p className="text-center text-red-400 mt-10">Erro ao carregar ranking: {error}</p>;
  }

  if (ranking.length === 0) {
    return <p className="text-center text-gray-400 mt-10">Nenhum dado de ranking encontrado.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">Ranking de Vendas</h1>
      <div className="overflow-x-auto bg-gray-800 shadow-xl rounded-lg">
        <table className="min-w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3">Posição</th>
              <th scope="col" className="px-6 py-3">Nome do Vendedor</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Nº de Vendas</th>
              <th scope="col" className="px-6 py-3">Faturamento Total</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((vendedor, index) => (
              <tr key={vendedor.vendedor_id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50 transition-colors duration-150">
                <td className="px-6 py-4 font-medium text-white whitespace-nowrap">
                  {index + 1}
                </td>
                <td className="px-6 py-4">
                  {vendedor.nome_vendedor}
                </td>
                <td className="px-6 py-4">
                  {vendedor.email_vendedor || "-"}
                </td>
                <td className="px-6 py-4 text-center">
                  {vendedor.numero_de_vendas}
                </td>
                <td className="px-6 py-4 font-semibold">
                  R$ {parseFloat(vendedor.faturamento_total).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-center mt-6">
        <button 
          onClick={fetchRanking} 
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out disabled:opacity-50"
        >
          {isLoading ? "Atualizando..." : "Atualizar Ranking"}
        </button>
      </div>
    </div>
  );
}

export default RankingTable;

