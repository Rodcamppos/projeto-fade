export interface RegraCheckin {
  id: string;
  nome: string;
  minutosAntes: number;
  minutosDepois: number;
  obrigatorio: boolean;
  ativo: boolean;
}

export interface Evento {
  id: string;
  nome: string;
  data: string;
  local: string;
  status: 'Ativo' | 'Encerrado';
}

export interface Participante {
  id: string;
  nome: string;
  email: string;
  eventoVinculado: string;
  checkIn: boolean;
}