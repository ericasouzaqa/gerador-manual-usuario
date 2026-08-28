import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { readDocument } from "./document-reader";

describe("validação de conteúdo real", () => {
  it("preserva o parecer recebido sem remover instruções ou lacunas", async () => {
    const content = readFileSync(
      new URL("../../../test-fixtures/auditoria-real.txt", import.meta.url)
    );
    const result = await readDocument(
      new File([content], "auditoria-real.txt", { type: "text/plain" })
    );
    expect(result.status).toBe("lido");
    expect(result.rawText).toContain("Não quero apenas um leitor de PDF");
    expect(result.rawText).toContain("A validação não deve verificar apenas");
    expect(result.evidence.length).toBeGreaterThan(100);
  });
});
