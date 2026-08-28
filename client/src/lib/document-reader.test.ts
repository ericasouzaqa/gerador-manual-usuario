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
    const result = await readDocument(new File(["dados"], "planilha.xlsx"));
    expect(result.status).toBe("não suportado");
    expect(result.message).toContain("TXT e PDF");
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
    expect(manual).toContain("não foram completados");
  });
});
