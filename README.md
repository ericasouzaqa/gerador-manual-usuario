# Gerador de Manual do Usuário

Aplicação local-first para ler documentos e criar manuais de usuário revisáveis.

## Princípio técnico

A primeira versão **não consome API de inteligência artificial**. O frontend funciona no navegador, mantém o estado no dispositivo e foi estruturado para que a futura leitura real de documentos e qualquer automação local possam ser adicionadas por módulos independentes, sem acoplar a interface a um fornecedor.

A pasta `desktop/` contém o shell para computador. Ele reutiliza o build da aplicação web com isolamento de contexto, `nodeIntegration` desativado, sandbox habilitado e um bridge mínimo. Isso preserva uma única experiência visual e reduz duplicação de código.

## Executar a versão web

```bash
pnpm install
pnpm dev
```

Para validar a compilação:

```bash
pnpm check
pnpm build
```

## Executar a versão para computador

Depois de gerar o build web, instale as dependências da pasta `desktop/` e inicie o shell:

```bash
cd desktop
pnpm install
pnpm start
```

## Escopo atual

O protótipo demonstra o fluxo de trabalho, upload local, busca de funcionalidade, estados de confirmação/revisão/gap, documentos recentes, evidências, progresso de revisão e marcação de aprovação humana.

A leitura efetiva de PDF, Word, Excel, imagens e OCR local deve entrar em um próximo módulo testado isoladamente. Não deve ser simulada como se já estivesse concluída.

## Segurança e manutenção

Não adicionar chamadas remotas de IA ou envio automático de documentos. Qualquer novo recurso nativo do desktop deverá entrar pelo preload com uma interface pequena e revisada. O domínio deve permanecer independente da camada visual para permitir evolução por muitos anos sem reescrever a experiência.
