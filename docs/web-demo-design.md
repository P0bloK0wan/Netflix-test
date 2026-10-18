# Proposta: demonstração web baseada na análise do APK

Estado: aprovada pelo usuário; implementação concluída e validada localmente.

## Objetivo e decisões confirmadas

Criar uma demonstração funcional no repositório `P0bloK0wan/Netflix-test`, usando a análise estática do APK pelo REA como referência estrutural. Entregar primeiro um site e preparar os contratos de dados para uma aplicação Android futura. O usuário escolheu catálogo e vídeos de exemplo nesta primeira fase.

A análise está documentada em `analysis/README.md`. A fidelidade visual exata não foi verificada: não houve captura das telas nem execução do APK.

## Abordagens consideradas

1. **React, TypeScript e Vite, com dados locais — recomendada.** Permite uma demonstração completa sem configurar servidores e preserva componentes e contratos claros. Contas e sincronização entre dispositivos ficam para uma etapa posterior.
2. **Aplicação com backend desde o início.** Oferece contas e catálogo remoto, mas exige decisões de infraestrutura que não são necessárias para a demonstração escolhida.
3. **Web e Android implementados simultaneamente.** Amplia o esforço e a validação, contrariando a prioridade de entregar o site primeiro.

## Experiência proposta

- Interface em português, responsiva, fundo escuro, destaque vermelho e navegação acessível por teclado.
- Seleção entre perfis de demonstração, com preferências isoladas por perfil neste navegador.
- Página inicial com destaque principal e fileiras horizontais de títulos; filtros para filmes e séries.
- Busca local por título e gênero, com estado vazio quando não houver resultados.
- Detalhes em painel/modal com sinopse, ano, classificação, duração e ações de assistir e adicionar/remover da Minha Lista.
- Minha Lista persistida localmente por perfil.
- Player HTML5 com vídeos de exemplo identificados como demonstração, controles de reprodução e mensagem de erro quando a mídia estiver indisponível.
- Progresso persistido por perfil e título, retomada da reprodução e seção Continuar assistindo.
- Catálogo fictício ou de obras abertas, com fontes e créditos dos recursos registrados. Não apresentar vídeos de exemplo como filmes reais da Netflix.

## Estrutura e dados

Organizar a interface em componentes de navegação, catálogo, perfis, detalhes e player. Modelos TypeScript `Title`, `Profile` e `WatchProgress` ficam separados da apresentação. Um adaptador local concentra acesso ao catálogo e à persistência, permitindo uma futura implementação por API.

O catálogo é estático. Preferências e progresso usam armazenamento local versionado. Falhas de leitura, dados inválidos ou indisponibilidade de armazenamento resultam em estado inicial seguro e continuidade em memória. A demonstração não solicita senha nem credenciais da Netflix.

A versão Android futura poderá consumir os mesmos contratos de dados por API; a escolha entre implementação nativa e empacotamento web fica para essa fase. Não prometer reutilização direta de componentes React em Android nativo.

## Limites da primeira versão

Não inclui autenticação real, cobrança, reprodução do catálogo da Netflix, downloads offline, DRM, transmissões ao vivo, jogos ou sincronização entre dispositivos. Nenhum desses recursos será simulado com um botão que aparenta funcionar.

## Critérios de aceitação e verificação

1. Selecionar perfil, navegar, buscar e abrir detalhes funciona em telas móveis e desktop.
2. Adicionar/remover da lista persiste após recarregar e mantém perfis independentes.
3. Um vídeo de exemplo reproduz e seu progresso pode ser retomado; falhas de rede têm mensagem compreensível.
4. Busca vazia, lista vazia e armazenamento inválido têm estados definidos.
5. Navegação e modal suportam teclado, foco visível e rótulos acessíveis.
6. Build de produção e verificações de tipos passam; testes cobrem busca, isolamento de perfis e persistência/retomada. Validação em navegador será reportada conforme as ferramentas disponíveis.
7. README documenta instalação, execução, limitações, origem das mídias e evidências do REA.

## Entrega prevista

Código e documentação no checkout `/workspace/Netflix-test`. Manter APK, ferramentas e evidências integrais fora do histórico Git. A publicação remota depende de credenciais disponíveis para o repositório; ainda não foi verificada permissão de escrita. Nenhum commit foi enviado ao GitHub na análise inicial.

## Ampliação solicitada durante a implementação

O usuário pediu pesquisa pública sobre a experiência web, fotos e mais de 50 animações, além de prevenção contínua de regressões. A ampliação mantém a demonstração local aprovada: 64 efeitos nomeados, ações rápidas nos cards, imagens dos trailers abertos, preferência de movimento reduzido e checks automáticos no GitHub. A pesquisa e os limites estão em `web-research.md`.
