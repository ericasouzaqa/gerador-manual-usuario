/**
 * Design: Arquivo de Campo — editorial utilitário, marfim, grafite quente,
 * verde musgo de validação e âmbar para pendências. Esta página privilegia
 * evidência, próximo passo e leitura tranquila; não exibe linguagem técnica.
 */
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  CircleAlert,
  FileCheck2,
  FileText,
  FolderOpen,
  Laptop,
  LockKeyhole,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const evidenceImage = "/manus-storage/arquivo-campo-evidence-hero_3a3763d1.png";
const desktopImage = "/manus-storage/arquivo-campo-local-desktop_310f1bd5.png";

const features = [
  {
    name: "Cerca geográfica",
    detail: "Operação · 12 evidências",
    state: "Em revisão",
    tone: "review",
  },
  {
    name: "Consulta de alertas",
    detail: "Monitoramento · 9 evidências",
    state: "Confirmada",
    tone: "confirmed",
  },
  {
    name: "Cadastro de veículo",
    detail: "Cadastros · 7 evidências",
    state: "Com gap",
    tone: "gap",
  },
];

const navItems = [
  { label: "Visão geral", icon: BookOpen },
  { label: "Documentos", icon: FolderOpen },
  { label: "Funcionalidades", icon: Sparkles },
  { label: "Manuais", icon: FileCheck2 },
];

function StateBadge({
  tone,
  children,
}: {
  tone: string;
  children: React.ReactNode;
}) {
  const styles =
    tone === "confirmed"
      ? "state-confirmed"
      : tone === "gap"
        ? "state-gap"
        : "state-review";
  return <Badge className={`state-badge ${styles}`}>{children}</Badge>;
}

export default function Home() {
  const [activeNav, setActiveNav] = useState("Visão geral");
  const [query, setQuery] = useState("");
  const [files, setFiles] = useState<string[]>([
    "Manual de operações v3.pdf",
    "Fluxo de alertas.xlsx",
  ]);
  const [approved, setApproved] = useState(false);
  const filtered = useMemo(
    () =>
      features.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const names = Array.from(event.target.files ?? []).map(file => file.name);
    if (!names.length) return;
    setFiles(current => [...names, ...current]);
    toast.success(
      `${names.length} documento${names.length > 1 ? "s" : ""} adicionado${names.length > 1 ? "s" : ""}.`,
      { description: "Pronto para a etapa de leitura." }
    );
  }

  function handleAction(message: string) {
    toast(message, {
      description: "Esta ação está disponível no próximo ciclo do protótipo.",
    });
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <img
            src="/manus-storage/arquivo-campo-mark_6fa76ed8.png"
            alt=""
            className="brand-mark"
          />
          <div>
            <strong>arquivo de campo</strong>
            <span>conhecimento local</span>
          </div>
        </div>
        <div className="workspace-switcher">
          <span className="workspace-dot" /> <span>Operação principal</span>
          <ChevronRight size={15} />
        </div>
        <nav className="main-nav" aria-label="Navegação principal">
          <p className="nav-caption">ESPAÇO DE TRABALHO</p>
          {navItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${activeNav === label ? "active" : ""}`}
              onClick={() => setActiveNav(label)}
            >
              <Icon size={17} />
              <span>{label}</span>
              {label === "Manuais" && <span className="nav-count">2</span>}
            </button>
          ))}
          <p className="nav-caption nav-caption-spaced">CONFIANÇA</p>
          <button
            className="nav-item"
            onClick={() => handleAction("Comparação entre versões")}
          >
            <FileText size={17} />
            <span>Versões e origem</span>
          </button>
          <button
            className="nav-item"
            onClick={() => handleAction("Preferências locais")}
          >
            <LockKeyhole size={17} />
            <span>Privacidade local</span>
          </button>
        </nav>
        <div className="sidebar-bottom">
          <div className="local-note">
            <ShieldCheck size={17} />
            <div>
              <strong>Seus arquivos ficam aqui</strong>
              <span>Processamento local ativado</span>
            </div>
          </div>
          <div className="profile-row">
            <div className="avatar">IS</div>
            <div>
              <strong>Ivan Santos</strong>
              <span>Administrador</span>
            </div>
            <MoreHorizontal size={17} />
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumbs">
            <span>Operação principal</span>
            <ChevronRight size={15} />
            <strong>{activeNav}</strong>
          </div>
          <div className="topbar-actions">
            <div className="search-wrap">
              <Search size={16} />
              <Input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Buscar funcionalidade"
                aria-label="Buscar funcionalidade"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction("Central de ajuda")}
            >
              Ajuda
            </Button>
          </div>
        </header>
        <div className="page-wrap">
          <section className="intro-row">
            <div>
              <p className="eyebrow">
                QUARTA-FEIRA, 27 DE AGOSTO · CICLO DE REVISÃO 01
              </p>
              <h1>
                O que já está claro.
                <br />
                <span className="headline-soft">O que pede decisão.</span>
              </h1>
              <p className="intro-copy">
                Uma visão de trabalho para separar evidências confirmadas,
                pontos em revisão e informações que ainda não aparecem nos
                documentos.
              </p>
              <div className="state-legend">
                <span>
                  <i className="legend-dot confirmed-dot" /> Confirmado
                </span>
                <span>
                  <i className="legend-dot review-dot" /> Em revisão
                </span>
                <span>
                  <i className="legend-dot gap-dot" /> Gap encontrado
                </span>
              </div>
            </div>
            <label className="upload-button">
              <Upload size={17} />
              <span>Adicionar documentos</span>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.txt"
                onChange={handleUpload}
              />
            </label>
          </section>
          <section className="hero-card">
            <div className="hero-copy">
              <div className="hero-kicker">
                <span className="live-dot" /> PRÓXIMO PASSO · REVISÃO HUMANA
              </div>
              <h2>
                Manual de operação
                <br />
                <em>aguarda contexto.</em>
              </h2>
              <p>
                O mapa já reúne 12 funcionalidades. Antes de publicar, faltam
                quatro decisões sobre regras, permissões e comportamento
                esperado.
              </p>
              <div className="decision-row">
                <div>
                  <strong>09</strong>
                  <span>com origem</span>
                </div>
                <div>
                  <strong>04</strong>
                  <span>para revisar</span>
                </div>
                <div>
                  <strong>02</strong>
                  <span>sem definição</span>
                </div>
              </div>
              <div className="hero-progress">
                <div>
                  <span>Progresso da primeira versão</span>
                  <strong>68%</strong>
                </div>
                <Progress value={68} />
              </div>
              <Button
                className="hero-cta"
                onClick={() => setActiveNav("Manuais")}
              >
                Abrir fila de revisão <ArrowUpRight size={16} />
              </Button>
            </div>
            <div className="hero-image">
              <img
                src={evidenceImage}
                alt="Documentos e marcadores de evidência sobre uma mesa"
              />
            </div>
          </section>
          <section className="metrics-grid">
            <Card className="metric-card">
              <CardContent>
                <div className="metric-icon moss">
                  <FileText size={18} />
                </div>
                <div>
                  <span className="metric-label">Documentos lidos</span>
                  <strong>08</strong>
                  <small>+2 nesta semana</small>
                </div>
              </CardContent>
            </Card>
            <Card className="metric-card">
              <CardContent>
                <div className="metric-icon amber">
                  <CircleAlert size={18} />
                </div>
                <div>
                  <span className="metric-label">Pontos para revisar</span>
                  <strong>04</strong>
                  <small>2 precisam de confirmação</small>
                </div>
              </CardContent>
            </Card>
            <Card className="metric-card">
              <CardContent>
                <div className="metric-icon ink">
                  <FileCheck2 size={18} />
                </div>
                <div>
                  <span className="metric-label">Funcionalidades mapeadas</span>
                  <strong>12</strong>
                  <small>9 com origem registrada</small>
                </div>
              </CardContent>
            </Card>
          </section>
          <section className="content-grid">
            <Card className="features-card">
              <CardHeader>
                <div>
                  <p className="card-overline">MAPA DO PRODUTO</p>
                  <CardTitle>Funcionalidades encontradas</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveNav("Funcionalidades")}
                >
                  Ver todas <ArrowUpRight size={15} />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="feature-list">
                  {filtered.map(feature => (
                    <button
                      className="feature-row"
                      key={feature.name}
                      onClick={() => handleAction(`Abrindo ${feature.name}`)}
                    >
                      <span className="feature-marker" />
                      <div className="feature-info">
                        <strong>{feature.name}</strong>
                        <span>{feature.detail}</span>
                      </div>
                      <StateBadge tone={feature.tone}>
                        {feature.state}
                      </StateBadge>
                      <ChevronRight size={16} className="row-arrow" />
                    </button>
                  ))}
                  {!filtered.length && (
                    <div className="empty-state">
                      Nenhuma funcionalidade encontrada para “{query}”.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="documents-card">
              <CardHeader>
                <div>
                  <p className="card-overline">ORIGEM</p>
                  <CardTitle>Documentos recentes</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Adicionar documento"
                  onClick={() => handleAction("Adicionar documento")}
                >
                  <Plus size={17} />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="document-list">
                  {files.slice(0, 3).map((file, index) => (
                    <div className="document-row" key={`${file}-${index}`}>
                      <div className="file-icon">
                        <FileText size={17} />
                      </div>
                      <div>
                        <strong>{file}</strong>
                        <span>
                          {index === 0
                            ? "Adicionado agora · PDF"
                            : "Lido há 2 horas · XLSX"}
                        </span>
                      </div>
                      <Check size={16} className="document-check" />
                    </div>
                  ))}
                </div>
                <Separator />
                <button
                  className="all-docs-link"
                  onClick={() => setActiveNav("Documentos")}
                >
                  Ver todos os documentos <ArrowUpRight size={15} />
                </button>
              </CardContent>
            </Card>
          </section>
          <section className="evidence-strip">
            <div className="evidence-label">
              <FileCheck2 size={16} />
              <span>LEITURA RASTREÁVEL</span>
            </div>
            <p>
              Cada ponto do manual pode voltar ao documento de origem. Quando a
              informação não existe, o sistema registra a ausência em vez de
              completar por conta própria.
            </p>
            <button onClick={() => handleAction("Visibilidade das evidências")}>
              Como funciona <ArrowUpRight size={14} />
            </button>
          </section>
          <section className="privacy-strip">
            <div className="privacy-symbol">
              <Laptop size={19} />
            </div>
            <div>
              <strong>Uma base local, do seu jeito.</strong>
              <span>
                Este protótipo não envia seus documentos para serviços externos.
                A arquitetura foi pensada para funcionar no navegador e, depois,
                como aplicação de computador.
              </span>
            </div>
            <img src={desktopImage} alt="Estação de trabalho local" />
          </section>
          <footer className="page-footer">
            <span>Arquivo de Campo · versão de trabalho 0.1</span>
            <span>
              <span className="footer-dot" /> Tudo salvo neste dispositivo
            </span>
          </footer>
        </div>
      </main>
      {approved && (
        <div className="approval-toast">
          <Check size={16} /> Versão marcada para aprovação humana
        </div>
      )}
      <button className="floating-review" onClick={() => setApproved(true)}>
        <FileCheck2 size={17} /> Marcar revisão concluída
      </button>
    </div>
  );
}
