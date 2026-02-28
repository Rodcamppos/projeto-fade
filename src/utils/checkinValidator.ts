import type { RegraCheckin } from '../types/index'; 

export const verificarConflitos = (regras: RegraCheckin[]): string | null => {
  const obrigatoriasAtivas = regras.filter(r => r.obrigatorio && r.ativo);
  
  if (obrigatoriasAtivas.length === 0) {
    return "Erro: Deve existir ao menos 1 regra obrigatória ativa."; 
  }

  for (let i = 0; i < obrigatoriasAtivas.length; i++) {
    for (let j = i + 1; j < obrigatoriasAtivas.length; j++) {
      const r1 = obrigatoriasAtivas[i];
      const r2 = obrigatoriasAtivas[j];

      if (r1.minutosAntes === r2.minutosAntes && r1.minutosDepois === r2.minutosDepois) {
        return `Conflito detectado: As regras "${r1.nome}" e "${r2.nome}" possuem a mesma janela de tempo.`;
      }
    }
  }
  return null;
};