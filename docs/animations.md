# Catálogo das 67 animações próprias

São adaptações próprias; as evidências reais e seus limites estão em [motion-research.md](motion-research.md). Cada linha é uma animação CSS nomeada e conectada à interface. As entradas são finitas; animações de interação são acionadas por hover/foco/estado, sem loops infinitos. O carregamento executa no máximo três ciclos. O catálogo completo não é executado simultaneamente. Preferências de movimento reduzido desativam todas.

| Nº | Nome | Aplicação | Duração |
|---|---|---|---|
| 1 | `header-enter` | Entrada da navegação | 500 ms |
| 2 | `brand-lift` | Elevação suave da marca | 250 ms |
| 3 | `brand-badge` | Resposta do selo demo | 250 ms |
| 4 | `nav-hover` | Realce de atalho | 220 ms |
| 5 | `nav-indicator` | Traço da página ativa | 280 ms |
| 6 | `search-icon` | Resposta da lupa | 300 ms |
| 7 | `search-expand` | Abertura da busca | 250 ms |
| 8 | `search-clear` | Rotação de fechar busca | 250 ms |
| 9 | `profile-trigger` | Resposta do perfil | 250 ms |
| 10 | `avatar-eyes` | Piscar do avatar | 350 ms |
| 11 | `avatar-smile` | Sorriso do avatar | 400 ms |
| 12 | `profile-caret` | Indicação de perfis | 300 ms |
| 13 | `hero-landscape` | Aproximação cinematográfica do destaque | 1600 ms |
| 14 | `hero-kicker` | Entrada da assinatura do destaque | 450 ms |
| 15 | `hero-monogram` | Revelação do monograma | 500 ms |
| 16 | `hero-eyebrow` | Entrada da chamada editorial | 450 ms |
| 17 | `hero-title` | Revelação do título principal | 650 ms |
| 18 | `hero-subtitle` | Segundo movimento do título | 650 ms |
| 19 | `hero-meta` | Entrada de metadados | 400 ms |
| 20 | `hero-badge` | Revelação do selo destaque | 350 ms |
| 21 | `hero-description` | Entrada da sinopse de destaque | 450 ms |
| 22 | `hero-play` | Entrada do botão assistir | 380 ms |
| 23 | `play-arrow` | Convite visual ao play | 250 ms |
| 24 | `hero-info` | Entrada do botão detalhes | 380 ms |
| 25 | `info-ring` | Resposta do ícone de detalhes | 350 ms |
| 26 | `hero-caption` | Entrada da identificação da demo | 450 ms |
| 27 | `hero-pagination` | Entrada do índice editorial | 400 ms |
| 28 | `hero-age` | Entrada da classificação | 400 ms |
| 29 | `section-title` | Entrada do título da fileira | 430 ms |
| 30 | `section-caption` | Entrada da legenda da fileira | 400 ms |
| 31 | `section-dot` | Pontuação da fileira | 400 ms |
| 32 | `row-previous` | Retorno da fileira | 250 ms |
| 33 | `row-next` | Avanço da fileira | 250 ms |
| 34 | `card-enter` | Entrada escalonada dos cards | 450 ms |
| 35 | `card-image` | Aproximação da imagem | 500 ms |
| 36 | `card-mark` | Assinatura do card | 350 ms |
| 37 | `card-label` | Resposta do tipo de título | 300 ms |
| 38 | `card-title` | Elevação do título do card | 300 ms |
| 39 | `card-meta` | Revelação dos metadados do card | 350 ms |
| 40 | `card-progress` | Preenchimento do progresso | 500 ms |
| 41 | `card-rank` | Revelação do ranking | 500 ms |
| 42 | `quick-panel` | Abertura das ações rápidas | 240 ms |
| 43 | `quick-play` | Resposta do play rápido | 240 ms |
| 44 | `quick-save` | Resposta de salvar no card | 240 ms |
| 45 | `banner-image` | Revelação da fotografia editorial | 1200 ms |
| 46 | `banner-eyebrow` | Entrada da categoria editorial | 450 ms |
| 47 | `banner-title` | Entrada do título editorial | 550 ms |
| 48 | `banner-copy` | Entrada da descrição editorial | 450 ms |
| 49 | `banner-arrow` | Convite a explorar | 300 ms |
| 50 | `banner-index` | Entrada da assinatura editorial | 450 ms |
| 51 | `browse-title` | Mudança de categoria ou busca | 350 ms |
| 52 | `empty-icon` | Entrada do símbolo de estado vazio | 400 ms |
| 53 | `empty-title` | Entrada da mensagem de estado vazio | 400 ms |
| 54 | `empty-action` | Convite para voltar ao catálogo | 350 ms |
| 55 | `dialog-backdrop` | Escurecimento do fundo do diálogo | 200 ms |
| 56 | `detail-open` | Abertura do painel de detalhes | 280 ms |
| 57 | `detail-title` | Revelação do título e ações de detalhes | 350 ms |
| 58 | `detail-copy` | Entrada de sinopse e informações | 350 ms |
| 59 | `list-confirm` | Confirmação ao adicionar à lista | 350 ms |
| 60 | `profiles-open` | Abertura do seletor de perfis | 280 ms |
| 61 | `profile-option` | Entrada escalonada dos perfis | 350 ms |
| 62 | `player-open` | Abertura do player | 230 ms |
| 63 | `player-error` | Entrada da recuperação de erro | 250 ms |
| 64 | `footer-enter` | Entrada do rodapé | 450 ms |
| 65 | `stream-travel` | Faixa vertical no destaque | 1200 ms |
| 66 | `stream-loading` | Faixas durante busca do catálogo na API | 1000 ms × 3 |
| 67 | `title-stream-reveal` | Revelação horizontal do título de detalhes | 400 ms |

As fileiras são reveladas quando entram na área visível, sem ocultar permanentemente o conteúdo. Atrasos de cards e perfis são curtos e limitados. O teste de estrutura verifica contagem, uso e ausência de repetição infinita; os testes do navegador verificam comportamento e movimento reduzido.

A transição SVG `ListMark` é adicional aos 67 keyframes: desenha a confirmação em 517 ms, informada pelo recurso Lottie do APK. Não é o arquivo original nem reprodução do path proprietário.
