/**
 * UX: uma tela, uma tarefa principal. Tipografia neutra, linguagem direta,
 * poucos destinos e ações consistentes. Sem ilustrações, métricas decorativas
 * ou termos técnicos desnecessários.
 */
import { useMemo, useState } from "react";
import {
  Check,
  ChevronRight,
  FileCheck2,
  FileText,
  FolderOpen,
  LockKeyhole,
  Search,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const items = [
  {
    name: "Cerca geográfica",
    detail: "12 evidências",
    status: "Revisar",
    className: "review",
  },
  {
    name: "Consulta de alertas",
    detail: "9 evidências",
    status: "Confirmada",
    className: "confirmed",
  },
  {
    name: "Cadastro de veículo",
    detail: "7 evidências",
    status: "Pendente",
    className: "pending",
  },
];

export default function Home() {
  const [tab, setTab] = useState("Análise");
  const [search, setSearch] = useState("");
  const [files, setFiles] = useState([
    "Manual de operações v3.pdf",
    "Fluxo de alertas.xlsx",
  ]);
  const filtered = useMemo(
    () =>
      items.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  const showMessage = (message: string) =>
    toast(message, { description: "Disponível na próxima versão." });
  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const names = Array.from(event.target.files ?? []).map(file => file.name);
    if (!names.length) return;
    setFiles(current => [...names, ...current]);
    toast.success("Arquivo adicionado", {
      description: "Ele ficará neste dispositivo.",
    });
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <img src="/manus-storage/arquivo-campo-mark_6fa76ed8.png" alt="" />
          <strong>Arquivo de Campo</strong>
        </div>
        <div className="project">
          <span /> Operação principal
        </div>
        <nav className="nav" aria-label="Navegação principal">
          <p>PROJETO</p>
          <button
            className={tab === "Documentos" ? "nav-item active" : "nav-item"}
            onClick={() => setTab("Documentos")}
          >
            <FolderOpen size={16} /> Documentos
          </button>
          <button
            className={tab === "Análise" ? "nav-item active" : "nav-item"}
            onClick={() => setTab("Análise")}
          >
            <FileCheck2 size={16} /> Análise
          </button>
          <button
            className={tab === "Manual" ? "nav-item active" : "nav-item"}
            onClick={() => setTab("Manual")}
          >
            <FileText size={16} /> Manual
          </button>
        </nav>
        <div className="local">
          <LockKeyhole size={14} />
          <span>Arquivos locais</span>
          <b>Ativo</b>
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <div className="crumb">
            <span>Operação principal</span>
            <ChevronRight size={13} />
            <b>{tab}</b>
          </div>
          <div className="top-actions">
            <div className="search">
              <Search size={15} />
              <Input
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="Buscar"
                aria-label="Buscar"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => showMessage("Ajuda")}
            >
              Ajuda
            </Button>
          </div>
        </header>
        <div className="content">
          <div className="heading">
            <div>
              <p className="label">ANÁLISE</p>
              <h1>Documentação do produto</h1>
              <p>Revise o conteúdo encontrado nos arquivos.</p>
            </div>
            <label className="primary-action">
              <Upload size={15} /> Adicionar arquivo
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.txt"
                onChange={handleUpload}
              />
            </label>
          </div>
          <div className="progress-row">
            <div className="progress-step done">
              <span>
                <Check size={12} />
              </span>
              <b>Documentos</b>
            </div>
            <div className="line done" />
            <div className="progress-step current">
              <span>2</span>
              <b>Análise</b>
            </div>
            <div className="line" />
            <div className="progress-step">
              <span>3</span>
              <b>Manual</b>
            </div>
          </div>
          <div className="layout">
            <Card>
              <CardHeader>
                <div>
                  <p className="label">RESULTADO</p>
                  <CardTitle>Funcionalidades encontradas</CardTitle>
                </div>
                <span className="percent">68%</span>
              </CardHeader>
              <CardContent>
                <Progress value={68} className="progress" />
                <div className="rows">
                  {filtered.map(item => (
                    <button
                      className="row"
                      key={item.name}
                      onClick={() => showMessage(item.name)}
                    >
                      <span className={`bar ${item.className}`} />
                      <span className="row-text">
                        <b>{item.name}</b>
                        <small>{item.detail}</small>
                      </span>
                      <span className={`status ${item.className}`}>
                        {item.status}
                      </span>
                      <ChevronRight size={14} />
                    </button>
                  ))}
                  {!filtered.length && (
                    <p className="empty">Nenhum resultado encontrado.</p>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div>
                  <p className="label">ARQUIVOS</p>
                  <CardTitle>Documentos</CardTitle>
                </div>
                <button
                  className="add-icon"
                  onClick={() => showMessage("Adicionar arquivo")}
                  aria-label="Adicionar arquivo"
                >
                  +
                </button>
              </CardHeader>
              <CardContent>
                <div className="file-list">
                  {files.slice(0, 4).map(file => (
                    <div className="file" key={file}>
                      <FileText size={15} />
                      <div>
                        <b>{file}</b>
                        <small>
                          <Check size={11} /> No dispositivo
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator />
                <button className="link" onClick={() => setTab("Documentos")}>
                  Ver documentos <ChevronRight size={13} />
                </button>
              </CardContent>
            </Card>
          </div>
          <div className="next">
            <div>
              <b>Próximo passo</b>
              <span>Revise as pendências antes de gerar o manual.</span>
            </div>
            <Button onClick={() => setTab("Manual")}>
              Abrir revisão <ChevronRight size={14} />
            </Button>
          </div>
          <p className="privacy">
            <LockKeyhole size={13} /> Seus arquivos não são enviados para
            serviços externos.
          </p>
        </div>
      </main>
    </div>
  );
}
