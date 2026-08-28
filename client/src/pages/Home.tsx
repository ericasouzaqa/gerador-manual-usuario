/**
 * UX mínimo: duas telas e uma ação principal. A leitura e a criação do manual
 * acontecem localmente no navegador, sem API externa.
 */
import { useState } from "react";
import { Check, FileText, Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  createManual,
  LocalDocument,
  readDocument,
} from "@/lib/document-reader";

export default function Home() {
  const [screen, setScreen] = useState<"ler" | "manual">("ler");
  const [documents, setDocuments] = useState<LocalDocument[]>([]);
  const [manual, setManual] = useState("");
  const [reading, setReading] = useState(false);

  async function addFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    setReading(true);
    const results = await Promise.all(files.map(readDocument));
    setDocuments(current => [...current, ...results]);
    setReading(false);
    toast.success(
      `${results.length} arquivo${results.length > 1 ? "s" : ""} lido${results.length > 1 ? "s" : ""} localmente`
    );
    event.target.value = "";
  }

  function create() {
    if (!documents.length) {
      toast.error("Adicione um documento primeiro");
      setScreen("ler");
      return;
    }
    setManual(createManual(documents));
    setScreen("manual");
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <img src="/manus-storage/arquivo-campo-mark_6fa76ed8.png" alt="" />
          <strong>Gerador de Manual do Usuário</strong>
        </div>
        <nav className="tabs" aria-label="Telas">
          <button
            className={screen === "ler" ? "tab active" : "tab"}
            onClick={() => setScreen("ler")}
          >
            Ler documentos
          </button>
          <button
            className={screen === "manual" ? "tab active" : "tab"}
            onClick={() => setScreen("manual")}
          >
            Manual
          </button>
        </nav>
        <Button className="create-button" onClick={create}>
          <Plus size={15} /> Criar manual
        </Button>
      </header>
      <main className="page">
        {screen === "ler" ? (
          <section className="screen">
            <div className="screen-heading">
              <div>
                <h1>Ler documentos</h1>
                <p>Adicione os arquivos usados no manual.</p>
              </div>
              <label className="upload-button">
                <Upload size={15} /> Adicionar arquivo
                <input
                  type="file"
                  multiple
                  accept=".pdf,.txt"
                  onChange={addFiles}
                />
              </label>
            </div>
            <div className="file-panel">
              {!documents.length && (
                <div className="empty-panel">
                  <FileText size={22} />
                  <p>Nenhum documento adicionado.</p>
                  <span>Formatos disponíveis: PDF e TXT.</span>
                </div>
              )}
              {documents.map(document => (
                <div className="file-row" key={document.id}>
                  <div className="file-symbol">
                    <FileText size={17} />
                  </div>
                  <div>
                    <strong>{document.name}</strong>
                    <span
                      className={
                        document.status === "lido" ? "file-ok" : "file-warning"
                      }
                    >
                      {document.status === "lido" ? (
                        <>
                          <Check size={12} /> Texto lido neste dispositivo
                        </>
                      ) : (
                        document.message
                      )}
                    </span>
                  </div>
                </div>
              ))}
              {documents.length > 0 && (
                <>
                  <Separator />
                  <p className="read-status">
                    <span />{" "}
                    {reading
                      ? "Lendo arquivos..."
                      : `${documents.length} arquivo${documents.length > 1 ? "s" : ""} pronto${documents.length > 1 ? "s" : ""} para criar o manual`}
                  </p>
                </>
              )}
            </div>
          </section>
        ) : (
          <section className="screen manual-screen">
            <div className="screen-heading">
              <div>
                <h1>Manual</h1>
                <p>Revise e edite o conteúdo antes de usar.</p>
              </div>
            </div>
            <article className="manual">
              <label htmlFor="manual-content">Conteúdo do manual</label>
              <textarea
                id="manual-content"
                value={manual}
                onChange={event => setManual(event.target.value)}
                placeholder="Clique em Criar manual para gerar o conteúdo a partir dos documentos lidos."
              />
              {manual && (
                <p className="manual-note">
                  O texto foi criado somente com as informações encontradas nos
                  arquivos locais.
                </p>
              )}
            </article>
          </section>
        )}
      </main>
    </div>
  );
}
