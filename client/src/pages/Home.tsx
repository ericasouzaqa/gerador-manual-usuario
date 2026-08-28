/**
 * Workspace do produto. Cada etapa mostra apenas o resultado necessário para
 * avançar e permite revisar antes de gerar a próxima saída.
 */
import { useEffect, useMemo, useState } from "react";
import { Copy, Download, FileText, Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { readDocument } from "@/lib/document-reader";
import {
  analyzeKnowledge,
  createGherkinScenarios,
  createManual,
  createStepScenarios,
} from "@/lib/workflow-engine";
import {
  Evidence,
  Gap,
  GherkinScenario,
  KnowledgeItem,
  SourceDocument,
  StepScenario,
} from "@/lib/workflow-model";

type Stage =
  | "fonte"
  | "entrega"
  | "conhecimento"
  | "step"
  | "gherkin"
  | "manual";
const stages: { id: Stage; label: string }[] = [
  { id: "fonte", label: "Fonte" },
  { id: "entrega", label: "Entrega" },
  { id: "conhecimento", label: "Conhecimento" },
  { id: "step", label: "STEP" },
  { id: "gherkin", label: "Gherkin" },
  { id: "manual", label: "Manual" },
];

function download(name: string, content: string, type = "text/plain") {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function Home() {
  const [stage, setStage] = useState<Stage>("fonte");
  const [sources, setSources] = useState<SourceDocument[]>([]);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([]);
  const [gaps, setGaps] = useState<Gap[]>([]);
  const [steps, setSteps] = useState<StepScenario[]>([]);
  const [gherkin, setGherkin] = useState<GherkinScenario[]>([]);
  const [manual, setManual] = useState("");
  const [delivery, setDelivery] = useState("Entrega principal");
  const [reading, setReading] = useState(false);
  const [versions, setVersions] = useState<
    { id: string; createdAt: string; content: string }[]
  >(() => {
    try {
      return JSON.parse(localStorage.getItem("manual-versions") ?? "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "manual-versions",
      JSON.stringify(versions.slice(0, 10))
    );
  }, [versions]);

  const readableCount = useMemo(
    () => sources.filter(source => source.status === "lido").length,
    [sources]
  );

  async function addFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    setReading(true);
    const results = await Promise.all(files.map(readDocument));
    setSources(current => [...current, ...results]);
    setReading(false);
    toast.success(
      `${results.length} arquivo${results.length > 1 ? "s" : ""} processado${results.length > 1 ? "s" : ""} neste dispositivo`
    );
    event.target.value = "";
  }

  function analyze() {
    const result = analyzeKnowledge(
      sources.map(source => ({
        ...source,
        rawText: source.rawText,
        evidence: source.evidence,
      }))
    );
    setKnowledge(result.knowledge);
    setGaps(result.gaps);
    setEvidence(result.evidence);
    setStage("entrega");
  }

  function createOutputs() {
    const generatedSteps = createStepScenarios(knowledge);
    const generatedGherkin = createGherkinScenarios(generatedSteps);
    const generatedManual = createManual(
      knowledge,
      sources.map(source => ({ ...source, evidence: source.evidence })),
      gaps,
      evidence
    );
    setSteps(generatedSteps);
    setGherkin(generatedGherkin);
    setManual(generatedManual);
    const version = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      content: generatedManual,
    };
    setVersions(current => [version, ...current]);
    setStage("step");
  }

  function exportWord() {
    const safeHtml = manual.replace(/&/g, "&amp;").replace(/</g, "&lt;");
    download(
      "manual-do-usuario.doc",
      `<html><meta charset="utf-8"><body><pre style="font-family:Arial;white-space:pre-wrap">${safeHtml}</pre></body></html>`,
      "application/msword"
    );
  }

  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
    toast.success("Conteúdo copiado");
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <img src="/manus-storage/arquivo-campo-mark_6fa76ed8.png" alt="" />
          <strong>Gerador de Manual do Usuário</strong>
        </div>
        <Button
          className="create-button"
          onClick={createOutputs}
          disabled={!knowledge.length}
        >
          <Plus size={15} /> Criar manual
        </Button>
      </header>
      <main className="workspace">
        <nav className="workflow-nav" aria-label="Fluxo do manual">
          {stages.map(item => (
            <button
              key={item.id}
              className={
                stage === item.id ? "workflow-step active" : "workflow-step"
              }
              onClick={() => setStage(item.id)}
              disabled={item.id !== "fonte" && !knowledge.length}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <section className="workspace-content">
          {stage === "fonte" && (
            <div className="work-card">
              <header>
                <div>
                  <p className="eyebrow">01 Fonte do documento</p>
                  <h1>Adicione os documentos</h1>
                  <p>
                    O conteúdo será lido neste dispositivo e mantido com sua
                    origem.
                  </p>
                </div>
                <label className="upload-button">
                  <Upload size={15} /> Adicionar arquivo
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.txt,.docx,.xlsx,.xls,.png,.jpg,.jpeg,.webp"
                    onChange={addFiles}
                  />
                </label>
              </header>
              <div className="source-list">
                {sources.length === 0 && (
                  <div className="empty-panel">
                    <FileText size={22} />
                    <p>Nenhum documento adicionado.</p>
                    <span>PDF, TXT, DOCX, XLSX e imagens.</span>
                  </div>
                )}
                {sources.map(source => (
                  <div className="source-row" key={source.id}>
                    <FileText size={17} />
                    <div>
                      <strong>{source.name}</strong>
                      <span
                        className={
                          source.status === "lido" ? "file-ok" : "file-warning"
                        }
                      >
                        {source.status === "lido"
                          ? `${source.evidence.length} evidências preservadas`
                          : source.message}
                      </span>
                      <details className="source-details">
                        <summary>Ver conteúdo preservado</summary>
                        <pre>{source.rawText || source.message}</pre>
                      </details>
                    </div>
                  </div>
                ))}
              </div>
              {sources.length > 0 && (
                <div className="work-footer">
                  <span>
                    {reading
                      ? "Lendo arquivos..."
                      : `${readableCount} de ${sources.length} arquivos com texto identificado`}
                  </span>
                  <Button onClick={analyze} disabled={reading}>
                    Analisar conteúdo
                  </Button>
                </div>
              )}
            </div>
          )}
          {stage === "entrega" && (
            <div className="work-card">
              <p className="eyebrow">02 Organização por entrega</p>
              <h1>Defina a entrega</h1>
              <p>Use um nome curto para agrupar o conhecimento encontrado.</p>
              <label className="field-label" htmlFor="delivery">
                Nome da entrega
              </label>
              <input
                className="text-input"
                id="delivery"
                value={delivery}
                onChange={event => setDelivery(event.target.value)}
              />
              <div className="work-footer">
                <span>
                  {evidence.length} evidências encontradas em {sources.length}{" "}
                  fontes
                </span>
                <Button onClick={() => setStage("conhecimento")}>
                  Revisar conhecimento
                </Button>
              </div>
            </div>
          )}
          {stage === "conhecimento" && (
            <div className="work-card">
              <p className="eyebrow">03 Revisão do entendimento</p>
              <h1>Conhecimento encontrado</h1>
              <p>Revise os campos antes de criar os cenários e o manual.</p>
              <div className="knowledge-list">
                {knowledge.map(item => (
                  <article className="knowledge-item" key={item.id}>
                    <h2>{item.name}</h2>
                    {item.fields.map(field => (
                      <div className="knowledge-field" key={field.label}>
                        <label>{field.label}</label>
                        <textarea
                          value={field.value}
                          readOnly={!field.confirmed}
                          onChange={() => undefined}
                        />
                        <small>
                          {field.confirmed
                            ? "Confirmado por evidência"
                            : "Gap: não identificado na fonte"}
                        </small>
                      </div>
                    ))}
                  </article>
                ))}
              </div>
              {gaps.length > 0 && (
                <div className="gap-box">
                  <strong>{gaps.length} gaps para revisão</strong>
                  <span>{gaps.map(gap => gap.question).join("; ")}</span>
                </div>
              )}
              <div className="work-footer">
                <span>O conteúdo não confirmado não será completado.</span>
                <Button onClick={createOutputs}>Criar manual</Button>
              </div>
            </div>
          )}
          {stage === "step" && (
            <ScenarioPanel
              title="04 Cenários STEP"
              empty="Nenhum cenário STEP foi identificado com segurança."
              items={steps.map(item => ({
                title: item.name,
                body: `Dado que ${item.given}\nQuando ${item.when}\nEntão ${item.then}`,
              }))}
              onNext={() => setStage("gherkin")}
              onCopy={copy}
            />
          )}
          {stage === "gherkin" && (
            <ScenarioPanel
              title="05 Gherkin"
              empty="Nenhum cenário Gherkin foi identificado com segurança."
              items={gherkin.map(item => ({
                title: item.name,
                body: item.content,
              }))}
              onNext={() => setStage("manual")}
              onCopy={copy}
            />
          )}
          {stage === "manual" && (
            <div className="work-card">
              <div className="manual-header">
                <div>
                  <p className="eyebrow">06 Manual do usuário</p>
                  <h1>Manual editável</h1>
                </div>
                <div className="action-row">
                  <Button variant="outline" onClick={() => copy(manual)}>
                    <Copy size={14} /> Copiar
                  </Button>
                  <Button variant="outline" onClick={() => window.print()}>
                    <Download size={14} /> PDF
                  </Button>
                  <Button variant="outline" onClick={exportWord}>
                    <Download size={14} /> Word
                  </Button>
                </div>
              </div>
              <textarea
                className="manual-editor"
                value={manual}
                onChange={event => setManual(event.target.value)}
              />
              {versions.length > 0 && (
                <p className="version-note">
                  Versão local criada em{" "}
                  {new Date(versions[0].createdAt).toLocaleString("pt-BR")}.{" "}
                  {delivery}
                </p>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function ScenarioPanel({
  title,
  empty,
  items,
  onNext,
  onCopy,
}: {
  title: string;
  empty: string;
  items: { title: string; body: string }[];
  onNext: () => void;
  onCopy: (text: string) => void;
}) {
  return (
    <div className="work-card">
      <p className="eyebrow">{title}</p>
      <h1>Revise os cenários</h1>
      <p>Os passos abaixo usam apenas evidências encontradas.</p>
      <div className="scenario-list">
        {items.length === 0 && (
          <div className="empty-panel">
            <p>{empty}</p>
          </div>
        )}
        {items.map(item => (
          <article className="scenario-item" key={item.title}>
            <h2>{item.title}</h2>
            <pre>{item.body}</pre>
            <Button variant="outline" onClick={() => onCopy(item.body)}>
              <Copy size={13} /> Copiar
            </Button>
          </article>
        ))}
      </div>
      <div className="work-footer">
        <span>
          {items.length} cenário{items.length === 1 ? "" : "s"}
        </span>
        <Button onClick={onNext}>Continuar</Button>
      </div>
    </div>
  );
}
