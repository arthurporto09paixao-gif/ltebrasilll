# Correção de exclusão de convites no Vercel

## Falha corrigida

A ação de exclusão usava uma Server Function protegida por token Supabase enviado apenas no cabeçalho `Authorization`. Em produção, esse cabeçalho podia chegar alterado à função, causando `Unauthorized: Invalid token`.

## Ajustes realizados

- O token autenticado também é enviado em `X-Supabase-Access-Token`.
- A função do servidor prioriza o cabeçalho dedicado e mantém `Authorization` como fallback.
- A sessão é atualizada automaticamente quando estiver próxima do vencimento.
- O servidor valida o usuário com o Supabase antes de executar operações administrativas.
- Convites ainda pendentes são excluídos diretamente pelo cliente autenticado e pelas políticas RLS, sem usar a chave administrativa.
- Convites já aceitos continuam usando a função protegida do servidor, pois a exclusão também pode remover o usuário autenticado.
- Mensagens técnicas em inglês foram substituídas por mensagens claras de sessão expirada.

## Variáveis necessárias no Vercel

Configure em Production e Preview:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

A variável `SUPABASE_SERVICE_ROLE_KEY` deve existir apenas no servidor e nunca pode receber prefixo `VITE_`.

## Após importar/publicar

1. Configure as variáveis na Vercel.
2. Gere um novo deploy, pois alterações de variáveis não corrigem deployments antigos.
3. Saia e entre novamente no sistema para renovar a sessão.
4. Teste a exclusão de um convite pendente.
5. Teste separadamente um convite aceito em ambiente de homologação.
