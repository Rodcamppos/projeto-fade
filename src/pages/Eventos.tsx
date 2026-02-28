import { useState, useMemo, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Search, Plus, Edit, Trash2, Eye, Filter, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Evento {
  id: string;
  nome: string;
  data: string;
  local: string;
  status: 'Ativo' | 'Encerrado';
}

const EVENTOS_MOCK: Evento[] = [
  { id: '1', nome: 'Workshop React FADE', data: '2026-03-10', local: 'UFPE - Auditório A', status: 'Ativo' },
  { id: '2', nome: 'Simpósio de Tecnologia', data: '2026-03-15', local: 'CISAM - Recife', status: 'Ativo' },
  { id: '3', nome: 'Hackathon Universitário', data: '2026-02-20', local: 'Poli-UPE', status: 'Encerrado' },
];

export function Eventos() {
  const [eventos, setEventos] = useState<Evento[]>(() => {
    const salvo = localStorage.getItem('@fade:eventos');
    return salvo ? JSON.parse(salvo) : EVENTOS_MOCK;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | 'Ativo' | 'Encerrado'>('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventoParaEditar, setEventoParaEditar] = useState<Evento | null>(null);

  const [formData, setFormData] = useState<{
    nome: string;
    data: string;
    local: string;
    status: 'Ativo' | 'Encerrado';
  }>({ nome: '', data: '', local: '', status: 'Ativo' });

  useEffect(() => {
    localStorage.setItem('@fade:eventos', JSON.stringify(eventos));
  }, [eventos]);

  const filteredEvents = useMemo(() => {
    return eventos.filter((evento) => {
      const matchesSearch = evento.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            evento.local.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'Todos' || evento.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [eventos, searchTerm, statusFilter]);

  const prepararEdicao = (evento: Evento) => {
    setEventoParaEditar(evento);
    setFormData({ nome: evento.nome, data: evento.data, local: evento.local, status: evento.status });
    setIsModalOpen(true);
  };

  const fecharModal = () => {
    setIsModalOpen(false);
    setEventoParaEditar(null);
    setFormData({ nome: '', data: '', local: '', status: 'Ativo' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (eventoParaEditar) {
      setEventos(prev => prev.map(ev => 
        ev.id === eventoParaEditar.id ? { ...ev, ...formData } : ev
      ));
      toast.success("Evento atualizado com sucesso!");
    } else {
      const eventoCriado: Evento = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
      };
      setEventos([eventoCriado, ...eventos]);
      toast.success("Evento cadastrado com sucesso!");
    }
    
    fecharModal();
  };

  const removerEvento = (id: string) => {
    setEventos(eventos.filter(e => e.id !== id));
    toast.success("Evento removido.");
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Eventos</h1>
          <p className="text-gray-600">Visualize e organize seus próximos eventos.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-sm"
        >
          <Plus size={20} /> Novo Evento
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-4 border border-gray-100">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nome ou local..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-400" />
          <select 
            className="border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="Todos">Todos os Status</option>
            <option value="Ativo">Ativo</option>
            <option value="Encerrado">Encerrado</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Evento</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Local</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((evento) => (
                  <tr key={evento.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{evento.nome}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{evento.data}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{evento.local}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        evento.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {evento.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          to={`/eventos/${evento.id}/configuracao`}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors flex items-center justify-center rounded-lg hover:bg-blue-50" 
                          title="Ver detalhes"
                        >
                          <Eye size={18} />
                        </Link>
                        <button 
                          onClick={() => prepararEdicao(evento)}
                          className="p-2 text-gray-400 hover:text-amber-600 transition-colors flex items-center justify-center rounded-lg hover:bg-amber-50" 
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => removerEvento(evento.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors flex items-center justify-center rounded-lg hover:bg-red-50" 
                          title="Remover"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400 font-medium">
                    Nenhum evento encontrado. 
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {eventoParaEditar ? 'Editar Evento' : 'Cadastrar Novo Evento'}
              </h2>
              <button onClick={fecharModal} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Evento</label>
                <input 
                  type="text" 
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  required 
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                  <input 
                    type="date" 
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    required 
                    value={formData.data}
                    onChange={(e) => setFormData({...formData, data: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select 
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Encerrado">Encerrado</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Local</label>
                <input 
                  type="text" 
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  required 
                  value={formData.local}
                  onChange={(e) => setFormData({...formData, local: e.target.value})}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={fecharModal}
                  className="flex-1 py-2 border border-gray-200 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm"
                >
                  {eventoParaEditar ? 'Salvar Alterações' : 'Criar Evento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}