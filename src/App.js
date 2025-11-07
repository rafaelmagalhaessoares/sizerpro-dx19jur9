import React, { useEffect, useState } from "react";
import { UserPlus, Trash2, CheckCircle, XCircle, Mail, User, Search } from "lucide-react";

const API = "https://k0b22lj5ag.execute-api.sa-east-1.amazonaws.com/prod/usuarios";

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(false);

  const carregar = async () => {
    try {
      setLoading(true);
      const resp = await fetch(API);
      
      if (!resp.ok) {
        throw new Error(`Erro HTTP: ${resp.status}`);
      }
      
      const data = await resp.json();
      console.log("Dados recebidos:", data); // Para debug
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro detalhado:", error);
      // Não mostra alert, apenas loga o erro
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  const criar = async () => {
    if (!email) return alert("Por favor, informe o email.");
    try {
      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, nome, status: "ativo" }),
      });
      setEmail("");
      setNome("");
      carregar();
    } catch (error) {
      alert("Erro ao criar usuário");
    }
  };

  const atualizar = async (email, status) => {
    try {
      await fetch(API, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, status }),
      });
      carregar();
    } catch (error) {
      alert("Erro ao atualizar status");
    }
  };

  const remover = async (email) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;
    try {
      await fetch(API, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      carregar();
    } catch (error) {
      alert("Erro ao remover usuário");
    }
  };

  const usuariosFiltrados = usuarios.filter(u => {
    if (!u || !u.email || !u.nome) return false;
    const termoBusca = busca.toLowerCase();
    const emailStr = u.email.S || u.email || "";
    const nomeStr = u.nome.S || u.nome || "";
    return emailStr.toLowerCase().includes(termoBusca) || 
           nomeStr.toLowerCase().includes(termoBusca);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <User className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Painel de Usuários
              </h1>
              <p className="text-gray-500 text-sm">SizerPro - Gestão Simplificada</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Card de Adicionar Usuário */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <UserPlus className="text-blue-600" size={24} />
            Adicionar Novo Usuário
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Email do usuário"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            
            <button
              onClick={criar}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition transform font-medium flex items-center justify-center gap-2"
            >
              <UserPlus size={20} />
              Adicionar
            </button>
          </div>
        </div>

        {/* Barra de Busca e Info */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Buscar por email ou nome..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <span className="text-gray-600">Total:</span>
                <span className="font-bold text-blue-600 ml-2">{usuarios.length}</span>
              </div>
              <div className="bg-green-50 px-4 py-2 rounded-lg">
                <span className="text-gray-600">Ativos:</span>
                <span className="font-bold text-green-600 ml-2">
                  {usuarios.filter(u => u.status.S === "ativo").length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabela de Usuários */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : usuariosFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <User className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500">Nenhum usuário encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
               <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
  <tr>
    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
      Email
    </th>
    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
      Nome
    </th>
    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
      HWID
    </th>
    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
      Status
    </th>
    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
      Ações
    </th>
  </tr>
</thead>
<tbody className="divide-y divide-gray-100">
  {usuariosFiltrados.map((u, i) => (
    <tr key={i} className="hover:bg-gray-50 transition">
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Mail className="text-gray-400" size={16} />
          <span className="text-gray-700">{u.email?.S || u.email || "N/A"}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-gray-700 font-medium">{u.nome?.S || u.nome || "N/A"}</span>
      </td>
      <td className="px-6 py-4">
        <span className="text-gray-700 font-mono text-sm">
          {u.hwid?.S || u.hwid || <span className="text-gray-400 italic">–</span>}
        </span>
      </td>
      <td className="px-6 py-4">
        {(u.status?.S || u.status) === "ativo" ? (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle size={14} />
            Ativo
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            <XCircle size={14} />
            Inativo
          </span>
        )}
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2 justify-center">
          {(u.status?.S || u.status) === "inativo" ? (
            <button
              onClick={() => atualizar(u.email?.S || u.email, "ativo")}
              className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
              title="Ativar"
            >
              <CheckCircle size={18} />
            </button>
          ) : (
            <button
              onClick={() => atualizar(u.email?.S || u.email, "inativo")}
              className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              title="Inativar"
            >
              <XCircle size={18} />
            </button>
          )}
          <button
            onClick={() => remover(u.email?.S || u.email)}
            className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
            title="Excluir"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  ))}
</tbody>

              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;