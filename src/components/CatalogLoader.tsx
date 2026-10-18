import { useEffect, useState } from "react";
import { fetchBootstrap, type Bootstrap } from "../api";
import App from "../App";
export function CatalogLoader() {
  const [data, setData] = useState<Bootstrap | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const timer = setTimeout(() => controller.abort(), 8000);
    setFailed(false);
    fetchBootstrap(controller.signal).then(result => { if (active) setData(result); })
      .catch(() => { if (active) setFailed(true); })
      .finally(() => clearTimeout(timer));
    return () => { active = false; clearTimeout(timer); controller.abort(); };
  }, [attempt]);
  if (data) return <App catalog={data.titles} profiles={data.profiles} />;
  return <main className="catalog-status">
    <span className="brand">NETFLIX<span className="demo-mark">DEMO</span></span>
    {failed ? <div role="alert">
      <h1>Não foi possível abrir o catálogo.</h1>
      <p>Verifique sua conexão e tente novamente.</p>
      <button className="button primary" onClick={() => { setFailed(false); setAttempt(n => n + 1); }}>Tentar novamente</button>
    </div> : <div role="status" aria-live="polite">
      <div className="loading-streams" aria-hidden="true"><i /><i /><i /></div>
      <h1>Preparando suas próximas histórias…</h1>
    </div>}
  </main>;
}
