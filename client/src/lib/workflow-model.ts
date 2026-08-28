/**
 * Contratos do fluxo. Saídas incompletas permanecem como gaps e apontam para
 * uma fonte local sempre que houver evidência.
 */
export type EvidenceKind = "texto" | "tabela" | "imagem";
export type Evidence = {
  id: string;
  sourceId: string;
  sourceName: string;
  kind: EvidenceKind;
  content: string;
  page?: number;
  section?: string;
  preview?: string;
};
export type SourceDocument = {
  id: string;
  name: string;
  format: string;
  status: "lido" | "parcial" | "erro";
  rawText: string;
  evidence: Evidence[];
  previewUrl?: string;
  message?: string;
};
export type Gap = {
  id: string;
  question: string;
  sourceId?: string;
  sourceName?: string;
  page?: number;
  reason: string;
};
export type KnowledgeField = {
  label: string;
  value: string;
  evidenceIds: string[];
  confirmed: boolean;
};
export type KnowledgeItem = {
  id: string;
  name: string;
  fields: KnowledgeField[];
  gaps: Gap[];
  evidenceIds: string[];
};
export type StepScenario = {
  id: string;
  name: string;
  given: string;
  when: string;
  then: string;
  evidenceIds: string[];
  gaps: Gap[];
};
export type GherkinScenario = {
  id: string;
  name: string;
  content: string;
  evidenceIds: string[];
  gaps: Gap[];
};
export type WorkflowState = {
  sources: SourceDocument[];
  knowledge: KnowledgeItem[];
  steps: StepScenario[];
  gherkin: GherkinScenario[];
  manual: string;
  versions: { id: string; createdAt: string; content: string }[];
};
