// Path: /home/ubuntu/projects/nextjs-mysql-crud/src/app/sales_ranking_ui_examples/VendedorForm.jsx
// Exemplo de Componente React para Formulário de Vendedor (adaptar do ProductForm.jsx original)
"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";

function VendedorForm() {
  const [vendedor, setVendedor] = useState({
    nome: "",
    email: "",
    data_contratacao: "", // Formato YYYY-MM-DD
    ativo: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const router = useRouter();
  const params = useParams();
  const nomeInputRef = useRef(null);

  useEffect(() => {
    if (params.id) {
      fetchVendedor(params.id);
    }
    nomeInputRef.current?.focus();
  }, [params.id]);

  const fetchVendedor = async (id) => {
    try {
      const res = await fetch(`/api/vendedores/${id}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Falha ao buscar vendedor");
      }
      const data = await res.json();
      // Formatar data_contratacao para o input type="date"
      const formattedDataContratacao = data.data_contratacao 
        ? new Date(data.data_contratacao).toISOString().split('T')[0] 
        : "";
      setVendedor({ 
        nome: data.nome,
        email: data.email || "", 
        data_contratacao: formattedDataContratacao,
        ativo: data.ativo !== undefined ? data.ativo : true 
      });
    } catch (error) {
      console.error("Erro ao buscar vendedor:", error);
      setErrors({ api: error.message });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setVendedor((prevVendedor) => ({
      ...prevVendedor,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!vendedor.nome.trim()) {
      newErrors.nome = "O nome é obrigatório.";
    }
    if (vendedor.email && !/\S+@\S+\.\S+/.test(vendedor.email)) {
      newErrors.email = "Formato de email inválido.";
    }
    // Adicionar mais validações conforme necessário
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);

    try {
      let res;
      const payload = {
        ...vendedor,
        // Enviar null se a data não for preenchida, para evitar problemas com o MySQL
        data_contratacao: vendedor.data_contratacao ? vendedor.data_contratacao : null,
      };

      if (params.id) {
        res = await fetch(`/api/vendedores/${params.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        });
      } else {
        res = await fetch("/api/vendedores", {
          method: "POST",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Falha ao salvar vendedor");
      }
      
      // const data = await res.json(); // Opcional, se precisar dos dados retornados
      router.push("/vendedores"); // Redirecionar para a lista de vendedores
      router.refresh(); // Atualizar os dados na página de listagem

    } catch (error) {
      console.error("Erro ao salvar vendedor:", error);
      setErrors({ api: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Adapte o JSX do ProductForm.jsx original para os campos de Vendedor
  return (
    <div className="flex justify-center items-center h-full">
      <form className="bg-gray-700 p-10 rounded-lg shadow-xl w-full max-w-md" onSubmit={handleSubmit}>
        <header className="flex justify-between items-center mb-6">
          <h1 className="font-bold text-2xl">
            {params.id ? "Editar Vendedor" : "Novo Vendedor"}
          </h1>
          {params.id && (
            <button
              type="button"
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
              onClick={async () => {
                if (confirm("Tem certeza que deseja desativar este vendedor?")) {
                  try {
                    const res = await fetch(`/api/vendedores/${params.id}`, {
                      method: "DELETE",
                    });
                    if (!res.ok && res.status !== 204) { // 204 é No Content, esperado para DELETE
                        const errorData = await res.json();
                        throw new Error(errorData.message || "Falha ao desativar vendedor");
                    }
                    router.push("/vendedores");
                    router.refresh();
                  } catch (error) {
                    console.error("Erro ao desativar vendedor:", error);
                    setErrors({ api: error.message });
                  }
                }
              }}
            >
              Desativar
            </button>
          )}
        </header>

        {errors.api && (
          <p className="bg-red-500 text-white p-3 rounded-md mb-4 text-sm">{errors.api}</p>
        )}

        <label htmlFor="nome" className="font-bold text-sm block mb-2">Nome do Vendedor:</label>
        <input
          type="text"
          name="nome"
          id="nome"
          placeholder="Nome completo"
          onChange={handleChange}
          value={vendedor.nome}
          autoFocus
          ref={nomeInputRef}
          className="border border-gray-400 p-2 mb-1 w-full rounded-md text-black bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.nome && <p className="text-red-400 text-xs mb-3">{errors.nome}</p>}

        <label htmlFor="email" className="font-bold text-sm block mb-2 mt-3">Email:</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="exemplo@dominio.com"
          onChange={handleChange}
          value={vendedor.email}
          className="border border-gray-400 p-2 mb-1 w-full rounded-md text-black bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && <p className="text-red-400 text-xs mb-3">{errors.email}</p>}

        <label htmlFor="data_contratacao" className="font-bold text-sm block mb-2 mt-3">Data de Contratação:</label>
        <input
          type="date"
          name="data_contratacao"
          id="data_contratacao"
          onChange={handleChange}
          value={vendedor.data_contratacao}
          className="border border-gray-400 p-2 mb-4 w-full rounded-md text-black bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex items-center mb-6">
          <input 
            type="checkbox" 
            name="ativo" 
            id="ativo"
            checked={vendedor.ativo}
            onChange={handleChange}
            className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="ativo" className="font-bold text-sm">Vendedor Ativo</label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out disabled:opacity-50"
        >
          {isSubmitting ? (params.id ? "Atualizando..." : "Salvando...") : (params.id ? "Atualizar Vendedor" : "Salvar Vendedor")}
        </button>
      </form>
    </div>
  );
}

export default VendedorForm;

