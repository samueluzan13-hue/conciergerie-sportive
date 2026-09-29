import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "../components/Icon";
import { MarcoLogo } from "../components/MarcoLogo";
import { QUARTIERS } from "../data/spots";
import { sendSuggestion, useCloud } from "../lib/cloud";
import { useStore } from "../lib/store";

export function Propose() {
  const navigate = useNavigate();
  const cloud = useCloud();
  const myQuartier = useStore((s) => s.profile.quartier);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [quartier, setQuartier] = useState(myQuartier);
  const [why, setWhy] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  return (
    <div className="page">
      <button className="back" onClick={() => navigate(-1)} aria-label="Retour"><Icon name="arrowLeft" size={20} /></button>
      <h1 className="serif page-title">Proposer une pépite</h1>
      <p className="muted">Un bar sans enseigne, une cour cachée, le meilleur falafel du quartier… Dis-nous tout, on vérifie et on l'ajoute.</p>

      {status === "sent" ? (
        <div className="card center-card">
          <MarcoLogo size={64} />
          <h2 className="serif">Merci, c'est noté !</h2>
          <p className="small muted">Marco va aller vérifier « {name} » en personne. Enfin, presque.</p>
          <button className="btn btn-ghost" onClick={() => { setName(""); setAddress(""); setWhy(""); setStatus("idle"); }}>En proposer une autre</button>
        </div>
      ) : (
        <form
          className="card form"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!name.trim()) return;
            setStatus("sending");
            try {
              await sendSuggestion({ name: name.trim(), address: address.trim(), quartier, why: why.trim() });
              setStatus("sent");
            } catch {
              setStatus("error");
            }
          }}
        >
          <label className="field"><span className="label">Nom du lieu</span>
            <input id="p-name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex. Le bar derrière la laverie" required maxLength={120} />
          </label>
          <label className="field"><span className="label">Adresse</span>
            <input id="p-address" className="input" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Numéro, rue" maxLength={200} />
          </label>
          <label className="field"><span className="label">Quartier</span>
            <select id="p-quartier" className="input" value={quartier} onChange={(e) => setQuartier(e.target.value)}>
              {QUARTIERS.map((q) => <option key={q.name}>{q.name}</option>)}
            </select>
          </label>
          <label className="field"><span className="label">Pourquoi c'est une pépite ?</span>
            <textarea id="p-why" className="input textarea" value={why} onChange={(e) => setWhy(e.target.value)} placeholder="Ce qu'il faut commander, le bon moment pour y aller…" maxLength={600} rows={4} />
          </label>
          {status === "error" && <p className="error small">L'envoi n'a pas marché. Vérifie que tu as bien le droit de contribuer à cette page, puis réessaie.</p>}
          {!cloud.db && <p className="small muted">La base de données n'est pas disponible ici : ta proposition ne pourra pas être envoyée.</p>}
          <button className="btn btn-primary btn-block" disabled={status === "sending" || !cloud.db}>
            {status === "sending" ? "Envoi…" : "Envoyer à Marco"}
          </button>
        </form>
      )}
    </div>
  );
}
