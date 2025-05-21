"use client";

import { useState, useEffect } from 'react';

async function fetchRanking() {
  const res = await fetch('/api/ranking', { cache: 'no-store' });
  if (!res.ok) throw new Error('Falha ao buscar dados do ranking');
  return res.json();
}

export default function RankingPage() {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRanking()
      .then(setRanking)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const safeRanking = Array.isArray(ranking) ? ranking : [];

  if (loading)  return <p>Carregando…</p>;
  if (error)    return <p className="text-red-500">{error.message}</p>;
  if (!safeRanking.length) return <p>Nenhum registro no período.</p>;

  return (
    <div className="overflow-x-auto">
      {/* tabela com safeRanking.map(...) */}
    </div>
  );
}
