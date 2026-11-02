# Portfólio CP3 FIAP

Portfólio de Victor Pontes desenvolvido com React, TypeScript e Vite.

## Funcionalidades

- Tema escuro e claro com preferência salva no navegador.
- Projetos públicos carregados da API do GitHub e armazenados em cache.
- Página individual de detalhes para cada projeto selecionado.
- Login administrativo preparado para Supabase.

## Desenvolvimento

```sh
npm install
npm run dev
```

O tema escuro é o padrão. O visitante pode alternar o tema pelo botão no cabeçalho; a preferência fica salva em `localStorage`.

Para habilitar o login administrativo, copie `.env.example` para `.env.local` e informe as credenciais públicas do projeto Supabase. Nunca use a chave `service_role` no frontend.

## Verificações

```sh
npm run lint
npm test
npm run build
```
