# Implementation record

Plan: docs/superpowers/plans/2026-10-18-web-demo.md
Spec approved by user. Execution proceeds inline under that authorization.

- Fresh empty destination checkout; feature branch feat/web-demo isolates this initial implementation. No baseline application or tests existed.
- Domain → UI interfaces: Title/Profile/WatchProgress and createLibrary adapter. Browser tests exercise the real UI and persistence.
- Source delivery targets the requested GitHub repository; no separate hosting account or project is created.

- Task 1 complete: 11 domain tests pass after initial missing-module failure. Covers search, corrupt data, profile separation, denied storage and playback bounds.
- Task 2 complete: production build passes. Four Chromium flows pass after the initial empty-page assertion failure: catalog/list/profile persistence, keyboard focus/media error, real playback/resume, and mobile filters/overflow.
- Browser execution required network-enabled sandbox to bind the local Vite port; no public hosting resource was created.

- Final independent review: one Important defect, no critical or minor findings. Retrying a video after a mid-playback error reset playback and persisted zero.
- Regression verified RED: retry-preserves-progress test resumed below 20 seconds. Fixed by retaining the last valid position and guarding persistence while metadata is reloaded.
- Final scope remains the approved local demonstration. Photos, trailers and fonts are local; no external service is required during normal use.

- User expanded scope: web research, more than 50 animations, improved photography, ongoing regression prevention. References recorded in docs/web-research.md.
- Added 64 finite named effects with reduced-motion override; the Chromium interaction test observed more than 50 different effects starting on real controls/pages.
- Quick-action test initially used an ambiguous title (present in two rows), then tried clicking an intentionally hover-revealed action without hover. Corrected the test to exercise keyboard focus/Enter consistently; no production change was needed for those test harness issues.

- Expanded-scope review found no critical defects and a keyboard focus loss after removing a saved card. Treated it as an accessibility regression: reproduced with a failing focus assertion, then restored focus to the next/previous card or empty-state action. Cost of this choice: a small focus-management callback; no new feature scope.

- Final validation: 12 unit/structural checks passed; 9 Chromium flows passed; TypeScript + Vite production build passed. Both review findings have regression coverage and are fixed. No deferred findings.
- Production preview was inspected on desktop and mobile. Screenshots are included in docs/preview-desktop.png and docs/preview-mobile.png.

- First GitHub CI run passed seven browser cases but both real-video cases failed to reach readyState 2. Local system Chromium and locally installed Playwright Chromium both played the MP4; exact remote decoding cause was not established from the initial logs. Added WebM VP9/Opus delivery with MP4 fallback and media-error diagnostics for failed future runs. All tests remain enabled.

## 2026-10-18 — pesquisa verificável, motion e API

- Pesquisadas fontes primárias: Netflix/About, Netflix TechBlog, THRU/Santos Dilone, Imaginary Forces, Mariah Hourihan, Chris Eddie, Thornberg & Forester e documentação TMDB. Não se atribuem conceitos de TV/branding ao website atual.
- Página pública Netflix Brasil inspecionada no Chromium: 59 elementos com efeitos declarados, incluindo repetições. JSON de estilos computados preservado.
- REA `decode-android-resources` com Apktool 3.0.3; digest da ferramenta conferido com release oficial. Inventário complementar: 57 XML com operações de animação, 15 Lottie; excluídos dois interpoladores e um seletor vazio. 72 recursos estáticos, sem alegar execução nem autoria exclusiva.
- Ajustadas curvas de feedback segundo medições públicas, SVG da confirmação de lista em 517 ms informado pelo Lottie do APK. Adicionados três keyframes de faixas/revelação: 67 no total. Teste de navegador elevado de >50 para >60 nomes efetivamente iniciados por fluxos de interface. Sem incorporar animações proprietárias no bundle.
- API REST própria de catálogo, busca, paginação, detalhes, perfis e health, com contrato versionado. Cliente não importa mais o catálogo; carrega por HTTP, valida, limita espera a 8 s e permite retry. Listas/progresso permanecem locais.
- Revisão independente conferiu hashes e contagem. Corrigidos tipo de título que aceitava array por coerção, classificação etária fixa no destaque e documentação Node divergente.
- Um build iniciou enquanto uma suíte de produção anterior ainda rodava: o Vite removeu `dist/` e expôs leitura sem tratamento de erro no servidor estático sirv. A suíte afetada terminou com 11 passados/2 falhas por servidor indisponível. Corrigido substituindo a camada estática por serve-static/send com callback de erro; regressão remove arquivo já servido e verifica 404 + API ainda disponível. Builds e verificações finais foram executados em sequência. A publicação deve trocar releases completas, sem reconstruir a pasta ativa.
- Testes adicionados para contratos HTTP, consulta inválida, URL malformada, payload incompatível, 503/retry, timeout, dados do destaque vindos da API, Range de vídeo, arquivos ausentes e movimento reduzido. CI passa a executar o site tanto via Vite quanto via servidor de produção.
- Verificação final local: 19 testes de unidade/API + build + 13 testes Chromium no servidor de produção aprovados. Fluxos Vite também passaram (suíte de 13 e repetição dos 8 casos afetados após ajustes). Conferidas prévias desktop 1440 px e móvel 390 px sem overflow horizontal. Revisão independente adicional aprovou a troca do servidor estático e verificou Range, HEAD, 404 e continuidade da API.

## Correção da tela branca no GitHub Pages

- Reproduzido no endereço informado pelo usuário: HTML HTTP 200, corpo vazio e script `/src/main.tsx` HTTP 404. Pages estava em modo legacy, publicando a raiz da main sem build.
- Teste de regressão em servidor puramente estático sob `/Netflix-test/` falhou antes da correção, mesmo com JS compilado, pois o catálogo ainda dependia da API Node ausente.
- Build `pages` passa a gerar catálogo JSON e ajustar caminhos de JS/CSS, imagens, fontes e vídeos ao subdiretório. A configuração padrão mantém a API Node.
- Workflow publica somente o build após verificações de API, produção e hospedagem estática. Novos testes verificam carregamento sem erros, fontes/imagens, busca, persistência de lista, vídeo real, retry e layout móvel.
