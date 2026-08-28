/**
 * Leitura local e determinística. Nenhum arquivo é enviado para fora do
 * dispositivo. O módulo retorna o texto encontrado e informa as lacunas.
 */
export type LocalDocument = {
  id: string;
  name: string;
  format: string;
  status: "lido" | "visual" | "não suportado" | "erro";
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
  return { text: pages.filter(Boolean).join("\n\n"), pages: pdf.numPages };
}

async function readDocx(file: File) {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({
    arrayBuffer: await file.arrayBuffer(),
  });
  return { text: result.value };
}

async function readXlsx(file: File) {
  const XLSX = await import("xlsx");
  const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
  const sheets = workbook.SheetNames.map(
    name => `Aba: ${name}\n${XLSX.utils.sheet_to_csv(workbook.Sheets[name])}`
  );
  return { text: sheets.join("\n\n") };
}

function resultWithText(
  id: string,
  name: string,
  format: string,
  text: string,
  extra: Partial<LocalDocument> = {}
): LocalDocument {
  return {
    id,
    name,
    format,
    status: text.trim() ? "lido" : "erro",
    text,
    ...extra,
    message: text.trim()
      ? undefined
      : (extra.message ?? "Nenhum texto foi encontrado."),
  };
}

export async function readDocument(file: File): Promise<LocalDocument> {
  const format = getFormat(file.name);
  const id = `${file.name}-${file.lastModified}-${file.size}`;
  try {
    if (format === "txt" || file.type === "text/plain")
      return resultWithText(id, file.name, format, await file.text());
    if (format === "pdf" || file.type === "application/pdf") {
      const result = await readPdf(file);
      return resultWithText(id, file.name, format, result.text, {
        pages: result.pages,
        message: "O PDF não contém texto selecionável.",
      });
    }
    if (format === "docx" || file.type.includes("wordprocessingml"))
      return resultWithText(
        id,
        file.name,
        format,
        (await readDocx(file)).text,
        { message: "O documento não contém texto." }
      );
    if (
      format === "xlsx" ||
      format === "xls" ||
      file.type.includes("spreadsheet") ||
      file.type.includes("excel")
    )
      return resultWithText(
        id,
        file.name,
        format,
        (await readXlsx(file)).text,
        { message: "A planilha não contém dados." }
      );
    if (
      ["png", "jpg", "jpeg", "webp", "gif"].includes(format) ||
      file.type.startsWith("image/")
    )
      return {
        id,
        name: file.name,
        format,
        status: "visual",
        text: "",
        message:
          "Imagem registrada. O texto precisa ser conferido manualmente.",
      };
    return {
      id,
      name: file.name,
      format,
      status: "não suportado",
      text: "",
      message: "Formato não suportado nesta versão.",
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
    ? `\n\n## Pontos não lidos\n\n${gaps.map(document => `- ${document.name}: ${document.message ?? "informação não encontrada"}`).join("\n")}`
    : "";
  return `# ${title}\n\n## Sobre esta versão\n\nEste manual foi criado a partir dos arquivos: ${sourceNames || "nenhum arquivo"}. Revise o conteúdo antes de usar.\n\n## Conteúdo encontrado\n\n${excerpts || "Nenhum texto foi identificado nos documentos lidos."}${gapText}\n\n## Origem\n\nO conteúdo foi mantido conforme encontrado nos arquivos locais. Informações ausentes não foram completadas.`;
}
