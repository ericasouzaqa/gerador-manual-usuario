# Direção de design — Produto Conhecimento Local

## Três direções consideradas

### Theme Name: Arquivo de Campo

Very Brief Intro: Uma interface clara, editorial e operacional, inspirada em cadernos de campo e sistemas de documentação confiáveis. Prioriza leitura, rastreabilidade e sensação de controle.
Probability: 0.07

### Theme Name: Oficina de Evidências

Very Brief Intro: Uma linguagem visual de bancada técnica, com cartões de evidência, marcações e estados de revisão. Transmite precisão sem parecer uma ferramenta fria.
Probability: 0.03

### Theme Name: Sala de Controle Humana

Very Brief Intro: Um painel escuro e concentrado para decisões, com acentos de sinalização e forte contraste. Evoca operação crítica e acompanhamento de processos.
Probability: 0.08

## Abordagem escolhida: Arquivo de Campo

### Design Movement

Editorial utilitário contemporâneo, combinando a clareza de sistemas de documentação com a materialidade discreta de um arquivo físico bem organizado.

### Core Principles

A interface deve tornar a origem da informação visível, reduzir carga cognitiva, separar fato de pendência e usar hierarquia editorial em vez de excesso de ornamentos. Cada tela deve ajudar o usuário a decidir o próximo passo.

### Color Philosophy

A base é marfim suave e grafite quente para evitar o aspecto clínico de branco puro. O verde musgo é a cor proprietária: comunica conhecimento validado e maturidade operacional. Âmbar sinaliza revisão ou gap, sem transformar toda incerteza em erro. Vermelho fica reservado para ações destrutivas.

### Layout Paradigm

Navegação persistente à esquerda, uma coluna de contexto e uma área principal de leitura. O conteúdo se organiza por trilhas horizontais e blocos editoriais assimétricos, evitando centralização excessiva. A tela deve parecer um ambiente de trabalho contínuo, não uma sequência de landing pages.

### Signature Elements

Marcadores verticais de evidência; etiquetas de estado com linguagem humana; uma linha de progresso discreta que mostra onde o documento está no ciclo de conhecimento.

### Interaction Philosophy

As interações devem confirmar, explicar e nunca surpreender. Ações de risco pedem contexto e confirmação; ações frequentes são rápidas e silenciosas. O sistema sempre informa o que foi encontrado, o que não foi encontrado e o que aguarda decisão humana.

### Animation

Movimentos curtos, entre 160 e 240 ms, apenas em opacidade e transformação. Painéis entram pela lateral com deslocamento pequeno; listas aparecem com atraso mínimo por item. Nada de efeitos chamativos durante leitura. Respeitar prefers-reduced-motion.

### Typography System

Display: Fraunces, com peso 600 para títulos e números de síntese. Interface e corpo: DM Sans, pesos 400–600, com largura confortável e boa leitura em telas densas. Títulos usam frases curtas; rótulos e estados usam capitalização normal, sem excesso de caixa alta.

### Brand Essence

Uma bancada local para transformar documentação de produto em orientação confiável, para equipes que precisam ensinar e operar sem depender de suposições. Personalidade: criteriosa, didática, serena.

### Brand Voice

Headlines são diretas e orientadas à tarefa. CTAs descrevem o resultado, não a tecnologia. Microcopy diferencia confirmado, pendente e ausente.

Exemplos: “Transforme arquivo disperso em conhecimento utilizável.” “Revisar o que ainda não está definido.”

### Wordmark & Logo

Marca gráfica sem texto formada por três folhas de arquivo sobrepostas, sendo a última recortada por uma pequena linha de evidência. O símbolo deve funcionar em favicon e no cabeçalho; o wordmark usa Fraunces semibold com espaçamento compacto.

### Signature Brand Color

Verde musgo de validação: #3E6653.

## Regra de decisão

Quando houver dúvida: “Esta escolha torna a evidência e o próximo passo mais claros, ou apenas deixa a tela mais enfeitada?”

## Style Decisions

A primeira viewport deve funcionar como uma bancada operacional, não como uma apresentação de marketing. Ela prioriza estado do conhecimento, decisões humanas pendentes e próximo passo.

A identidade persistente usa o símbolo de folhas sobrepostas e o wordmark em Fraunces na navegação. O verde musgo fica reservado para validação, origem registrada e ações de avanço.

Imagens só aparecem quando reforçam documentação local, material anotado, arquivos ou evidências; o conteúdo de trabalho permanece legível mesmo sem a imagem.
