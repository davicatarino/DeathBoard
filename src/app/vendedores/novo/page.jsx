// src/app/vendedores/novo/page.jsx
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Corrected import for App Router
import { useState } from 'react';

// Supondo que você tenha um componente VendedorForm em @/app/components/VendedorForm.jsx
// import VendedorForm from '@/app/components/VendedorForm'; 
// Por ora, um formulário simples:

export default function NovoVendedorPage() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [dataContratacao, setDataContratacao] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/vendedores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          nome,
          email,
          data_contratacao: dataContratacao || null, // Enviar null se vazio
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Falha ao criar vendedor');
      }
      alert('Vendedor criado com sucesso!');
      router.push('/vendedores'); // Redireciona para a lista de vendedores
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Adicionar Novo Vendedor</h1>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">Erro: {error}</p>}
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto text-black bg-white p-8 shadow-md rounded-lg">
        <div className="mb-4">
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome Completo</label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="dataContratacao" className="block text-sm font-medium text-gray-700">Data de Contratação</label>
          <input
            type="date"
            id="dataContratacao"
            value={dataContratacao}
            onChange={(e) => setDataContratacao(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="flex items-center justify-between">
          <button 
            type="submit" 
            disabled={submitting}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
          >
            {submitting ? 'Salvando...' : 'Salvar Vendedor'}
          </button>
          <Link href="/vendedores" legacyBehavior>
            <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">Cancelar</a>
          </Link>
        </div>
      </form>
    </div>
  );
}

