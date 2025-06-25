// src/app/vendedores/page.jsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/LoadingSpinner';

async function fetchVendedores() {
  const res = await fetch('/api/vendedores?ativo=true');
  if (!res.ok) throw new Error('Falha ao carregar vendedores');
  return res.json();
}

export default function VendedoresPage() {
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchVendedores();
        setVendedores(data);
      } catch (err) {
        console.error('Erro ao carregar vendedores:', err);
        setError('Erro ao carregar vendedores');
        toast.error('Erro ao carregar vendedores');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja desativar este vendedor?')) return;
    
    try {
      const res = await fetch(`/api/vendedores/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao desativar vendedor');
      
      setVendedores(vendedores.filter(v => v.id !== id));
      toast.success('Vendedor desativado com sucesso!');
    } catch (err) {
      console.error('Erro ao desativar vendedor:', err);
      toast.error('Erro ao desativar vendedor');
    }
  };

  if (loading) {
    return <LoadingSpinner size="xl" text="Carregando vendedores..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-danger-100 dark:bg-danger-900/30 mb-4">
          <svg className="w-8 h-8 text-danger-600 dark:text-danger-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Erro ao carregar vendedores</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn-primary btn-md"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vendedores</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie sua equipe de vendas ({vendedores.length} vendedores ativos)
          </p>
        </div>
        <Link href="/vendedores/novo" className="btn-primary btn-md">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Novo Vendedor
        </Link>
      </div>

      {/* Cards de vendedores */}
      {vendedores.length > 0 ? (
        <div className="grid-responsive">
          {vendedores.map((vendedor, index) => (
            <div 
              key={vendedor.id} 
              className="card p-6 hover:shadow-lg transition-all duration-200 hover:scale-105 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {vendedor.foto_url ? (
                    <img
                      src={vendedor.foto_url}
                      alt={vendedor.nome}
                      className="h-12 w-12 rounded-full object-cover border-2 border-primary/30"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/30">
                      <span className="font-bold text-primary-600 dark:text-primary-400 text-lg">
                        {vendedor.nome.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">{vendedor.nome}</h3>
                    <p className="text-sm text-muted-foreground">{vendedor.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="badge badge-success">Ativo</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">ID:</span>
                  <span className="font-mono text-foreground">#{vendedor.id}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Contratado em:</span>
                  <span className="text-foreground">
                    {new Date(vendedor.data_contratacao).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link 
                  href={`/vendedores/${vendedor.id}/editar`}
                  className="btn-outline btn-sm"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </Link>
                
                <button
                  onClick={() => handleDelete(vendedor.id)}
                  className="btn-destructive btn-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Desativar
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum vendedor encontrado</h3>
          <p className="text-muted-foreground mb-6">
            Comece adicionando seu primeiro vendedor à equipe.
          </p>
          <Link href="/vendedores/novo" className="btn-primary btn-md">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Adicionar Primeiro Vendedor
          </Link>
        </div>
      )}

      {/* Botão voltar */}
      <div className="text-center pt-6">
        <Link href="/" className="btn-outline btn-md">
          ← Voltar para Home
        </Link>
      </div>
    </div>
  );
}

