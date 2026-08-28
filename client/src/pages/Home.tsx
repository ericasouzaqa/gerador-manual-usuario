/**
 * Design: interface clean e operacional. Apenas três etapas visíveis:
 * documentos, análise e manual. Sem linguagem promocional e sem chamadas de IA.
 */
import { useMemo, useState } from "react";
import {
  Check,
  ChevronRight,
  CircleAlert,
  FileCheck2,
  FileText,
  FolderOpen,
  LockKeyhole,
  Plus,
  Search,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const features = [
  {
    name: "Cerca geográfica",
    detail: "12 evidências",
    status: "Em revisão",
    tone: "review",
  },
  {
    name: "Consulta de alertas",
    detail: "9 evidências",
    status: "Confirmada",
    tone: "confirmed",
  },
  {
    name: "Cadastro de veículo",
    detail: "7 evidências",
    status: "Com gap",
    tone: "gap",
  },
];

const navigation = [
  { label: "Documentos", icon: FolderOpen },
  { label: "Análise", icon: FileCheck2 },
  { label: "Manual", icon: FileText },
];

function Status({
  tone,
  children,
}: {
  tone: string;
  children: React.ReactNode;
}) {
  return <span className={`status status-${tone}`}>{children}</span>;
}

export default function Home() {
  const [active, setActive] = useState("Análise");
  const [query, setQuery] = useState("");
  const [files, setFiles] = useState([
    "Manual de operações v3.pdf",
    "Fluxo de alertas.xlsx",
  ]);
  const [reviewDone, setReviewDone] = useState(false);
  const filteredFeatures = useMemo(
    () =>
      features.filter(feature =>
        feature.name.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  function notify(message: string) {
    toast(message, {
      description: "Esta ação será ampliada na próxima versão.",
    });
  }

  function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const names = Array.from(event.target.files ?? []).map(file => file.name);
    if (!names.length) return;
    setFiles(current => [...names, ...current]);
    toast.success("Documento adicionado", {
      description: "O arquivo permanece neste dispositivo.",
    });
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <img src="/manus-storage/arquivo-campo-mark_6fa76ed8.png" alt="" />
          <div>
            <strong>Arquivo de Campo</strong>
            <span>Conhecimento local</span>
          </div>
        </div>
        <div className="project-name">
          <span className="project-dot" /> Operação principal
        </div>
        <nav aria-label="Etapas do projeto" className="nav-list">
          <p>PROJETO</p>
          {navigation.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={active === label ? "nav-link active" : "nav-link"}
              onClick={() => setActive(label)}
            >
              <Icon size={17} />
              <span>{label}</span>
              {label === "Análise" && <span className="nav-number">12</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="local-status">
            <LockKeyhole size={15} />
            <span>Arquivos locais</span>
            <b>Ativo</b>
          </div>
          <Separator />
          <small>Versão 0.1 · protótipo</small>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="breadcrumb-muted">Operação principal</span>
            <ChevronRight size={14} />
            <strong>{active}</strong>
          </div>
          <div className="top-actions">
            <div className="search">
              <Search size={15} />
              <Input
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="Buscar"
                aria-label="Buscar funcionalidade"
              />
            </div>
            <Button variant="outline" size="sm" onClick={() => notify("Ajuda")}>
              Ajuda
            </Button>
          </div>
        </header>
        <div className="content">
          <section className="page-heading">
            <div>
              <p className="overline">ANÁLISE DO PROJETO</p>
              <h1>Documentação do produto</h1>
              <p>
                Confira o que foi encontrado e revise o que ainda precisa de
                confirmação.
              </p>
            </div>
            <label className="upload">
              <Upload size={16} /> Adicionar documento
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.txt"
                onChange={upload}
              />
            </label>
          </section>
          <section className="stepper" aria-label="Progresso do projeto">
            <div className="step complete">
              <span>
                <Check size={13} />
              </span>
              <div>
                <b>Documentos</b>
                <small>8 arquivos</small>
              </div>
            </div>
            <div className="step-line complete" />
            <div className="step current">
              <span>2</span>
              <div>
                <b>Análise</b>
                <small>Em andamento</small>
              </div>
            </div>
            <div className="step-line" />
            <div className="step">
              <span>3</span>
              <div>
                <b>Manual</b>
                <small>Aguardando revisão</small>
              </div>
            </div>
          </section>
          <section className="summary-grid">
            <Card>
              <CardContent>
                <div className="summary-icon green">
                  <FileText size={17} />
                </div>
                <div>
                  <small>Documentos</small>
                  <strong>08</strong>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="summary-icon green">
                  <FileCheck2 size={17} />
                </div>
                <div>
                  <small>Funcionalidades</small>
                  <strong>12</strong>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="summary-icon yellow">
                  <CircleAlert size={17} />
                </div>
                <div>
                  <small>Pendências</small>
                  <strong>04</strong>
                </div>
              </CardContent>
            </Card>
          </section>
          <section className="main-grid">
            <Card className="feature-card">
              <CardHeader>
                <div>
                  <p className="overline">RESULTADO DA ANÁLISE</p>
                  <CardTitle>Funcionalidades encontradas</CardTitle>
                </div>
                <span className="progress-label">68% concluído</span>
              </CardHeader>
              <CardContent>
                <Progress value={68} className="analysis-progress" />
                <div className="feature-list">
                  {filteredFeatures.map(feature => (
                    <button
                      className="feature-row"
                      key={feature.name}
                      onClick={() => notify(feature.name)}
                    >
                      <div className={`feature-bar ${feature.tone}`} />
                      <div className="feature-info">
                        <b>{feature.name}</b>
                        <small>{feature.detail} · origem registrada</small>
                      </div>
                      <Status tone={feature.tone}>{feature.status}</Status>
                      <ChevronRight size={15} />
                    </button>
                  ))}
                  {!filteredFeatures.length && (
                    <p className="empty">Nenhum resultado encontrado.</p>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="docs-card">
              <CardHeader>
                <div>
                  <p className="overline">ARQUIVOS DE ORIGEM</p>
                  <CardTitle>Documentos</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Adicionar documento"
                  onClick={() => notify("Adicionar documento")}
                >
                  <Plus size={16} />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="docs-list">
                  {files.slice(0, 4).map(file => (
                    <div className="doc-row" key={file}>
                      <div className="doc-icon">
                        <FileText size={16} />
                      </div>
                      <div>
                        <b>{file}</b>
                        <small>
                          <Check size={12} /> Lido neste dispositivo
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator />
                <button
                  className="text-link"
                  onClick={() => setActive("Documentos")}
                >
                  Ver todos os documentos <ChevronRight size={14} />
                </button>
              </CardContent>
            </Card>
          </section>
          <section className="next-step">
            <div>
              <b>Próximo passo</b>
              <p>Revise as 4 pendências antes de gerar o manual.</p>
            </div>
            <Button
              onClick={() => {
                setActive("Manual");
                setReviewDone(true);
              }}
            >
              Abrir revisão <ChevronRight size={15} />
            </Button>
          </section>
          <p className="privacy-line">
            <LockKeyhole size={14} /> Nenhum documento é enviado para serviço
            externo. Os arquivos ficam neste dispositivo.
          </p>
          {reviewDone && (
            <div className="confirmation">
              <Check size={15} /> Revisão aberta
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
