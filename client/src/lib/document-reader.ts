/**
 * Núcleo local e determinístico. Nenhum arquivo sai do navegador e nenhum
 * provedor externo é consultado. O módulo retorna evidência literal e gaps.
 */
export type LocalDocument = {
  id: string;
  name: string;
  format: string;
  status: "lido" | "não suportado" | "erro";
  text: string;
  pages?: number;
  message?: string;
};

function getFormat(name: string) {
  return name.split(".").pop()?.toLowerCase() ?? "arquivo";
}

async function readPdf(file: File) {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.mjs",
    import.meta.url
  ).toString();
  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const pages: string[] = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(
      content.items
        .map(item => ("str" in item ? item.str : ""))
        .join(" ")
        .trim()
    );
  }
  return { text: pages.filter(Boolean).join("\n\n"), pages: pdf.numPages };
}

export async function readDocument(file: File): Promise<LocalDocument> {
  const format = getFormat(file.name);
  const id = `${file.name}-${file.lastModified}-${file.size}`;
  try {
    if (format === "txt" || file.type === "text/plain") {
      return {
        id,
        name: file.name,
        format,
        status: "lido",
        text: await file.text(),
      };
    }
    if (format === "pdf" || file.type === "application/pdf") {
      const result = await readPdf(file);
      return result.text
        ? { id, name: file.name, format, status: "lido", ...result }
        : {
            id,
            name: file.name,
            format,
            status: "lido",
            text: "",
            pages: result.pages,
            message: "O PDF não contém texto selecionável.",
          };
    }
    return {
      id,
      name: file.name,
      format,
      status: "não suportado",
      text: "",
      message: "Nesta versão, a leitura local está disponível para TXT e PDF.",
    };
  } catch {
    return {
      id,
      name: file.name,
      format,
      status: "erro",
      text: "",
      message: "Não foi possível ler este arquivo neste dispositivo.",
    };
  }
}

function firstHeading(text: string) {
  return (
    text
      .split(/\r?\n/)
      .map(line => line.trim())
      .find(Boolean) ?? "Manual do usuário"
  );
}

export function createManual(documents: LocalDocument[]) {
  const readable = documents.filter(
    document => document.status === "lido" && document.text.trim()
  );
  const gaps = documents.filter(
    document => document.status !== "lido" || !document.text.trim()
  );
  const sourceNames = documents.map(document => document.name).join(", ");
  const title = readable.length
    ? firstHeading(readable[0].text)
    : "Manual do usuário";
  const excerpts = readable
    .map(document => `Fonte: ${document.name}\n\n${document.text.trim()}`)
    .join("\n\n---\n\n");
  const gapText = gaps.length
    ? `\n\nPontos não lidos\n\n${gaps.map(document => `- ${document.name}: ${document.message ?? "informação não encontrada"}`).join("\n")}`
    : "";
  return `# ${title}\n\n## Sobre esta versão\n\nEste manual foi criado a partir dos arquivos: ${sourceNames || "nenhum arquivo"}. Revise o conteúdo antes de publicar.\n\n## Conteúdo identificado\n\n${excerpts || "Nenhum texto foi identificado nos documentos lidos."}${gapText}\n\n## Origem das informações\n\nAs informações acima foram mantidas conforme o texto encontrado nos arquivos locais. Regras, ações ou comportamentos que não aparecem nos documentos não foram completados.`;
}
