"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

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
    } catch (err) {
      console.error(err);
      alert('Erro ao desativar SDR');
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">SDRs</h1>
        <Link href="/sdrs/novo" legacyBehavior>
          <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Adicionar SDR
          </a>
        </Link>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading ? (
        <p className="text-center py-8">Carregando SDRs...</p>
      ) : sdrs.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Nome</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Data de Contratação</th>
                <th className="py-3 px-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {sdrs.map((sdr) => (
                <tr key={sdr.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 flex items-center">
                    {sdr.foto_url ? (
                      <img 
                        src={sdr.foto_url} 
                        alt={sdr.nome} 
                        className="h-10 w-10 rounded-full mr-3 object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                        <span className="text-gray-600 font-bold">
                          {sdr.nome.charAt(0)}
                        </span>
                      </div>
                    )}
                    {sdr.nome}
                  </td>
                  <td className="py-3 px-4">{sdr.email}</td>
                  <td className="py-3 px-4">
                    {sdr.data_contratacao ? new Date(sdr.data_contratacao).toLocaleDateString('pt-BR') : '-'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center space-x-2">
                      <Link href={`/sdrs/${sdr.id}/editar`} legacyBehavior>
                        <a className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded text-sm">
                          Editar
                        </a>
                      </Link>
                      <button
                        onClick={() => handleDelete(sdr.id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
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
      ) : (
        <p className="text-center py-8">Nenhum SDR encontrado.</p>
      )}

      <div className="mt-8">
        <Link href="/" legacyBehavior>
          <a className="text-blue-500 hover:underline">&larr; Voltar para Home</a>
        </Link>
      </div>
    </div>
  );
}
