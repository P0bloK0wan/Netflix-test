# Pesquisa web e decisões de experiência

Pesquisa realizada em 18/10/2026, após o pedido de ampliar fotos, animações e prevenção de erros.

## Fontes primárias consultadas

- [Netflix: buscas e navegação](https://help.netflix.com/pt/node/47765): documenta a busca por títulos/gêneros e a organização em fileiras com atalhos de filmes e séries. Aplicação: manter busca visível, fileiras horizontais e filtros claros.
- [Netflix: Minha Lista](https://help.netflix.com/pt/node/10523): descreve adicionar/remover títulos, inclusive a partir de cards no navegador. Aplicação: ações rápidas nos cards além das ações do painel de detalhes; listas independentes por perfil.
- [Netflix TechBlog: Artwork Personalization](https://netflixtechblog.com/artwork-personalization-c589f074ad76): explica o papel da imagem na descoberta de títulos. Aplicação: imagens legíveis e ligadas ao conteúdo, com contrastes e composições variados. A demo usa curadoria fixa; não implementa personalização por aprendizado de máquina.
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion): documenta o respeito à preferência do sistema por menos movimento. Aplicação: desativar animações decorativas e rolagem suave quando solicitado.
- [Blender: Sintel](https://durian.blender.org/) e [Big Buck Bunny](https://peach.blender.org/): obras abertas usadas nos trailers e nas imagens de seus cards. As demais imagens são fotografias Unsplash já creditadas.

## O que será ampliado

64 animações nomeadas, associadas a elementos existentes: entrada da navegação/destaque, foco e hover dos controles, descoberta das fileiras ao rolar, realce dos cards, abertura de detalhes/perfis/player, confirmação de favoritos, estados vazios e rodapé. Todas finitas, sem flashes e com movimento reduzido. Durações entre 180 ms e 1,6 s; os atrasos em fileiras são limitados.

As animações não são uma engenharia reversa do código CSS da Netflix. São uma implementação própria inspirada nos padrões públicos; nenhuma sessão autenticada da Netflix foi acessada.

## Prevenção de regressões

Testes automáticos de comportamento, reprodução, armazenamento e movimento reduzido; falhas do console e assets serão verificadas no navegador. O workflow do GitHub executa os checks a cada push/PR. Isso detecta classes conhecidas de erro, não garante ausência de bugs futuros ou observação contínua fora das execuções de CI.
