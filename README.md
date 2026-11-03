# Portfólio — Victor Pontes

Portfólio pessoal desenvolvido para o CP3 da FIAP. O site apresenta meu perfil e projetos públicos do GitHub, oferece um formulário de contato e inclui um painel administrativo protegido.

- **Produção:** [vppontes.vercel.app](https://vppontes.vercel.app)
- **Repositório:** [github.com/vppontes/portifolio](https://github.com/vppontes/portifolio)

## Funcionalidades

- Perfil, competências e links profissionais.
- Listagem de repositórios públicos obtidos pela API do GitHub, com detalhes e estados de carregamento, erro e lista vazia.
- Cache das consultas do GitHub com TanStack Query.
- Formulário de contato com validação por campo e persistência das mensagens no Supabase.
- Login administrativo com Supabase Auth e painel protegido para consultar mensagens, marcá-las como respondidas e escolher projetos em destaque.
- Políticas Row Level Security (RLS) para restringir operações administrativas no banco.
- Tema claro/escuro com preferência salva no navegador.
- Interface responsiva e rotas de projetos.

> O formulário salva as mensagens no banco, mas não envia notificações por e-mail.

## Tecnologias

- React, TypeScript e Vite
- React Router DOM e TanStack Query
- Supabase Auth e PostgreSQL
- CSS
- Vitest e React Testing Library
- ESLint
- Vercel

## Executar localmente

**Requisitos:** Node.js 22.12 ou superior (ou 20.19 ou superior) e npm.

```bash
git clone https://github.com/vppontes/portifolio.git
cd portifolio/portfolio
npm install
```

Crie `.env.local` na raiz do projeto com as credenciais públicas do seu projeto Supabase:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_PUBLICA_ANON_OU_PUBLISHABLE
```

O arquivo `.env.local` é ignorado pelo Git. Use somente a chave pública `anon`/`publishable` no frontend; **nunca** use `service_role` ou uma chave `sb_secret_`.

Em seguida, aplique as migrations conforme a seção [Configurar o Supabase](#configurar-o-supabase) e inicie o servidor:

```bash
npm run dev
```

## Configurar o Supabase

No **Supabase → SQL Editor**, execute uma vez cada migration, nesta ordem:

1. [`202611020001_create_contact_messages.sql`](./supabase/migrations/202611020001_create_contact_messages.sql): cria as tabelas de mensagens e administradores e suas políticas RLS.
2. [`202611030001_create_featured_projects.sql`](./supabase/migrations/202611030001_create_featured_projects.sql): cria a tabela e as políticas RLS para os projetos em destaque.

Crie a conta administrativa em **Supabase → Authentication → Users**. Depois, no SQL Editor, troque o e-mail de exemplo pelo e-mail dessa conta e execute:

```sql
insert into public.portfolio_admins (user_id)
select id
from auth.users
where email = 'SEU_EMAIL'
on conflict do nothing;
```

O acesso ao painel é restrito a usuários autenticados incluídos em `portfolio_admins`. Não habilite cadastro público. As políticas RLS continuam sendo a proteção dos dados, além da proteção de rotas no frontend.

## Testes e verificações

```bash
npm test
npm run lint
npm run build
```

Os testes cobrem validação e envio do formulário, proteção de rotas, operações do painel e seleção dos projetos exibidos na Home.

## Deploy

O projeto é hospedado na Vercel e conectado ao repositório GitHub. A branch de produção é `main`; commits integrados nela iniciam um deploy automático. Para reproduzir a configuração:

1. Importe `vppontes/portifolio` na Vercel.
2. Configure `portfolio` como **Root Directory**.
3. Configure `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` nas variáveis do ambiente **Production** (e **Preview**, se necessário).
4. Use a branch `main` como branch de produção.
5. Execute o build com `npm run build`.

O [`vercel.json`](./vercel.json) reescreve rotas da aplicação para `index.html`, permitindo abrir e atualizar URLs internas diretamente em produção.

## Estrutura do projeto

```text
src/
  components/  Componentes reutilizáveis
  context/     Contextos de autenticação e tema
  pages/       Páginas e rotas
  services/    Integrações com GitHub e Supabase
  tests/       Testes automatizados
supabase/
  migrations/  Esquema e políticas do banco
```

## Performance

Em uma auditoria manual do Lighthouse para mobile na página inicial de produção, em 03/11/2026, o projeto obteve **96/100 em Performance**. A pontuação pode variar conforme rede, dispositivo e alterações futuras.
