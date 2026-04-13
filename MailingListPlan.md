
# Mailing List — Made in Bugs

## Documento de Implementação

---

## 1. Overview

O estúdio Made in Bugs precisa de um sistema de newsletter integrado à página do jogo Asumi para capturar emails antes da publicação da Steam page no final do mês.

O sistema consiste em:

- Um formulário de email visível diretamente na página do jogo, no projeto /asumi
- Double opt-in (confirmação por email)
- Modal pós-inscrição para coleta de preferências opcionais
- Três listas segmentadas (Asumi, Studio, Devlog)
- Proteção contra bots e spam

O fluxo do usuário é:

1. Vê o formulário na página do Asumi → digita email → clica "Enviar"
2. Vê modal de sucesso com checkboxes opcionais → escolhe preferências (ou não)
3. Recebe email de confirmação → clica no link
4. É redirecionado para página de confirmação no site
5. Passa a receber newsletters das listas em que está inscrito

---

## 2. Tech Stack

| Camada | Ferramenta | Função |
|---|---|---|
| Frontend | Next.js (existente) | Formulário, modal, página de confirmação |
| Backend | Next.js API Routes | Proxy entre frontend e Brevo, validação, rate limiting |
| Armazenamento + envio | Brevo | Fonte única de verdade: contatos, listas, atributos, emails transacionais e campanhas |
| Proteção anti-spam | Honeypot + rate limiting in-memory | Sem dependência externa, sem fricção para o usuário |
| i18n | Sistema de i18n existente do site | Strings em pt-BR e en |

---

## 3. Detalhes de Implementação

### 3.1 Brevo — Estrutura de dados

**Listas (3):**

- `Asumi` — todos os inscritos recebem automaticamente
- `Studio` — opt-in manual via modal
- `Devlog` — opt-in manual via modal

**Atributos customizados no contato:**

- `CONFIRMED` (Boolean) — se completou double opt-in
- `CONFIRMATION_TOKEN` (Text) — UUID para validar o clique de confirmação
- `CONFIRMATION_CREATED_AT` (DateTime) — timestamp de criação do token para controle de expiração
- `LOCALE` (Text) — idioma do usuário no momento da inscrição (`pt-BR` ou `en`)

**Regras de negócio:**

- Campanhas devem ser enviadas apenas para contatos onde `CONFIRMED = true`
- O `CONFIRMATION_TOKEN` é válido por 48 horas após `CONFIRMATION_CREATED_AT`. Após isso, o endpoint `/confirm` retorna status `expired` e o usuário precisa se inscrever novamente
- Todo email (transacional e campanha) deve conter link de unsubscribe no rodapé — obrigatório pela LGPD e GDPR. O Brevo adiciona automaticamente nas campanhas; o template transacional de confirmação também deve incluir

### 3.2 Comportamento de reinscrição

| Cenário | Comportamento |
|---|---|
| Email novo | Cria contato, envia confirmação |
| Email existente, `CONFIRMED=false` | Gera novo token, atualiza `CONFIRMATION_CREATED_AT`, reenvia email de confirmação |
| Email existente, `CONFIRMED=true` | Retorna sucesso silenciosamente. Não envia email. Não altera listas. Não vaza que o email já existe |
| Email com unsubscribe prévio | Mesmo comportamento de `CONFIRMED=true` — retorna sucesso sem ação. Respeita a decisão do usuário |

### 3.3 API Routes (3 endpoints)

**`POST /api/newsletter/subscribe`**

- Recebe: `email`, `locale`, `honeypot`
- Valida input (formato email, honeypot vazio, rate limit por IP via Upstash Redis)
- Busca contato no Brevo para verificar cenário de reinscrição (ver tabela acima)
- Se for inscrição nova ou reenvio: cria/atualiza contato no Brevo com lista Asumi, `CONFIRMED=false`, token UUID, `CONFIRMATION_CREATED_AT=now`
- Envia email transacional de confirmação via Brevo SMTP
- Sempre retorna sucesso (mesmo para duplicatas/existentes, para não vazar informação)

**`GET /api/newsletter/confirm`**

- Recebe: `token` e `email` como query params
- Busca contato no Brevo, valida que o token bate
- Verifica expiração: se `CONFIRMATION_CREATED_AT` + 48h < agora, retorna status `expired`
- Se já confirmado, redireciona com status `already`
- Se válido: atualiza `CONFIRMED=true`, limpa token e `CONFIRMATION_CREATED_AT`
- Redireciona para página de confirmação no site com status apropriado

**`POST /api/newsletter/preferences`**

- Recebe: `email` e `tags[]` (subset de `['studio', 'devlog']`)
- Rate limit por IP
- Adiciona o contato nas listas correspondentes no Brevo
- Chamado pelo modal de preferências logo após a inscrição

### 3.4 Rate Limiting

> ⚠️ Rate limiting in-memory não persiste entre invocações serverless na Vercel. Cada request pode rodar em uma instância diferente, tornando contadores em memória inúteis.

**Solução:** Upstash Redis (free tier: 10k requests/dia).

- `POST /subscribe`: máximo 3 requests por IP por janela de 60 segundos
- `POST /preferences`: máximo 5 requests por IP por janela de 60 segundos
- Usar o pacote `@upstash/ratelimit` que já integra com Vercel nativamente

**Alternativa aceita no curto prazo:** se a urgência for crítica e o setup do Upstash atrasar, confiar temporariamente no rate limit nativo da API do Brevo + honeypot. O volume pré-lançamento é baixo o suficiente para que o risco seja mínimo. Mas o Upstash deve ser implementado antes de qualquer divulgação pública do link.

### 3.5 Componentes Frontend (3)

**`NewsletterSection`**

- Wrapper que renderiza título, subtítulo, formulário e controla a exibição do modal
- Gerencia o estado do fluxo: `idle` → `submitting` → `success` (mostra modal) → `done`

**`NewsletterForm`**

- Input de email + campo honeypot invisível + botão de envio
- Honeypot: campo oculto via CSS (`position: absolute; left: -9999px; opacity: 0`), não via `display:none` nem `visibility:hidden` — bots modernos detectam esses
- Validação client-side antes de enviar (feedback visual inline)
- Estados visuais: idle, loading (spinner no botão), erro de validação
- Responsivo: input e botão em linha no desktop, empilhados no mobile

**`PreferencesModal`**

- Overlay/modal exibido após inscrição bem-sucedida
- Mostra "✅ Inscrito com sucesso!" + duas checkboxes (Studio, Devlog)
- Dois botões: "Sim, quero!" (envia preferências) e "Não, obrigado" (fecha)
- Se nenhuma checkbox marcada e clicar "Sim, quero!", trata como "Não, obrigado"

### 3.6 Página de confirmação

- Rota: `/{locale}/newsletter/confirmed`
- Renderiza mensagem baseada no query param `status`:
  - `success` → "Inscrição confirmada! Você receberá novidades sobre o Asumi."
  - `already` → "Você já confirmou sua inscrição anteriormente."
  - `expired` → "Link expirado. Por favor, inscreva-se novamente."
  - `invalid` → "Link inválido."
  - `error` → "Algo deu errado. Tente se inscrever novamente."
- Link/botão para voltar à página do Asumi
- Suporte a i18n (pt-BR e en)

### 3.7 i18n

- Todas as strings do formulário, modal e página de confirmação nos arquivos de tradução existentes
- O locale é enviado junto com a inscrição para que o email de confirmação chegue no idioma correto
- O redirect pós-confirmação respeita o locale do contato salvo no Brevo

### 3.8 Conformidade legal (LGPD / GDPR)

- **Double opt-in** garante consentimento explícito
- **Link de unsubscribe** em todo email — Brevo adiciona automaticamente nas campanhas; confirmar que o template transacional também inclui
- **Não vazar existência de emails** — endpoint de subscribe sempre retorna sucesso
- **Respeitar unsubscribe** — não reinscrever automaticamente quem saiu

---

## 4. Fases de Implementação

### Fase 1 — Setup do Brevo

**Descrição:**
Configurar toda a estrutura no painel do Brevo antes de escrever qualquer código.

**Tarefas:**

- Criar as 3 listas: Asumi, Studio, Devlog
- Anotar os IDs numéricos de cada lista
- Criar os atributos customizados: `CONFIRMED` (Boolean), `CONFIRMATION_TOKEN` (Text), `CONFIRMATION_CREATED_AT` (DateTime), `LOCALE` (Text)
- Verificar/configurar o domínio de envio (`madeinbugs.com.br`) com SPF, DKIM e DMARC para que os emails não caiam em spam
- Testar envio de um email transacional manualmente pelo painel para confirmar que o domínio funciona
- Gerar uma API key com permissões de contatos e SMTP transacional

**Acceptance criteria:**

- [X] 3 listas criadas com IDs anotados
- [X] 4 atributos customizados existem no painel
- [X] Domínio verificado e autenticado (SPF/DKIM passando)
- [X] Email de teste enviado e recebido (não em spam)
- [X] API key gerada e funcionando (testar com curl)

BREVO_LIST_ASUMI=5
BREVO_LIST_STUDIO=6
BREVO_LIST_DEVLOG=7
BREVO_API_KEY adicionado no .env.local

---

### Fase 2 — API Routes

**Descrição:**
Implementar os 3 endpoints no Next.js que fazem a ponte entre o frontend e o Brevo.

**Tarefas:**

- Criar o wrapper da API do Brevo (`lib/brevo.ts`) com funções: criar contato, atualizar contato, buscar contato, enviar email transacional
- Criar o utilitário de rate limiting in-memory (`lib/rate-limit.ts`)
- Implementar `POST /api/newsletter/subscribe` com validação, honeypot, rate limit, criação de contato e envio de email de confirmação
- Implementar `GET /api/newsletter/confirm` com validação de token, atualização do contato e redirect
- Implementar `POST /api/newsletter/preferences` com atualização de listas
- Criar o template HTML do email de confirmação (inline CSS, responsivo, pt-BR e en)
- Adicionar variáveis de ambiente no `.env.local` e no painel da Vercel

**Acceptance criteria:**

- [ ] `POST /subscribe` com email válido → contato aparece no Brevo com `CONFIRMED=false` na lista Asumi
- [ ] Email de confirmação chega na caixa de entrada (não spam) com link funcional
- [ ] `GET /confirm` com token correto → contato atualizado para `CONFIRMED=true` no Brevo
- [ ] `GET /confirm` com token errado → redireciona para página de erro
- [ ] `GET /confirm` repetido → redireciona para "já confirmado"
- [ ] `POST /preferences` com `['studio', 'devlog']` → contato adicionado nas 2 listas no Brevo
- [ ] Honeypot preenchido → retorna sucesso sem criar contato
- [ ] 4+ requests do mesmo IP em 1 minuto → retorna 429
- [X] Todas as variáveis de ambiente configuradas na Vercel

---

### Fase 3 — Componentes Frontend

**Descrição:**
Criar os componentes React que compõem a interface de inscrição na página do Asumi.

**Tarefas:**

- Criar `NewsletterForm` com input de email, campo honeypot oculto (via CSS, não `display:none` — bots detectam), botão de envio com estados de loading
- Criar `PreferencesModal` com as checkboxes e botões de ação
- Criar `NewsletterSection` que orquestra o fluxo e renderiza título + subtítulo + form + modal
- Integrar as strings de i18n nos arquivos de tradução existentes
- Estilizar tudo consistente com o visual do site (cores, fontes, espaçamento)
- Garantir layout responsivo: testar em 320px, 375px, 768px e 1440px
- Adicionar a seção na página do Asumi, abaixo do trailer e screenshots

**Acceptance criteria:**

- [ ] Formulário visível na página do Asumi sem precisar clicar em nada
- [ ] Input valida email no client-side antes de enviar (feedback visual inline)
- [ ] Botão mostra estado de loading durante a requisição
- [ ] Após envio bem-sucedido, modal aparece com checkboxes e botões
- [ ] "Sim, quero!" com checkboxes marcadas → chama `/api/newsletter/preferences` e fecha modal
- [ ] "Não, obrigado" → fecha modal sem chamada extra
- [ ] Tudo funciona em pt-BR e en
- [ ] Layout não quebra em nenhuma largura de 320px a 1440px
- [ ] Campo honeypot é invisível para humanos mas preenchível por bots

---

### Fase 4 — Página de Confirmação

**Descrição:**
Criar a página para onde o usuário é redirecionado após clicar no link de confirmação do email.

**Tarefas:**

- Criar rota `/{locale}/newsletter/confirmed` (ou dentro da estrutura de rotas existente)
- Renderizar mensagem baseada no query param `status`:
  - `success` → "Inscrição confirmada! Você receberá novidades sobre o Asumi."
  - `already` → "Você já confirmou sua inscrição anteriormente."
  - `invalid` → "Link inválido ou expirado."
  - `expired` → "Link expirado. Por favor, inscreva-se novamente."
  - `error` → "Algo deu errado. Tente se inscrever novamente."
- Incluir link/botão para voltar à página do Asumi
- Estilizar consistente com o restante do site
- Suporte a i18n (pt-BR e en)

**Acceptance criteria:**

- [ ] Cada status renderiza a mensagem correta
- [ ] Página funciona em pt-BR e en
- [ ] Link de volta para a página do Asumi funciona
- [ ] Página tem visual consistente com o site
- [ ] URL inválida (sem status ou status desconhecido) mostra mensagem genérica de erro

---

### Fase 5 — Testes e QA

**Descrição:**
Testar o fluxo completo end-to-end antes de ir para produção.

**Tarefas:**

- Testar fluxo completo: inscrição → email chega → clicar link → confirmação → contato atualizado no Brevo
- Testar com preferências: marcar Studio + Devlog → verificar listas no Brevo
- Testar sem preferências: clicar "Não, obrigado" → contato só na lista Asumi
- Testar email duplicado: deve atualizar, não duplicar
- Testar proteções: honeypot, rate limiting, email inválido
- Testar em mobile real (não apenas DevTools)
- Testar em Gmail, Outlook e Apple Mail (email de confirmação renderiza corretamente)
- Testar os dois idiomas end-to-end
- Verificar que o email de confirmação não cai em spam (checar score no mail-tester.com)
- Deploy em preview na Vercel e testar antes de ir para produção

**Acceptance criteria:**

- [ ] Fluxo completo funciona sem erros em produção
- [ ] Email de confirmação chega em < 30 segundos
- [ ] Email não cai na pasta de spam no Gmail e Outlook
- [ ] Formulário funciona em mobile (iOS Safari e Chrome Android)
- [ ] Rate limit funciona em produção
- [ ] Contatos aparecem corretamente no painel do Brevo com listas e atributos corretos
- [ ] Nenhum erro no console do browser
- [ ] Nenhum erro nos logs da Vercel
