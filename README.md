# Gerador de Manual do Usuário

Aplicação local-first para transformar documentos de produto em conhecimento revisável, cenários de teste e manual do usuário.

## Download para Windows

A versão para **Windows 10 ou 11, 64 bits**, é distribuída como um pacote portátil pelo GitHub Releases. Acesse a página de [Releases](https://github.com/ericasouzaqa/produto-conhecimento-local/releases) e baixe o arquivo `GeradorManualUsuario-win32-x64.zip` do release mais recente.

Depois do download, extraia o ZIP completo para uma pasta local. Abra a pasta extraída e execute `GeradorManualUsuario.exe`. Não mova o arquivo `.exe` para fora da pasta extraída, porque ele depende dos arquivos do runtime Electron que acompanham o pacote. O aplicativo não exige instalação, servidor remoto ou conexão com API externa para o processamento dos documentos.

O Windows pode exibir um aviso do SmartScreen por se tratar de um executável distribuído diretamente pelo projeto e não assinado digitalmente. Nesse caso, confira se o arquivo veio da página oficial de [Releases](https://github.com/ericasouzaqa/produto-conhecimento-local/releases), selecione **Mais informações** e, somente se reconhecer a origem, escolha **Executar assim mesmo**.

## Fluxo

1. **Fonte**: adicione os arquivos.
2. **Entrega**: defina o agrupamento do trabalho.
3. **Conhecimento**: revise funcionalidade, uso, regras e gaps.
4. **STEP**: revise os passos identificados.
5. **Gherkin**: copie os cenários para a ferramenta de QA.
6. **Manual**: edite, copie ou exporte o conteúdo.

## Fidelidade

O sistema trabalha somente com o conteúdo encontrado nos arquivos. Cada evidência mantém o nome da fonte e, quando disponível, a página. Texto não identificado, imagem sem leitura e interpretação incompleta são registrados como gap. A aplicação não cria telas, campos, regras, ações ou resultados que não estejam na fonte.

## Formatos locais

PDF com texto, TXT, DOCX, XLSX e XLS são lidos localmente. Imagens e PDFs sem texto selecionável são preservados como fonte visual e marcados para conferência. OCR automático não está ativo nesta versão.

## Privacidade e independência

Não há chamada para API externa de inteligência artificial. O processamento ocorre no navegador. A versão desktop reutiliza o mesmo build local e não exige serviço remoto obrigatório.

A aplicação final é independente das ferramentas usadas durante o desenvolvimento. Ela não contém chamadas para modelos de IA, APIs de IA obrigatórias, chaves ou tokens de IA, nem processamento que dependa de um serviço de IA em tempo de execução. Se as ferramentas de IA utilizadas na criação deixarem de existir, a versão publicada continuará operando com os arquivos embarcados, as dependências versionadas e o processamento local.

Qualquer explicação sobre inteligência artificial, chatbots, RAG, MCP, tools, modelos, agentes ou Amazon Bedrock deve ser entendida apenas como conteúdo educativo, quando existir. A documentação diferencia claramente **conceito**, **implementação real** e **exemplo didático**. Uma simulação ou exemplo nunca é apresentado como integração real do sistema.

## Desenvolvimento

```bash
pnpm install
pnpm dev
pnpm test
pnpm check
pnpm build
```

A pasta `desktop/` contém o shell local para computador. O PDF é obtido pelo diálogo de impressão do sistema. O Word é exportado em formato compatível com `.doc`.

## Limites conhecidos

A análise é baseada em regras determinísticas. Ela organiza evidências e aponta ausência de informação, mas não substitui revisão humana. A aplicação ainda não interpreta OCR de imagens e PDF escaneado, não preserva layout visual completo de documentos e não oferece comparação avançada entre versões.

O pacote publicado nesta versão é destinado a **Windows x64**. A execução do `.exe` deve ser feita dentro da pasta extraída do ZIP. Para outros sistemas operacionais, é necessário um pacote específico da respectiva plataforma.
