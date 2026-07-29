# Central LTE — pacote de entrega para v0/Vercel

Data da revisão: 28 de julho de 2026.

## Escopo implementado

- Kanban da Central LTE com retorno de uma etapa, justificativa e auditoria.
- Conclusão de etapa com avanço automático para o próximo Kanban permitido.
- Fluxo operacional alinhado entre Operador, Coordenação e Financeiro.
- Importação e exportação de tarifas em planilha `.xls`/`.csv`, com validação de faixas.
- Perfil `representante_comercial`, criado por convite e restrito ao Journey.
- Autocadastro do entregador, iniciado como pendente e aprovado ou recusado pelo Operador.
- Suportes do entregador encaminhados ao Operador e vinculados a ocorrências da Central LTE.
- Área de repasses do entregador sem exposição de saldos e totais; permanece apenas o `Valor em aguardo`.
- Proteção reforçada da rota antiga `/solicitacaofinanceira` e dos acessos financeiros no banco.
- Permissões e notificações revisadas nos fluxos que encaminham solicitações ao Financeiro.

## Migrações novas

Aplicar na ordem:

1. `supabase/migrations/20260728210000_add_representante_comercial_role.sql`
2. `supabase/migrations/20260728210100_harden_operational_flows.sql`
3. `supabase/migrations/20260728210200_release_security_hardening.sql`

As migrações são aditivas e de segurança. Elas não apagam registros existentes.

## Validação local incluída

```bash
npm run validate:release
```

Essa validação verifica:

- sintaxe isolada dos arquivos TypeScript e TSX;
- resolução dos imports locais;
- estrutura básica das migrações;
- 23 contratos funcionais e de segurança desta entrega.

O teste SQL de metadados está em:

```text
tests/sql/release_operational_contracts.test.sql
```

Ele deve ser executado em ambiente de homologação após a aplicação das migrações.

## Instalação e build

O projeto possui `pnpm-lock.yaml` e `bun.lock`. Para um build reproduzível, prefira:

```bash
pnpm install --frozen-lockfile
pnpm validate:release
pnpm build
pnpm test
```

Configure as variáveis descritas em `.env.example` no ambiente do projeto. O arquivo `.env` original foi preservado no pacote para não alterar as informações existentes; não publique valores de ambiente em repositório público.

## Limites da validação realizada

O pacote enviado não continha `node_modules`, e o ambiente de revisão não possuía acesso ao registro de pacotes. Por isso, o build Vite e a suíte Playwright não puderam ser executados aqui. Também não havia conexão com a instância Supabase para aplicar as migrações e testar os fluxos contra dados reais.

Foram executadas validações estruturais, de sintaxe, imports, contratos funcionais, segurança estática e integridade do pacote. Antes da produção, execute build, Playwright e o teste SQL em homologação com as dependências e o banco conectados.
