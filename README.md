## 👨‍💻 Sistema de Eventos (Painel do Organizador) - Desafio Técnico FADE

Aplicação web desenvolvida em React 19 e TypeScript para gerenciamento de eventos, participantes e configurações de check-in. Este projeto foi estruturado para atender aos critérios de alta maturidade técnica e escalabilidade exigidos no desafio técnico em questão.

### 💻 Tecnologias

1. React 19 & Vite v7: Usei as versões mais recentes para garantir que o sistema seja rápido e moderno.
2. TypeScript: Evita erros bobos de digitação e garante que os dados (como os dos participantes) estejam sempre corretos.
3. Tailwind CSS v4: Permite criar um visual bonito e profissional de forma muito rápida.
4. Context API: É o "cérebro" que controla quem está logado e protege as páginas restritas.
5. Recharts: Transforma os números de check-in em um gráfico fácil de entender no Dashboard.
6. React Hot Toast: Utilizado para criar feedbacks visuais e alertas de conflitos de regras, caso existam.

### 🛠️ Funcionalidades

Autenticação: Sistema de login que protege suas informações e garante que apenas pessoas autorizadas acessem o painel e os eventos.

Dashboard: Painel completo onde você vê, de cara, quantos eventos e participantes possui, além de um gráfico que mostra o movimento dos check-ins.

Gestão de Participantes: Pode-se buscar pessoas rapidamente por nome ou e-mail e tem a facilidade de transferir um participante de um evento para outro com apenas alguns cliques.

Configuração de Check-in:
- Regras dinâmicas, com QR Code, Documento, etc.
- Validador de janelas de tempo, impedindo conflitos entre regras obrigatórias com o mesmo intervalo de tempo (na mesma hora).
- Alertas visuais que notificam imediatamente o sistema ao detectar inconsistências na configuração.

### 🚀 Instalação e Uso

Primeiro, é necessário instalar as dependências:

```bash
npm install
```

Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

Acesse http://localhost:5173.

As credenciais administrativas para acessar o sistema, configuradas unicamente e especificamente para o desafio, são estas abaixo:

**🔐 E-mail**: admin@fade.org.br

**🔑 Senha**: 123456

### 📐 Arquitetura

O projeto utiliza uma estrutura modular separando componentes de UI, páginas de negócio e utilitários de validação (src/utils/checkinValidator.ts). Analogamente, a segurança é garantida por um componente PrivateRoute que pude criar ao longo do código que intercepta o acesso de usuários não autenticados.



Desenvolvido por: Rodrigo Campos - Estudante de Engenharia de Computação pela Escola Politécnica de Pernambuco (Poli-UPE)
