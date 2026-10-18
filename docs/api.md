# API própria da demonstração

## Pesquisa

Não foi encontrada uma API pública oficial atual da Netflix que possa fornecer livremente o catálogo e a reprodução para este projeto. As APIs descritas no [Netflix TechBlog — Migrating Netflix to GraphQL Safely](https://netflixtechblog.com/migrating-netflix-to-graphql-safely-8e1e4d4f1e72) pertencem aos clientes internos: migração móvel de Falcor para GraphQL federado. O [Falcor open source](https://netflix.github.io/falcor/) é uma biblioteca para estruturar acesso a dados; instalá-lo não concede acesso aos servidores Netflix.

A alternativa para metadados reais é a [API TMDB](https://developer.themoviedb.org/docs/faq), com credencial própria e atribuição. [Watch providers](https://developer.themoviedb.org/reference/movie-watch-providers) informa disponibilidade por país via JustWatch e exige atribuição; não fornece arquivos de filmes ou autorização de streaming. Não foi configurada nem anunciada uma integração TMDB funcional sem credencial. O site continua usando o catálogo de demonstração aprovado.

## Serviço implementado

REST JSON na mesma origem do frontend, Node 24+, sem chave de terceiro. Compartilhado entre Vite dev/preview e `npm start` em produção. A interface carrega os dados via `GET /api/v1/bootstrap`, valida o contrato, mostra carregamento e oferece nova tentativa em erro/timeout de 8 segundos. O catálogo não está mais importado no bundle do frontend. Busca no navegador permanece local depois do bootstrap, evitando requisições a cada tecla; a API de busca está disponível para outros clientes e futuro Android.

| Método e caminho | Resultado |
|---|---|
| GET `/api/v1/health` | Estado do serviço |
| GET `/api/v1/bootstrap` | Catálogo e perfis da demo |
| GET `/api/v1/catalog?q=aventura&kind=film&limit=10&offset=0` | Busca sem distinção de acentos, filtro e paginação |
| GET `/api/v1/titles/horizon` | Detalhes de um título |
| GET `/api/v1/profiles` | Perfis da demo |

Todos aceitam HEAD. Métodos de escrita retornam 405. Rotas/títulos inexistentes retornam 404 em JSON. Parâmetros desconhecidos, duplicados ou inválidos retornam 400. `q`: até 200 caracteres; `kind`: film/series; `limit`: 1–100, padrão 100; `offset`: inteiro seguro não negativo. Respostas usam `Cache-Control: no-store` e `X-Content-Type-Options: nosniff`.

```json
{"data":{"items":[],"total":0,"limit":10,"offset":0},"meta":{"schemaVersion":1,"source":"demo"}}
```

Erros têm formato `{"error":{"code":"INVALID_QUERY","message":"…"}}`.

```sh
npm ci
npm run dev                 # site + API, porta 5173
npm run build
npm start                   # site compilado + API, porta 3000
# PORT=8080 HOST=127.0.0.1 npm start
curl 'http://localhost:3000/api/v1/catalog?q=orbita'
```

A produção exige o servidor Node; copiar apenas `dist/` para hospedagem estática não fornece a API. Distribuir `dist/`, `server/`, `src/data/`, `src/domain/`, package.json/lock e instalar dependências de produção (ou usar o checkout completo). O servidor usa `serve-static`/`send` para arquivos públicos, tipos MIME e requisições Range de vídeo. HTTPS deve ser terminado pelo host/proxy escolhido. Essa configuração é distinta da versão estática publicada no GitHub Pages.

## Limites e evolução para Android

A API é pública e somente de leitura. Perfis não são contas: Minha Lista e progresso continuam no navegador, isolados por perfil local; não existe sincronização entre aparelhos. Isso evita expor dados pessoais em um backend sem autenticação.

Para virar um serviço com contas: adicionar autenticação verificada no servidor, banco com usuário/perfil como proprietário de lista e progresso, autorização por recurso, migração do armazenamento local e endpoints de escrita validados. Depois, o app Android poderá consumir o mesmo contrato versionado. Catálogo e vídeos próprios precisam ser cadastrados pelo operador; metadados TMDB, quando configurados, continuam separados das URLs de reprodução autorizadas.

## Verificação contínua

`npm test` cobre contrato HTTP real, filtros, paginação, métodos, validação do cliente e armazenamento. `npm run test:browser` testa desenvolvimento; `npm run test:production` usa o servidor Node e os arquivos compilados. CI executa os três além do build. Os testes de falhas simulam HTTP 503, payload vazio e requisição que não responde, e confirmam recuperação sem tela em branco. Essa cobertura reduz regressões; não garante ausência de qualquer erro futuro.

A publicação deve usar uma pasta de release completa e reiniciar o processo, evitando reconstruir `dist/` enquanto ele é servido. Arquivos ausentes geram erro HTTP tratado; um teste remove um arquivo já servido e confirma que a API continua disponível.

## GitHub Pages

`npm run build:pages` gera `dist-pages/` com base `/Netflix-test/`, arquivos compilados e `catalog.json` derivado do mesmo catálogo/perfis da API. O cliente desse build lê o JSON por HTTP; a busca ocorre no navegador e lista/progresso continuam locais. Não existe backend Node no Pages. O modo padrão continua consumindo `/api/v1/bootstrap`, sem fallback silencioso para dados estáticos.

A configuração do repositório deve usar **GitHub Actions** como fonte do Pages. O workflow verifica o build estático com `npm run test:pages`, envia apenas `dist-pages/` e publica depois de todas as verificações. Publicar a raiz da branch diretamente serve TSX não compilado e causa tela branca.
