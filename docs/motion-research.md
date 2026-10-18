# Pesquisa de motion real — 18/10/2026

## O que foi efetivamente examinado

Esta pesquisa substitui a impressão de que os 64 efeitos anteriores eram animações originais da Netflix. Eram efeitos próprios da demonstração. O site agora possui 67 keyframes próprios e transições SVG/CSS, informados pelas referências abaixo; não é uma reprodução integral do produto autenticado.

| Evidência | Resultado | Limite da conclusão |
|---|---|---|
| Página pública netflix.com/br, Chromium, 1440×1000, sem login | 59 elementos com animation/transition declarada; captura de estilos computados | Várias instâncias repetem o mesmo efeito. Não são 59 designs distintos. |
| APK fornecido, REA 6.7.0 + Apktool 3.0.3 | 57 arquivos XML com animação + 15 Lottie = **72 recursos de animação** | Evidência estática Android. Pode incluir bibliotecas; não prova autoria exclusiva, execução ou presença no website. |
| THRU / Santos Dilone, projeto Netflix Motion Expansion | A equipe documenta **mais de 150 aplicações** e quatro comportamentos centrais | Quantidade declarada pela equipe; não examinei individualmente as 150 peças. É branding, não catálogo de efeitos do website. |
| Portfólio da responsável Mariah Hourihan | 5 mídias examinadas em sequências de 12 quadros cada | Amostragem visual, sem inferir curvas matemáticas exatas a partir de frames. |

O requisito de pesquisar mais de 60 tem um inventário concreto de **72 recursos do aplicativo enviado**, além de pesquisa na internet. Não afirmamos ter observado 60 animações distintas no website autenticado da Netflix.

## Fontes primárias na internet

1. [THRU — Netflix Motion Expansion](https://thrumotion.com/netflix/): traveling, revealing, pulsing e expanding; templates de mídia, cor, proporção e tipografia. A página foi lida pela ferramenta web; o download direto retornou HTTP 403, sem tentar contornar esse bloqueio.
2. [Mariah Hourihan — Netflix Brand Design](https://mariahhourihan.com/project/netflix-brand-design-system-expansion): expansão dos sistemas de marca, motion e som. Mídias inspecionadas: `NStreams.gif` (3,92 s), `Netflix_LogoBug_Animation_HiRes.gif` (4,84 s), `Netflix_TitleAttribution_Animation_HiRes.gif` (4,84 s), `Netflix-OTT-Digital-Design-Toolkit-01.mp4` (3,967 s) e `-02.mp4` (2,234 s), publicadas em `/wp-content/uploads/2025/03/` nesse domínio. Observações: N construído em faixas e expandido em linhas coloridas; passagem de símbolo para wordmark; linha vertical vermelha associada a título; apresentação de camadas e cores de cards. Essas cinco mídias não são cinco efeitos do produto web.
3. [Netflix — novo ident de 2019](https://about.netflix.com/en/news/your-new-netflix-ident-animation-cue-netflix-sound): contexto oficial da abertura com espectro de cores e fundo escuro.
4. [Imaginary Forces — Netflix Originals](https://imaginaryforces.com/project/netflix-originals): autoria e extensão da identidade do cinema para a plataforma.
5. [Chris Eddie — Netflix Kids Character Pods](https://chriseddie.com/netflix.html): estudo real de locomoção dos cards/personagens e transições de vídeo; inclui experimentos e TV, não comprova o comportamento atual do desktop.
6. [Thornberg & Forester — User Interface Exploration](https://thornbergandforester.com/project/netflix-user-interface-exploration/): conceitos beta, enquadramento e transições de trailers. Explicitamente classificados como conceitos, não como funções lançadas.
7. [Netflix Brasil](https://www.netflix.com/br/): página pública inspecionada com navegador. [Estilos computados registrados](analysis/netflix-public-motion.json). O proxy local exigiu ignorar o certificado apenas nessa inspeção pública; essa configuração não existe no produto nem no cliente API.

## Medições e aplicação

| Referência examinada | Medição/observação | Aplicação própria |
|---|---|---|
| Botões públicos da Netflix | background/border 250 ms, cubic-bezier(.4,0,.68,.06) | Tokens de feedback dos botões |
| Cards públicos | transform 200 ms ease-in-out | Transição de elevação dos cards |
| Bloco promocional público | 500 ms, cubic-bezier(.33,0,0,1) | Curva compartilhada de entrada; durações específicas do projeto |
| APK `my-list-plus-to-check.json` | 31 frames a 60 fps ≈ 516,7 ms | SVG próprio: ocultação do + e desenho do check em 517 ms, com estado acessível |
| Ident e title attribution | Faixas verticais e revelação de conteúdo | Faixa decorativa do destaque e máscara de revelação do título de detalhes |
| THRU pulsing | Comportamento documentado; não há medição temporal publicada na página | Carregamento em três faixas, três ciclos finitos; depois permanece estático |

Os tempos das novas faixas (1200/1000 ms), máscaras (400 ms) e demais keyframes são decisões do projeto, não medições secretas da Netflix. `prefers-reduced-motion` desativa movimentos e transições. Nenhuma reprodução de áudio automática foi adicionada. Os arquivos originais de marca/Lottie e o APK não são distribuídos no repositório.

## Inventário reproduzível do APK

[72 entradas, uma por arquivo](analysis/motion-resources.md), [metadados/hashes JSON](analysis/motion-resources.json) e [resumo REA](analysis/motion-rea-summary.json).

- APK SHA-256: `b82d572c0b0b1f9f42ef0ab7f1afdee4465b9e88c00b30b6db79b671d4ca6b60`.
- REA evidence: `ev_74acc101392d6eb198928917cfe2e1e036f2a5faf8dd4c27f986c4c44826c626`.
- Apktool 3.0.3: release oficial `iBotPeaches/Apktool`, SHA-256 `dbf930b076c6b9be08d57c449cacefc3bdd6b71ebd59b3066fc0e1f5b14f9423`, conferido com o digest da release antes da execução.
- Nome do pacote: `com.netflix.mediaclient`, versão declarada `9.87.1 build 9 74701`. A assinatura do APK não foi autenticada.
- Recursos ofuscados mantêm o ID `APKTOOL_RENAMED_0x…`; nenhum nome de recurso original foi inventado.
- Dos 60 XML candidatos, dois só definem interpoladores e um é seletor vazio; foram excluídos. Restam 57 com operações alpha, scale, translate, objectAnimator ou animator.
- As durações de componentes XML não equivalem à duração total de um conjunto sequencial/paralelo. Referências `@android:integer/...` continuam não resolvidas, pois dependem do sistema.

```sh
REA_APKTOOL_COMMAND=/caminho/absoluto/apktool rea decode-android-resources /caminho/Netflix.apk --no-strings --format json
apktool d --no-src --no-assets --frame-path /tmp/apk-framework -o /tmp/netflix-decoded /caminho/Netflix.apk
python scripts/inventory-motion.py /caminho/Netflix.apk /tmp/netflix-decoded docs/analysis
```

O inventário complementar lê os recursos decodificados pelo mesmo Apktool e os JSON do ZIP; não é uma operação nativa REA nem evidência de execução. As 72 linhas foram examinadas quanto a propriedades e tempos. A duração de 517 ms da lista foi extraída do JSON, sem presumir que o website use a mesma implementação.
