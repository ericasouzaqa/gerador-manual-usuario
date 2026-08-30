/**
 * Leitura local e preservação. O módulo não completa informações ausentes.
 */
import { Evidence, SourceDocument } from "./workflow-model";

function getFormat(name: string) {
  return name.split(".").pop()?.toLowerCase() ?? "arquivo";
}

function makeEvidence(
  sourceId: string,
  sourceName: string,
  text: string,
  page?: number
): Evidence[] {
  return text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .map((content, index) => ({
      id: `${sourceId}-e${page ?? 0}-${index}`,
      sourceId,
      sourceName,
      kind:
        content.includes("\t") || content.includes(";") || content.includes(",")
          ? "tabela"
          : "texto",
      content,
      page,
      preview: content.slice(0, 180),
    }));
}

async function readPdf(file: File) {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.mjs",
    import.meta.url
  ).toString();
  const pdf = await pdfjsLib.getDocument({
    data: new Uint8Array(await file.arrayBuffer()),
  }).promise;
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
  return { pages, text: pages.join("\n\n") };
}

async function readDocx(file: File) {
  const mammoth = await import("mammoth");
  return (
    await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })
  ).value;
}

async function readXlsx(file: File) {
  const XLSX = await import("xlsx");
  const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
  return workbook.SheetNames.map(
    name => `Aba: ${name}\n${XLSX.utils.sheet_to_csv(workbook.Sheets[name])}`
  ).join("\n\n");
}

function buildSource(
  file: File,
  text: string,
  message?: string,
  pages?: string[]
): SourceDocument {
  const id = `${file.name}-${file.lastModified}-${file.size}`;
  const format = getFormat(file.name);
  const evidence = pages
    ? pages.flatMap((pageText, index) =>
        makeEvidence(id, file.name, pageText, index + 1)
      )
    : makeEvidence(id, file.name, text);
  return {
    id,
    name: file.name,
    format,
    status: text.trim() ? "lido" : "parcial",
    rawText: text,
    text,
    evidence,
    previewUrl:
      file.type.startsWith("image/") &&
      typeof URL.createObjectURL === "function"
        ? URL.createObjectURL(file)
        : undefined,
    message: text.trim()
      ? message
      : (message ?? "Nenhum texto foi extraído com segurança."),
  };
}

export async function readDocument(file: File): Promise<SourceDocument> {
  const id = `${file.name}-${file.lastModified}-${file.size}`;
  const format = getFormat(file.name);
  try {
    if (format === "txt" || file.type === "text/plain")
      return buildSource(file, await file.text());
    if (format === "pdf" || file.type === "application/pdf") {
      const result = await readPdf(file);
      return buildSource(
        file,
        result.text,
        result.text
          ? undefined
          : "PDF sem texto selecionável. Conteúdo visual preservado como lacuna.",
        result.pages
      );
    }
    if (format === "docx" || file.type.includes("wordprocessingml"))
      return buildSource(file, await readDocx(file));
    if (
      ["xlsx", "xls"].includes(format) ||
      file.type.includes("spreadsheet") ||
      file.type.includes("excel")
    )
      return buildSource(file, await readXlsx(file));
    if (
      ["png", "jpg", "jpeg", "webp", "gif"].includes(format) ||
      file.type.startsWith("image/")
    )
      return {
        id,
        name: file.name,
        format,
        status: "visual",
        rawText: "",
        text: "",
        evidence: [],
        previewUrl:
          typeof URL.createObjectURL === "function"
            ? URL.createObjectURL(file)
            : undefined,
        message:
          "Imagem preservada. Texto e estrutura precisam de conferência manual.",
      };
    return {
      id,
      name: file.name,
      format,
      status: "não suportado",
      rawText: "",
      text: "",
      evidence: [],
      message: "Formato não suportado.",
    };
  } catch {
    return {
      id,
      name: file.name,
      format,
      status: "erro",
      rawText: "",
      text: "",
      evidence: [],
      message: "Falha na leitura local. O arquivo não foi interpretado.",
    };
  }
}


/** Compatibilidade para consumidores antigos; o fluxo principal usa workflow-engine. */
export function createManual(
  documents: Array<{ name: string; text?: string; rawText?: string }>
) {
  const sections = documents
    .map(
      document =>
        `## ${document.name}\n\nFonte: ${document.name}\n\n${document.text ?? document.rawText ?? ""}`
    )
    .join("\n\n");
  return `# Manual do Usuário\n\nFontes utilizadas: ${documents.map(document => document.name).join(", ") || "nenhum documento"}.\n\n${sections}\n\nInformações ausentes não foram completadas e devem permanecer como GAP.`;
}
