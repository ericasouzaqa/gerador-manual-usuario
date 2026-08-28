import { describe, expect, it } from "vitest";
import {
  analyzeKnowledge,
  createGherkinScenarios,
  createManual,
  createStepScenarios,
} from "./workflow-engine";
import { Evidence, SourceDocument } from "./workflow-model";

const source: SourceDocument = {
  id: "fonte-1",
  name: "operacao.txt",
  format: "txt",
  status: "lido",
  rawText: "Cerca geográfica\n\nComo acessar\nAbra o menu de alertas.",
  evidence: [],
};

describe("workflow-engine", () => {
  it("identifica conhecimento e mantém gap para campo ausente", () => {
    const result = analyzeKnowledge([source]);
    expect(result.knowledge[0].name).toBe("Cerca geográfica");
    expect(result.gaps.some(gap => gap.question.includes("Regras"))).toBe(true);
  });

  it("gera STEP e Gherkin a partir do entendimento encontrado", () => {
    const { knowledge } = analyzeKnowledge([source]);
    const steps = createStepScenarios(knowledge);
    const gherkin = createGherkinScenarios(steps);
    expect(steps[0].when).toContain("Abra o menu de alertas.");
    expect(gherkin[0].content).toContain("Funcionalidade:");
  });

  it("mantém fontes e não cria informação ausente no manual", () => {
    const evidence: Evidence[] = [
      {
        id: "e1",
        sourceId: source.id,
        sourceName: source.name,
        kind: "texto",
        content: "Cerca geográfica",
      },
    ];
    const { knowledge, gaps } = analyzeKnowledge([source]);
    const manual = createManual(knowledge, [source], gaps, evidence);
    expect(manual).toContain("operacao.txt");
    expect(manual).toContain("Lacunas para revisão");
    expect(manual).toContain("informação não encontrada");
  });
});
