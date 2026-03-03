import { useState, useMemo, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Users, Calendar, CheckCircle, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Evento, Participante } from '../types/index';

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-transform hover:scale-[1.02]">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <h3 className="text-2xl font-bold mt-1 text-gray-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${color} shadow-lg shadow-current/10`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  </div>
);

export function Dashboard() {
  const [eventos] = useState<Evento[]>(() => {
    const salvo = localStorage.getItem('@fade:eventos');
    return salvo ? JSON.parse(salvo) : [];
  });

  const [participantes] = useState<Participante[]>(() => {
    const salvo = localStorage.getItem('@fade:participantes');
    return salvo ? JSON.parse(salvo) : [];
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const totalInscritos = participantes.length;
  const eventosAtivos = eventos.filter(e => e.status === 'Ativo').length;
  const checkinsRealizados = participantes.filter(p => p.checkIn).length;
  
  const taxaPresenca = useMemo(() => {
    if (totalInscritos === 0) return '0%';
    const taxa = (checkinsRealizados / totalInscritos) * 100;
    return `${Math.round(taxa)}%`;
  }, [checkinsRealizados, totalInscritos]);

  const chartData = useMemo(() => {
    const horas = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];
    
    return horas.map((hora, index) => {
      const progresso = (index + 1) / horas.length;
      return {
        hora,
        total: Math.round(checkinsRealizados * progresso)
      };
    });
  }, [checkinsRealizados]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Olá, Organizador FADE</h1>
        <p className="text-gray-500 font-sans">Acompanhe o desempenho dos seus eventos em tempo real.</p>
      </div>

      {/* Grid Responsivo: 1 coluna no mobile, 2 no tablet (sm), 4 no desktop (lg) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Inscritos" value={totalInscritos.toLocaleString()} icon={Users} color="bg-blue-600" />
        <StatCard title="Eventos Ativos" value={eventosAtivos} icon={Calendar} color="bg-indigo-600" />
        <StatCard title="Check-ins Realizados" value={checkinsRealizados} icon={CheckCircle} color="bg-green-600" />
        <StatCard title="Taxa de Presença" value={taxaPresenca} icon={Clock} color="bg-amber-500" />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
          <h3 className="text-lg font-bold text-gray-900">Fluxo de Check-in (Hoje)</h3>
          <span className="text-[10px] w-fit font-semibold bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase tracking-wider">
            Atualizado Agora
          </span>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="hora" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Area type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Layout>
  );
}