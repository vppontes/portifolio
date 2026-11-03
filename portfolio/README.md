# Portfólio CP3 FIAP

Portfólio de Victor Pontes desenvolvido com React, TypeScript e Vite.

## Funcionalidades

- Tema escuro e claro com preferência salva no navegador.
- Projetos públicos carregados da API do GitHub e armazenados em cache.
- Página individual de detalhes para cada projeto selecionado.
- Seleção de projetos em destaque pelo painel administrativo, exibida na página inicial.
- Formulário de contato com validação e persistência no Supabase.
- Login administrativo preparado para Supabase.

## Desenvolvimento

```sh
npm install
npm run dev
```

O tema escuro é o padrão. O visitante pode alternar o tema pelo botão no cabeçalho; a preferência fica salva em `localStorage`.

Para habilitar o login administrativo, copie `.env.example` para `.env.local` e informe as credenciais públicas do projeto Supabase. Nunca use a chave `service_role` no frontend.

## Supabase

1. Copie `.env.example` para `.env.local` e preencha as credenciais públicas do projeto Supabase. Esse arquivo fica ignorado pelo Git.
2. Aplique, em ordem, as migrations em `supabase/migrations/` pelo Supabase SQL Editor.
3. Crie a conta administrativa no Supabase Auth e, no SQL Editor, inclua seu usuário na tabela:

   ```sql
   insert into public.portfolio_admins (user_id)
   select id from auth.users where email = 'SEU_EMAIL'
   on conflict do nothing;
   ```

   Não habilite cadastro público.
4. Entre em `/login`, abra o painel e use a seção **Projetos em destaque** para escolher os repositórios que aparecem na página inicial.

## Verificações

```sh
npm run lint
npm test
npm run build
```
