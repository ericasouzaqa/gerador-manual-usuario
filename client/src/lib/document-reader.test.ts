import * as XLSX from "xlsx";
import { describe, expect, it } from "vitest";
import { createManual, readDocument } from "./document-reader";

describe("document-reader", () => {
  it("lê texto local sem chamada externa", async () => {
    const result = await readDocument(
      new File(["Cerca geográfica\n\nComo acessar"], "operacao.txt", {
        type: "text/plain",
      })
    );
    expect(result.status).toBe("lido");
    expect(result.text).toContain("Cerca geográfica");
  });

  it("registra formatos que ainda não são suportados", async () => {
    const result = await readDocument(new File(["dados"], "arquivo.zip"));
    expect(result.status).toBe("não suportado");
    expect(result.message).toContain("não suportado");
  });

  it("lê dados de uma planilha local", async () => {
    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.aoa_to_sheet([
      ["Campo", "Valor"],
      ["Status", "Ativo"],
    ]);
    XLSX.utils.book_append_sheet(workbook, sheet, "Dados");
    const bytes = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
    const result = await readDocument(new File([bytes], "dados.xlsx"));
    expect(result.status).toBe("lido");
    expect(result.text).toContain("Status");
  });

  it("registra uma imagem sem inventar texto", async () => {
    const result = await readDocument(
      new File([new Uint8Array([1, 2, 3])], "tela.png", { type: "image/png" })
    );
    expect(result.status).toBe("visual");
    expect(result.text).toBe("");
  });

  it("mantém a origem e não inventa conteúdo", () => {
    const manual = createManual([
      {
        id: "1",
        name: "operacao.txt",
        format: "txt",
        status: "lido",
        text: "Cerca geográfica\n\nRegra confirmada",
      },
    ]);
    expect(manual).toContain("Fonte: operacao.txt");
    expect(manual).toContain("Regra confirmada");
    expect(manual).toContain("não foram completadas");
  });
});
