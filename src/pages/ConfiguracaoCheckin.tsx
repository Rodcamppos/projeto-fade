import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { verificarConflitos } from '../utils/checkinValidator';
import { AlertTriangle, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { RegraCheckin } from '../types/index';

export function ConfiguracaoCheckin() {
  const { id } = useParams();
  
  const [regras, setRegras] = useState<RegraCheckin[]>([
    { id: '1', nome: 'QR Code', minutosAntes: 30, minutosDepois: 60, obrigatorio: true, ativo: true },
  ]);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const mensagemErro = verificarConflitos(regras);
    setErro(mensagemErro);
    
    if (mensagemErro) {
      toast.error(mensagemErro, { id: 'conflito-regra' });
    }
  }, [regras]);
  
  const toggleRegra = (id: string) => {
    setRegras(regras.map(r => r.id === id ? { ...r, ativo: !r.ativo } : r));
  };

  const adicionarRegra = () => {
    const nova: RegraCheckin = {
      id: Math.random().toString(36).substr(2, 9),
      nome: 'Nova Regra de Validação',
      minutosAntes: 15,
      minutosDepois: 15,
      obrigatorio: false,
      ativo: true
    };
    setRegras([...regras, nova]);
    toast.success("Regra adicionada com sucesso!");
  };

  const removerRegra = (regraId: string) => {
    if (regras.length <= 1) {
      toast.error("O sistema exige ao menos uma regra configurada.");
      return;
    }
    setRegras(regras.filter(r => r.id !== regraId));
    toast.success("Regra removida.");
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Regras de Check-in</h1>
          <p className="text-sm text-gray-500">Evento ID: {id}</p>
        </div>
        <button 
          onClick={adicionarRegra}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={20} /> Adicionar Regra
        </button>
      </div>

      {erro && (
        <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-500 flex items-center gap-3 text-amber-800 animate-in fade-in slide-in-from-left-2">
          <AlertTriangle size={20} className="shrink-0" />
          <p className="font-medium">{erro}</p>
        </div>
      )}

      <div className="grid gap-4">
        {regras.map((regra) => (
          <div 
            key={regra.id} 
            className={`p-6 bg-white rounded-xl shadow-sm border-2 transition-all ${
              regra.ativo ? 'border-transparent' : 'border-gray-100 opacity-60 bg-gray-50'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Nome da Regra</label>
                  <input 
                    className="w-full font-bold text-gray-700 outline-none border-b border-transparent focus:border-blue-500 bg-transparent"
                    value={regra.nome}
                    onChange={(e) => setRegras(regras.map(r => r.id === regra.id ? {...r, nome: e.target.value} : r))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Minutos Antes</label>
                  <input 
                    type="number" 
                    className="w-full border-gray-200 border rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 outline-none" 
                    value={regra.minutosAntes}
                    onChange={(e) => setRegras(regras.map(r => r.id === regra.id ? {...r, minutosAntes: Number(e.target.value)} : r))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Minutos Depois</label>
                  <input 
                    type="number" 
                    className="w-full border-gray-200 border rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 outline-none" 
                    value={regra.minutosDepois}
                    onChange={(e) => setRegras(regras.map(r => r.id === regra.id ? {...r, minutosDepois: Number(e.target.value)} : r))}
                  />
                </div>
                <div className="flex items-center gap-3 pt-4 md:pt-6">
                  <input 
                    type="checkbox" 
                    id={`obrigatorio-${regra.id}`}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    checked={regra.obrigatorio}
                    onChange={() => setRegras(regras.map(r => r.id === regra.id ? {...r, obrigatorio: !r.obrigatorio} : r))}
                  />
                  <label htmlFor={`obrigatorio-${regra.id}`} className="text-sm font-medium text-gray-600 cursor-pointer">Obrigatória</label>
                </div>
              </div>
              
              <div className="flex gap-3 ml-4">
                <button 
                  onClick={() => toggleRegra(regra.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                    regra.ativo ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                  }`}
                >
                  {regra.ativo ? 'ATIVA' : 'INATIVA'}
                </button>
                <button 
                  onClick={() => removerRegra(regra.id)}
                  className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Remover regra"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}