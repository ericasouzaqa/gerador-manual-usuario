# Gerador de Manual do Usuário

Aplicação local para transformar documentos de produto em conhecimento revisável, cenários de teste e manual do usuário.

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
