/**
 * Regras do produto. O motor apenas reorganiza evidências literais e marca o
 * que não foi encontrado. Ele não interpreta intenção nem cria comportamento.
 */
import {
  Evidence,
  Gap,
  GherkinScenario,
  KnowledgeField,
  KnowledgeItem,
  StepScenario,
} from "./workflow-model";

export type ReadResult = {
  id: string;
  name: string;
  format: string;
  status: "lido" | "parcial" | "visual" | "não suportado" | "erro";
  rawText: string;
  evidence: Evidence[];
  message?: string;
};

function lines(text: string) {
  return text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);
}

function isHeading(line: string) {
  return (
    line.length <= 90 &&
    !/[.!?]$/.test(line) &&
    !/^[-*\d]/.test(line) &&
    !/^como\b/i.test(line)
  );
}

export function documentsToEvidence(documents: ReadResult[]): Evidence[] {
  return documents.flatMap(document => {
    if (document.status !== "lido" || !document.rawText.trim()) return [];
    let currentSection = "Conteúdo sem seção identificada";
    return lines(document.rawText).map((content, index) => {
      if (isHeading(content)) currentSection = content;
      return {
        id: `${document.id}-e${index}`,
        sourceId: document.id,
        sourceName: document.name,
        kind:
          content.includes("\t") || content.includes(";") ? "tabela" : "texto",
        content,
        section: currentSection,
        preview: content.slice(0, 180),
      };
    });
  });
}

export function analyzeKnowledge(documents: ReadResult[]): {
  knowledge: KnowledgeItem[];
  gaps: Gap[];
  evidence: Evidence[];
} {
  const evidence = documentsToEvidence(documents);
  const grouped = new Map<string, Evidence[]>();
  evidence.forEach(item => {
    const name = item.section ?? "Conteúdo sem seção identificada";
    grouped.set(name, [...(grouped.get(name) ?? []), item]);
  });
  const allGaps: Gap[] = [];
  const knowledge = Array.from(grouped.entries()).map(
    ([name, items], index) => {
      const first = items[0];
      const fields: KnowledgeField[] = [
        {
          label: "O que é",
          value: name,
          evidenceIds: [first.id],
          confirmed: true,
        },
        {
          label: "Como utilizar",
          value:
            items
              .slice(1)
              .map(item => item.content)
              .join("\n") || "Não identificado nos documentos.",
          evidenceIds: items.slice(1).map(item => item.id),
          confirmed: items.length > 1,
        },
        {
          label: "Regras e resultado",
          value: "Não identificado nos documentos.",
          evidenceIds: [],
          confirmed: false,
        },
      ];
      const gaps: Gap[] = fields
        .filter(field => !field.confirmed)
        .map((field, gapIndex) => ({
          id: `gap-${index}-${gapIndex}`,
          question: `${field.label}: informação não encontrada`,
          sourceId: first.sourceId,
          sourceName: first.sourceName,
          reason: "O documento não apresenta evidência suficiente.",
        }));
      allGaps.push(...gaps);
      return {
        id: `knowledge-${index}`,
        name,
        fields,
        gaps,
        evidenceIds: items.map(item => item.id),
      };
    }
  );
  if (!knowledge.length)
    allGaps.push({
      id: "gap-empty",
      question: "Conteúdo identificável",
      reason: "Nenhum texto foi extraído com segurança.",
    });
  return { knowledge, gaps: allGaps, evidence };
}

export function createStepScenarios(
  knowledge: KnowledgeItem[]
): StepScenario[] {
  return knowledge.flatMap(item => {
    const action = (
      item.fields.find(field => field.label === "Como utilizar")?.value ?? ""
    )
      .split("\n")
      .filter(line => !/^como acessar$/i.test(line.trim()))
      .join("\n")
      .trim();
    if (!action || action === "Não identificado nos documentos.") return [];
    return [
      {
        id: `step-${item.id}`,
        name: item.name,
        given: `Dado que a funcionalidade está descrita na fonte`,
        when: `Quando o usuário executa: ${action.split("\n")[0]}`,
        then: "Então o resultado deve ser confirmado na documentação de origem.",
        evidenceIds: item.evidenceIds,
        gaps: item.gaps,
      },
    ];
  });
}

export function createGherkinScenarios(
  steps: StepScenario[]
): GherkinScenario[] {
  return steps.map(step => ({
    id: `gherkin-${step.id}`,
    name: step.name,
    content: `Funcionalidade: ${step.name}\n\n  Cenário: Uso descrito na documentação\n    Dado ${step.given.replace(/^Dado que /, "")}\n    Quando ${step.when.replace(/^Quando /, "")}\n    Então ${step.then.replace(/^Então /, "")}`,
    evidenceIds: step.evidenceIds,
    gaps: step.gaps,
  }));
}

export function createManual(
  knowledge: KnowledgeItem[],
  documents: ReadResult[],
  gaps: Gap[],
  evidence: Evidence[]
) {
  const sourceNames =
    documents.map(document => document.name).join(", ") || "nenhum documento";
  const sections = knowledge
    .map(item => {
      const body = item.fields
        .map(field => `### ${field.label}\n\n${field.value}`)
        .join("\n\n");
      const origin = item.evidenceIds
        .map(id => {
          const evidenceItem = evidence.find(entry => entry.id === id);
          return evidenceItem
            ? `Fonte: ${evidenceItem.sourceName}${evidenceItem.page ? `, página ${evidenceItem.page}` : ""}`
            : "";
        })
        .filter(Boolean)
        .join("\n");
      return `## ${item.name}\n\n${body}\n\n${origin}`;
    })
    .join("\n\n");
  const gapSection = gaps.length
    ? `\n\n## Lacunas para revisão\n\n${gaps.map(gap => `- ${gap.question}. ${gap.reason}`).join("\n")}`
    : "";
  return `# Manual do Usuário\n\nFontes utilizadas: ${sourceNames}.\n\nEste conteúdo foi organizado a partir das evidências encontradas. Revise antes de distribuir.\n\n${sections || "Nenhuma funcionalidade foi identificada."}${gapSection}`;
}
