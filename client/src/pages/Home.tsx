/**
 * UX mínimo: duas telas e uma ação principal. O usuário lê os arquivos,
 * cria o manual no topo e revisa o resultado. Nada além disso aparece.
 */
import { useState } from "react";
import { BookOpen, Check, FileText, Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const initialFiles = ["Manual de operações v3.pdf", "Fluxo de alertas.xlsx"];

export default function Home() {
  const [screen, setScreen] = useState<"ler" | "manual">("ler");
  const [files, setFiles] = useState(initialFiles);
  const [manualCreated, setManualCreated] = useState(false);

  function addFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const names = Array.from(event.target.files ?? []).map(file => file.name);
    if (!names.length) return;
    setFiles(current => [...names, ...current]);
    toast.success("Arquivo adicionado");
  }

  function createManual() {
    setManualCreated(true);
    setScreen("manual");
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <img src="/manus-storage/arquivo-campo-mark_6fa76ed8.png" alt="" />
          <strong>Arquivo de Campo</strong>
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
        <Button className="create-button" onClick={createManual}>
          <Plus size={15} /> Criar manual
        </Button>
      </header>

      <main className="page">
        {screen === "ler" ? (
          <section className="screen">
            <div className="screen-heading">
              <div>
                <h1>Ler documentos</h1>
                <p>Adicione os arquivos que devem ser usados no manual.</p>
              </div>
              <label className="upload-button">
                <Upload size={15} /> Adicionar arquivo
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.txt"
                  onChange={addFiles}
                />
              </label>
            </div>
            <div className="file-panel">
              {files.map(file => (
                <div className="file-row" key={file}>
                  <div className="file-symbol">
                    <FileText size={17} />
                  </div>
                  <div>
                    <strong>{file}</strong>
                    <span>
                      <Check size={12} /> Arquivo disponível neste dispositivo
                    </span>
                  </div>
                </div>
              ))}
              <Separator />
              <p className="read-status">
                <span /> {files.length} arquivos prontos para leitura
              </p>
            </div>
          </section>
        ) : (
          <section className="screen manual-screen">
            <div className="screen-heading">
              <div>
                <h1>Manual</h1>
                <p>Revise o conteúdo antes de usar.</p>
              </div>
            </div>
            <article className="manual">
              <p className="manual-label">MANUAL DE OPERAÇÃO</p>
              <h2>
                {manualCreated
                  ? "Manual criado a partir dos documentos"
                  : "Manual em branco"}
              </h2>
              <label htmlFor="manual-content">Conteúdo</label>
              <textarea
                id="manual-content"
                defaultValue={
                  manualCreated
                    ? "O que é?\n\nDescreva a funcionalidade com base nos documentos lidos.\n\nComo utilizar\n\n1. Consulte os documentos de origem.\n2. Revise as informações encontradas.\n3. Ajuste este conteúdo antes de finalizar."
                    : "Escreva o conteúdo do manual aqui."
                }
              />
              <p className="manual-note">
                O conteúdo pode ser editado antes da versão final.
              </p>
            </article>
          </section>
        )}
      </main>
    </div>
  );
}
