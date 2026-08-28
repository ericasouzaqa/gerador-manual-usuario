# Gerador de Manual do Usuário

Aplicação local para ler documentos e criar um manual editável.

## O que faz

O usuário adiciona arquivos, lê o conteúdo neste dispositivo e clica em **Criar manual**. O sistema monta um texto inicial usando apenas o conteúdo encontrado nos arquivos. O manual pode ser revisado e editado antes do uso.

## Formatos

PDF, TXT, DOCX, XLSX e XLS têm leitura de texto ou dados. PNG, JPG, JPEG e WEBP são registrados como arquivos visuais e ficam marcados para conferência manual. Outros formatos são informados como não suportados.

## Privacidade

Não há chamada para API externa de inteligência artificial. Os arquivos são processados no navegador e não são enviados automaticamente para serviços externos.

## Rodar a versão web

```bash
pnpm install
pnpm dev
```

Verificar a aplicação:

```bash
pnpm check
pnpm exec vitest run client/src/lib/document-reader.test.ts --run
pnpm build
```

## Rodar a versão para computador

A pasta `desktop/` contém o shell Electron que abre o mesmo build local da aplicação web.

```bash
pnpm build
cd desktop
pnpm install
pnpm start
```

## Limites atuais

A criação do manual é determinística. Ela não interpreta intenção, não cria regras e não preenche informações ausentes. Imagens são registradas, mas o texto delas ainda precisa ser conferido manualmente.
