import { useState, useMemo, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Search, ArrowLeftRight, CheckCircle2, XCircle, UserPlus, X, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Participante, Evento } from '../types/index';

const EVENTOS_MOCK: Evento[] = [
  { id: '1', nome: 'Workshop React FADE', data: '2026-03-10', local: 'Auditório A', status: 'Ativo' },
  { id: '2', nome: 'Simpósio de Tecnologia', data: '2026-03-15', local: 'Auditório B', status: 'Ativo' },
];

const PARTICIPANTES_MOCK: Participante[] = [
  { id: '1', nome: 'Rodrigo Campos', email: 'rodrigo@email.com', eventoVinculado: 'Workshop React FADE', checkIn: true },
  { id: '2', nome: 'Maria Silva', email: 'maria@email.com', eventoVinculado: 'Simpósio de Tecnologia', checkIn: false },
];

export function Participantes() {
  const [participantes, setParticipantes] = useState<Participante[]>(() => {
    const salvo = localStorage.getItem('@fade:participantes');
    return salvo ? JSON.parse(salvo) : PARTICIPANTES_MOCK;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [transferindo, setTransferindo] = useState<Participante | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novoParticipante, setNovoParticipante] = useState({ nome: '', email: '', eventoVinculado: EVENTOS_MOCK[0].nome });

  useEffect(() => {
    localStorage.setItem('@fade:participantes', JSON.stringify(participantes));
  }, [participantes]);

  const filteredParticipants = useMemo(() => {
    return participantes.filter(p => 
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [participantes, searchTerm]);

  const executarTransferencia = (novoEventoNome: string) => {
    if (!transferindo) return;
    setParticipantes(prev => prev.map(p => 
      p.id === transferindo.id ? { ...p, eventoVinculado: novoEventoNome } : p
    ));
    setTransferindo(null);
    toast.success("Participante transferido com sucesso!");
  };

  const handleCadastrar = (e: React.FormEvent) => {
    e.preventDefault();
    const criado: Participante = {
      ...novoParticipante,
      id: Math.random().toString(36).substr(2, 9),
      checkIn: false
    };
    setParticipantes([criado, ...participantes]);
    setIsModalOpen(false);
    setNovoParticipante({ nome: '', email: '', eventoVinculado: EVENTOS_MOCK[0].nome });
    toast.success("Participante cadastrado!");
  };

  const removerParticipante = (id: string) => {
    setParticipantes(prev => prev.filter(p => p.id !== id));
    toast.success("Participante removido.");
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Participantes</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all shadow-sm"
        >
          <UserPlus size={20} /> Novo Participante
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex gap-4 border border-gray-100">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs font-semibold uppercase">
            <tr>
              <th className="px-6 py-4">Nome</th>
              <th className="px-6 py-4">Evento Atual</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredParticipants.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{p.nome}</div>
                  <div className="text-xs text-gray-500">{p.email}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{p.eventoVinculado}</td>
                <td className="px-6 py-4">
                  {p.checkIn ? (
                    <span className="flex items-center gap-1 text-green-600 text-sm font-medium"><CheckCircle2 size={16}/> Confirmado</span>
                  ) : (
                    <span className="flex items-center gap-1 text-gray-400 text-sm"><XCircle size={16}/> Pendente</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => setTransferindo(p)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center"
                      title="Transferir Participante"
                    >
                      <ArrowLeftRight size={18} />
                    </button>
                    <button 
                      onClick={() => removerParticipante(p.id)}
                      className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center"
                      title="Remover Participante"
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Novo Participante</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-gray-400"/></button>
            </div>
            <form onSubmit={handleCadastrar} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input 
                  type="text" required
                  className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  value={novoParticipante.nome}
                  onChange={e => setNovoParticipante({...novoParticipante, nome: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input 
                  type="email" required
                  className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  value={novoParticipante.email}
                  onChange={e => setNovoParticipante({...novoParticipante, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vincular ao Evento</label>
                <select 
                  className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={novoParticipante.eventoVinculado}
                  onChange={e => setNovoParticipante({...novoParticipante, eventoVinculado: e.target.value})}
                >
                  {EVENTOS_MOCK.map(ev => (
                    <option key={ev.id} value={ev.nome}>{ev.nome}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors mt-4">
                Cadastrar
              </button>
            </form>
          </div>
        </div>
      )}

      {transferindo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Transferir Participante</h3>
              <button onClick={() => setTransferindo(null)}><X size={20}/></button>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Selecione o novo evento para <strong>{transferindo.nome}</strong>.
            </p>
            <div className="space-y-3">
              {EVENTOS_MOCK.map(evento => (
                <button
                  key={evento.id}
                  disabled={evento.nome === transferindo.eventoVinculado}
                  onClick={() => executarTransferencia(evento.nome)}
                  className="w-full text-left p-4 border border-gray-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="font-semibold text-gray-800">{evento.nome}</div>
                  <div className="text-xs text-gray-500">{evento.data} - {evento.local}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}