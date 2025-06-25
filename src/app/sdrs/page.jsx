"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function SDRsPage() {
  const [sdrs, setSDRs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSDRs();
  }, []);

  async function fetchSDRs() {
    setLoading(true);
    try {
      const res = await fetch('/api/sdrs');
      if (!res.ok) {
        throw new Error('Falha ao buscar SDRs');
      }
      const data = await res.json();
      setSDRs(data);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar SDRs');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Tem certeza que deseja desativar este SDR?')) return;
    
    try {
      const res = await fetch(`/api/sdrs/${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        throw new Error('Falha ao desativar SDR');
      }
      
      // Atualiza a lista após desativar
      fetchSDRs();
      toast.success('SDR desativado com sucesso!');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao desativar SDR');
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-lg text-gray-300">Carregando SDRs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-center text-red-400 text-lg">Erro: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-100">SDRs</h1>
        <Link 
          href="/sdrs/novo" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Adicionar SDR
        </Link>
      </div>

      {sdrs.length === 0 ? (
        <p className="text-center text-gray-400">Nenhum SDR encontrado.</p>
      ) : (
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <table className="min-w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-300 uppercase bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3">ID</th>
                <th scope="col" className="px-6 py-3">Nome</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Data de Contratação</th>
                <th scope="col" className="px-6 py-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {sdrs.map((sdr) => (
                <tr key={sdr.id} className="bg-gray-900 border-b border-gray-700 hover:bg-gray-800">
                  <td className="px-6 py-4 font-medium text-gray-100">
                    {sdr.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {sdr.foto_url ? (
                        <img 
                          src={sdr.foto_url} 
                          alt={sdr.nome} 
                          className="h-10 w-10 rounded-full mr-3 object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center mr-3">
                          <span className="text-gray-300 font-bold">
                            {sdr.nome.charAt(0)}
                          </span>
                        </div>
                      )}
                      {sdr.nome}
                    </div>
                  </td>
                  <td className="px-6 py-4">{sdr.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      sdr.ativo 
                        ? 'bg-green-700 text-green-200' 
                        : 'bg-red-700 text-red-200'
                    }`}>
                      {sdr.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {sdr.data_contratacao ? new Date(sdr.data_contratacao).toLocaleDateString('pt-BR') : '-'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center space-x-2">
                      <Link 
                        href={`/sdrs/${sdr.id}/editar`} 
                        className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded text-sm transition-colors"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(sdr.id)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm transition-colors"
                      >
                        Desativar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8">
        <Link 
          href="/" 
          className="text-blue-400 hover:text-blue-300 hover:underline"
        >
          &larr; Voltar para Home
        </Link>
      </div>
    </div>
  );
}
