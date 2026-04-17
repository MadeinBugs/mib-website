# Plano de Implementação: Picture Contest Gallery (v2)

## Contexto

Sistema de galeria administrativa para um photo contest de build de festival de um jogo indie. Durante o gameplay, jogadores tiram screenshots que são automaticamente enviadas para um projeto Supabase dedicado. Cada jogador é identificado por um código único de 5 letras (ex: `BAKOM`, `TIRUP`) gerado automaticamente no jogo. O site precisa exibir essas fotos numa galeria com estética de polaroid, agrupadas por sessão de jogador.

Este projeto **não tem relação** com o projeto `/mascot`. Usará uma nova rota `/picture-contest`.

---

## Estrutura do Banco de Dados (já existente no Supabase)

### Tabela `contest_sessions`
Uma linha por jogador. Criada no momento em que o jogador tira sua primeira foto.

- `unique_id` — TEXT, chave primária. O código de 5 letras do jogador (ex: `BAKOM`)
- `created_at` — TIMESTAMPTZ, gerado automaticamente no insert
- `game_version` — TEXT, versão do jogo no momento da sessão
- `machine_id` — TEXT, identificador do booth/PC onde foi jogado (ex: `booth-1`)

### Tabela `contest_pictures`
Uma linha por foto confirmada pelo jogador.

- `id` — BIGSERIAL, chave primária autoincrementada
- `unique_id` — TEXT, foreign key referenciando `contest_sessions.unique_id`
- `filename` — TEXT, nome do arquivo (ex: `BAKOM_2026-04-17_14-32-01_001.png`)
- `storage_path` — TEXT, caminho do arquivo no bucket (ex: `BAKOM/BAKOM_2026-04-17_14-32-01_001.png`). **Campo principal para acessar as imagens.**
- `picture_index` — INT, índice sequencial da foto dentro da sessão (começa em 1)
- `taken_at` — TIMESTAMPTZ, momento exato em que a foto foi tirada no jogo
- `uploaded_at` — TIMESTAMPTZ, momento em que o upload foi concluído
- `metadata` — JSONB, dump completo do objeto `PictureInfo` do jogo (animais, espécies, estado comportamental, hora do dia no jogo, estruturas do santuário). **Dado rico — deve ser exibido no modal para auxiliar no julgamento.**
- `image_url` — TEXT, nullable, sempre NULL. Coluna legada, ignorar.

### Storage Bucket
- Nome: `contest-pictures`
- Visibilidade: **privado**
- Organização: `{unique_id}/{filename}` — cada sessão tem sua própria pasta
- As imagens **não têm URL pública**. Todo acesso via signed URLs

---

## ⚠️ Pré-checagens Antes de Começar

### 1. Verificar plano do Supabase
- **Se Pro ou superior:** pode usar transforms (thumbnails via `transform: { width, quality }`)
- **Se Free:** servir imagens em full-res; confiar no lazy loading do `<Image>` do Next.js
- Isso afeta a estratégia de performance — verificar antes da Fase 3

### 2. Confirmar que o projeto `/mascot` usa autenticação admin
- O plano reutiliza o padrão de proteção do `/mascot`
- Se o `/mascot` não tiver auth, considerar implementar do zero seguindo o mesmo estilo visual

---

## Autenticação e Permissões

### Contexto
Este é um projeto Supabase **separado** do já existente no site. O site já tem um projeto Supabase configurado com as variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` para o projeto `/mascot`.

Para evitar colisões, as variáveis do Picture Contest devem usar prefixo próprio:

```
NEXT_PUBLIC_PICTURE_CONTEST_SUPABASE_URL
NEXT_PUBLIC_PICTURE_CONTEST_SUPABASE_ANON_KEY
```

Essas variáveis devem ser configuradas tanto no `.env.local` quanto no painel da Vercel.

> ⚠️ **Importante:** Nunca use `SERVICE_ROLE_KEY` com prefixo `NEXT_PUBLIC_`. A service role bypassa RLS e deve permanecer apenas no backend/jogo.

### Estratégia de Autenticação
Usar **Supabase Auth** com usuário admin criado manualmente no painel (Authentication → Users → Invite). Site faz login com email/senha via Supabase JS client. Após autenticado, o client envia o JWT automaticamente nas requests.

### Políticas de RLS a aplicar

> ⚠️ **Não dropar a política existente.** A service role bypassa RLS por padrão, mas por segurança é melhor apenas **adicionar** a nova política sem remover a antiga. RLS com múltiplas políticas funciona como OR.

```sql
-- Adicionar nova política a contest_sessions (sem remover a existente)
CREATE POLICY "Authenticated users can read sessions" ON contest_sessions
    FOR SELECT TO authenticated USING (true);

-- Adicionar nova política a contest_pictures (sem remover a existente)
CREATE POLICY "Authenticated users can read pictures" ON contest_pictures
    FOR SELECT TO authenticated USING (true);
```

### Política de Storage
O bucket `contest-pictures` também precisa permitir leitura para usuários autenticados:

```sql
CREATE POLICY "Authenticated users can read pictures from bucket"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'contest-pictures');
```

### Teste pós-aplicação de RLS
Após aplicar as políticas, **testar explicitamente**:
1. Que o jogo (service role) ainda consegue fazer INSERT normalmente
2. Que usuário autenticado consegue SELECT nas tabelas e bucket
3. Que usuário não autenticado é bloqueado

---

## Acesso às Imagens (Signed URLs)

### Estratégia: Usar `createSignedUrls` (plural)
Para evitar múltiplas requests sequenciais em galerias com várias fotos, **sempre usar a versão plural**:

```js
// ✅ Correto: 1 request só, N URLs retornadas
const paths = pictures.map(p => p.storage_path)
const { data } = await supabase.storage
  .from('contest-pictures')
  .createSignedUrls(paths, 604800) // 7 dias

// ❌ Errado: N requests sequenciais
for (const pic of pictures) {
  const { data } = await supabase.storage.createSignedUrl(...)
}
```

### Expiração: 7 dias (604800 segundos)
- Galeria admin tem uso esporádico/prolongado
- Evita quebrar imagens se a aba ficar aberta overnight
- Não é dado sensível (arte do jogo), então expiração longa é aceitável

### Thumbnails (apenas se plano Supabase Pro)
Se o projeto tiver plano Pro, usar transforms para thumbnails em cards:

```js
// Plano Pro: thumbnail otimizado
const { data } = await supabase.storage
  .from('contest-pictures')
  .createSignedUrls(paths, 604800, {
    transform: { width: 400, quality: 80 }
  })
```

Se plano Free: servir full-res e confiar no lazy loading.

### Configurar Next.js para aceitar URLs do Supabase
Adicionar ao `next.config.js`:

```js
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' }
    ]
  }
  // ...outros configs
}
```

**Sem isso, `<Image>` do Next.js vai rejeitar as URLs assinadas.**

---

## Estrutura do Projeto Next.js

### Dependências a instalar

```bash
npm install @supabase/supabase-js @supabase/ssr
```

> ⚠️ Se o projeto já tem `@supabase/supabase-js` instalado para o projeto `/mascot`, usar a mesma versão para evitar conflitos.

### Variáveis de Ambiente

Adicionar ao `.env.local` (e na Vercel):

```env
# Já existentes (mascot project)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Novas (picture contest project)
NEXT_PUBLIC_PICTURE_CONTEST_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_PICTURE_CONTEST_SUPABASE_ANON_KEY=eyJhbGc...
```

### Estrutura de arquivos

```
src/
├── app/
│   └── [locale]/
│       └── picture-contest/
│           ├── layout.tsx         # Layout com proteção de auth
│           ├── page.tsx           # Lista de sessões (grid de polaroids)
│           ├── login/
│           │   └── page.tsx        # Tela de login
│           └── [uniqueId]/
│               └── page.tsx        # Galeria de uma sessão
├── lib/
│   └── supabase/
│       ├── picture-contest-client.ts   # Browser client
│       └── picture-contest-server.ts   # Server client
├── components/
│   └── picture-contest/
│       ├── LoginForm.tsx           # Formulário de login (client)
│       ├── SessionGrid.tsx         # Grid de sessões (client)
│       ├── SessionCard.tsx         # Card individual de sessão
│       ├── PolaroidCard.tsx        # Componente polaroid
│       ├── PictureGallery.tsx      # Galeria de uma sessão
│       └── PictureModal.tsx        # Modal tela cheia (reutilizar ProjectImageVisualization)
```

---

## Autenticação e Layout Protegido

### Reutilizar padrão do projeto `/mascot`

O projeto `/mascot` já possui autenticação admin para a galeria de artistas. Usar a **mesma estrutura de layout** e padrão de proteção:

- Mesmo componente de layout
- Mesma lógica de verificação de sessão
- Mesma experiência de redirecionamento para login se não autenticado

A única diferença é que o cliente Supabase usado será o do picture contest (com as novas env vars), não o do mascot.

### Fluxo de autenticação

```
1. Usuário acessa /picture-contest/*
2. Layout verifica se há sessão ativa
3. Se não → redireciona para /picture-contest/login
4. Se sim → permite acesso à galeria
5. Após login bem-sucedido → redireciona de volta para /picture-contest
```

---

## Páginas e Componentes

### `/picture-contest/login`
- Formulário com email + senha
- Usa Supabase Auth do projeto picture-contest
- Em caso de erro: mostra mensagem
- Em caso de sucesso: redireciona para `/picture-contest`
- Mesma estética do site (seguir padrão visual existente)
- Suporte i18n (pt-BR e en)

/picture-contest (lista de sessões) — continuação

Server component que busca sessões via RLS
Query: todas as sessões ordenadas por created_at DESC
Para cada sessão, mostra:

Unique ID (código de 5 letras) em destaque
Data/hora da sessão
Machine ID (booth)
Contagem de fotos
Preview da primeira foto (usando createSignedUrls para gerar todas as previews numa única request)


Layout: grid de cards estilizados como "pastas" ou "envelopes" de polaroid
Click numa sessão → navega para /picture-contest/[uniqueId]

/picture-contest/[uniqueId] (galeria de uma sessão)

Server component
Query: todas as fotos da sessão, ordenadas por picture_index ASC
Usar createSignedUrls (plural) para gerar todas as URLs numa única request
Renderiza grid de polaroids
Botão de voltar para lista de sessões
Mostra metadata da sessão (unique_id, data, booth)

Componente PolaroidCard
Estética fundamental. Deve seguir:
Visual:

Fundo branco (#FFFFFF ou off-white #FAFAF5)
Borda superior e laterais: ~15px
Borda inferior grossa: ~60-80px (espaço para "escrever")
Box-shadow suave: 0 4px 12px rgba(0,0,0,0.15)
Rotação determinística leve baseada no ID (NÃO usar Math.random() no render)

Rotação determinística:
ts// Hash simples do identificador → ângulo entre -3 e +3
function getRotation(id: string): number {
  const hash = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return ((hash % 7) - 3) // -3 a +3
}

// Uso no componente
<div style={{ transform: `rotate(${getRotation(picture.id.toString())}deg)` }}>
Isso garante que a rotação é estável entre renders e entre server/client (evita hydration mismatch).
Conteúdo:

Imagem ocupando a área superior (aspect ratio 1:1 ou 4:3)
Filename (ou label curto) escrito na borda inferior
Fonte manuscrita (usar a fonte manuscrita existente do site, ex: Caveat, Kalam, ou similar)
Texto discreto e centralizado

Interações:

Hover: aumenta levemente (scale(1.05)) + reduz rotação (rotate(0deg)) + sombra mais forte
Transição suave (transition: all 0.3s ease)
Click: abre modal de visualização em tela cheia

Layout no grid:

Grid com gap generoso (~2rem)
Responsivo: mobile mostra 1-2 colunas, desktop 3-4
Fundo da página com cor sólida neutra ou textura sutil (cortiça, papel kraft, ou limpo)

Componente PictureModal

Reutilizar ProjectImageVisualization já existente no site
Mesma UX/UI que outras galerias do site
Fechar com ESC ou click fora
Mostrar filename

Exibição de metadata (importante para julgamento):
O metadata JSONB tem informação rica que deve ser exibida no modal. Exemplos de dados que podem estar no JSON:

Animais fotografados (lista de espécies)
Estado comportamental dos animais
Hora do dia no jogo
Estruturas do santuário visíveis
Outros critérios de julgamento

Layout sugerido no modal:
text┌──────────────────────────────────────┐
│                                      │
│        [Imagem em tela cheia]        │
│                                      │
├──────────────────────────────────────┤
│ BAKOM_2026-04-17_14-32-01_001.png    │
│ Tirada em 17/04 às 14:32             │
├──────────────────────────────────────┤
│ 📋 Metadata                          │
│ • Animais: Capivara, Tucano          │
│ • Hora do jogo: Manhã                │
│ • Estruturas: Comedouro, Bebedouro   │
│ • ...                                │
└──────────────────────────────────────┘
Renderizar o metadata de forma genérica (ex: key-value pairs) se o schema do JSONB for flexível.

Performance e UX
Lazy Loading

Usar <Image> do Next.js com loading="lazy"
Imagens fora do viewport não carregam até aproximarem
Priority apenas nas primeiras 4-6 imagens acima da dobra

Signed URL Caching

Signed URLs com expiração de 7 dias (604800s)
Gerar as URLs no server component uma vez por render
Usuário não precisa regenerar durante sessão de uso

Paginação

Lista de sessões: paginar se > 30 sessões
Galeria de uma sessão: mostrar todas as fotos (sessões costumam ter 5-20 fotos)
Considerar scroll infinito se necessário no futuro


Internacionalização (i18n)
Seguir a estrutura [locale]/ existente no site com suporte a pt-BR e en. Manter os botões de tradução que já existem no canto superior direito funcionando normalmente.
Strings a traduzir
textlogin.title              → "Login de Administrador" | "Admin Login"
login.email              → "Email" | "Email"
login.password           → "Senha" | "Password"
login.submit             → "Entrar" | "Sign in"
login.error              → "Email ou senha inválidos" | "Invalid email or password"
login.subtitle           → "Acesso restrito à equipe" | "Restricted access"

contest.title            → "Galeria do Photo Contest" | "Photo Contest Gallery"
contest.sessionsCount    → "{count} sessões" | "{count} sessions"
contest.picturesCount    → "{count} fotos" | "{count} pictures"
contest.noSessions       → "Nenhuma sessão ainda" | "No sessions yet"
contest.back             → "Voltar" | "Back"
contest.booth            → "Booth" | "Booth"
contest.takenAt          → "Tirada em" | "Taken at"
contest.loading          → "Carregando..." | "Loading..."
contest.logout           → "Sair" | "Sign out"
contest.metadata         → "Metadados" | "Metadata"

session.title            → "Sessão {uniqueId}" | "Session {uniqueId}"
session.noPictures       → "Nenhuma foto nesta sessão" | "No pictures in this session"
Estrutura de arquivos de tradução
Seguir o padrão existente do projeto (ex: src/messages/pt-BR.json e src/messages/en.json, ou a estrutura que o projeto já usa).

Queries Úteis (referência)
sql-- Todas as sessões com contagem de fotos, mais recentes primeiro
SELECT 
    cs.unique_id,
    cs.created_at,
    cs.machine_id,
    COUNT(cp.id) as picture_count
FROM contest_sessions cs
LEFT JOIN contest_pictures cp ON cp.unique_id = cs.unique_id
GROUP BY cs.unique_id, cs.created_at, cs.machine_id
ORDER BY cs.created_at DESC;

-- Todas as fotos de uma sessão específica
SELECT * FROM contest_pictures 
WHERE unique_id = 'BAKOM' 
ORDER BY picture_index ASC;

-- Fotos com metadados (para julgamento por critérios)
SELECT unique_id, filename, storage_path, metadata
FROM contest_pictures
WHERE metadata IS NOT NULL
ORDER BY taken_at DESC;

Resumo de Tarefas
Fase 1: Setup e Verificações

⬜ Verificar plano do Supabase (Free vs Pro) para decidir sobre thumbnails via transform
⬜ Instalar dependências: @supabase/supabase-js e @supabase/ssr
⬜ Adicionar variáveis NEXT_PUBLIC_PICTURE_CONTEST_SUPABASE_URL e NEXT_PUBLIC_PICTURE_CONTEST_SUPABASE_ANON_KEY no .env.local e na Vercel
⬜ Configurar remotePatterns no next.config.js para aceitar URLs *.supabase.co
⬜ Criar usuário admin no Supabase Auth (painel do projeto picture-contest)
⬜ Aplicar políticas de RLS (ADICIONAR, não dropar) nas tabelas contest_sessions e contest_pictures
⬜ Aplicar política de RLS no bucket de storage contest-pictures
⬜ Testar que service role ainda consegue INSERT após aplicar as políticas
⬜ Testar que usuário autenticado consegue SELECT via anon key + JWT

Fase 2: Infraestrutura

⬜ Criar src/lib/supabase/picture-contest-client.ts (browser client)
⬜ Criar src/lib/supabase/picture-contest-server.ts (server client)
⬜ Criar layout protegido em src/app/[locale]/picture-contest/layout.tsx reusando o padrão do /mascot

Fase 3: Páginas

⬜ Criar página de login /picture-contest/login/page.tsx com componente LoginForm
⬜ Criar página principal /picture-contest/page.tsx (lista de sessões com createSignedUrls)
⬜ Criar página de sessão /picture-contest/[uniqueId]/page.tsx (galeria com createSignedUrls)

Fase 4: Componentes

⬜ Criar PolaroidCard.tsx com estética definida e rotação determinística
⬜ Criar SessionGrid.tsx / SessionCard.tsx (grid de sessões)
⬜ Criar PictureGallery.tsx (grid de polaroids da sessão)
⬜ Reutilizar ProjectImageVisualization para modal de tela cheia
⬜ Adicionar exibição de metadata no modal (renderizar JSONB de forma genérica)

Fase 5: i18n e Polimento

⬜ Adicionar strings traduzidas em pt-BR e en
⬜ Verificar funcionamento dos botões de tradução
⬜ Testar responsividade mobile
⬜ Testar performance (lazy loading, signed URLs plurais)
⬜ Testar fluxo completo: login → lista → galeria → modal → logout

Fase 6: Melhorias Futuras (opcional, pós-Gamescom)

Sistema de favoritos / marcar fotos vencedoras
Notas/comentários por foto para julgamento
Download em lote (zip) das fotos de uma sessão ou das favoritas
Filtros por metadata (ex: "mostrar só fotos com capivaras")
Exportação de resultados do julgamento em CSV/JSON

Credenciais Necessárias Antes de Começar
Para começar a implementação, o desenvolvedor precisa ter em mãos:

Project URL do Supabase picture-contest: https://{project-id}.supabase.co
Anon/Publishable Key do Supabase picture-contest
Credenciais do usuário admin (email + senha) criadas no painel do Supabase
Acesso ao painel da Vercel para adicionar as env vars em produção
Confirmação do plano do Supabase (Free ou Pro) — define se transforms estarão disponíveis
Acesso ao código do projeto /mascot para replicar o padrão de autenticação


Notas Finais
Prioridades

Este plano assume que o projeto /mascot já tem autenticação admin funcionando — o padrão dele deve ser replicado
A estética polaroid é o diferencial visual: priorizar essa estética mesmo que custe um pouco mais de tempo
A galeria é interna/admin, então SEO não é preocupação
Se no futuro quiser expor publicamente, será necessário revisar as políticas de RLS e adicionar cache/CDN para as imagens

Pontos críticos que não podem ser esquecidos
ItemPor quêremotePatterns no next.config.jsSem isso, <Image> rejeita URLs do SupabasecreateSignedUrls (plural)Evita N requests em galerias grandesRotação determinística no polaroidEvita hydration mismatch no Next.jsNÃO dropar política service roleEvita quebrar o upload do jogoTestar INSERT após RLSConfirmar que o jogo continua funcionandoExpiração 7 dias nas signed URLsEvita imagens quebradas em sessões longas
Dependência externa crítica
O jogo (Unity) faz INSERT nas tabelas via service role key. Qualquer mudança nas políticas RLS deve ser testada com o jogo rodando antes de considerar concluída a Fase 1. Se o INSERT quebrar durante a Gamescom, o contest inteiro para.

Pronto para executar
Este plano está pronto para ser enviado ao agente implementador. Antes de começar:

✅ Verificar plano do Supabase
✅ Ter credenciais em mãos
✅ Ter acesso ao código do /mascot como referência
✅ Reservar tempo para testar RLS com o jogo antes da Gamescom

Boa implementação! 🎮