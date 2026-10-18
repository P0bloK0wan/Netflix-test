import { useMemo, useState } from "react";
import { catalog, profiles } from "./data/catalog";
import { filterTitles } from "./domain/catalog";
import { browserStorage, createLibrary } from "./domain/storage";
import type { Profile, Title } from "./domain/types";
import { Header, type Tab } from "./components/Header";
import { Icon } from "./components/Icon";
import { TitleRow } from "./components/TitleRow";
import { TitleCard } from "./components/TitleCard";
import { Details } from "./components/Details";
import { Profiles } from "./components/Profiles";
import { Player } from "./components/Player";
const PROFILE_KEY = "netflix-demo.active-profile";
const initialProfile = () => {
  try {
    return (
      profiles.find((p) => p.id === browserStorage()?.getItem(PROFILE_KEY)) ??
      profiles[0]
    );
  } catch {
    return profiles[0];
  }
};
export default function App() {
  const [library] = useState(() => createLibrary(browserStorage()));
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [revision, refresh] = useState(0);
  const state = useMemo(
    () => library.read(profile.id),
    [library, profile.id, revision],
  );
  const [tab, setTab] = useState<Tab>("home");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [details, setDetails] = useState<Title | null>(null);
  const [player, setPlayer] = useState<Title | null>(null);
  const [showProfiles, setShowProfiles] = useState(false);
  const featured = catalog[0];
  const navigate = (next: Tab) => {
    setTab(next);
    setQuery("");
    setSearchOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const selectProfile = (next: Profile) => {
    setProfile(next);
    try {
      browserStorage()?.setItem(PROFILE_KEY, next.id);
    } catch {
      /* Profile still changes in this session. */
    }
    setShowProfiles(false);
  };
  const toggle = (title: Title) => {
    library.toggle(profile.id, title.id);
    refresh((v) => v + 1);
  };
  const play = (title: Title) => {
    setDetails(null);
    setPlayer(title);
  };
  const continueWatching = catalog
    .filter((t) => {
      const p = state.progress[t.id];
      return p && p.position > 1 && p.position / p.duration < 0.95;
    })
    .sort(
      (a, b) => state.progress[b.id].updatedAt - state.progress[a.id].updatedAt,
    );
  const source =
    tab === "list" ? catalog.filter((t) => state.list.includes(t.id)) : catalog;
  const results = filterTitles(
    source,
    query,
    tab === "film" || tab === "series" ? tab : undefined,
  );
  const isHome = tab === "home" && !query.trim();
  const headings = {
    home: "Todas as histórias",
    film: "Filmes para todos os momentos",
    series: "Só mais um episódio",
    list: "Minha Lista",
  };
  return (
    <>
      <a className="skip-link" href="#content">
        Pular para o conteúdo
      </a>
      <Header
        tab={tab}
        navigate={navigate}
        query={query}
        onSearch={setQuery}
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
        profile={profile}
        onProfiles={() => setShowProfiles(true)}
      />
      <main id="content">
        {isHome ? (
          <>
            <section className="hero" aria-label="Destaque da semana">
              <img
                className="hero-image"
                src={featured.image}
                alt="Montanhas ao pôr do sol"
                fetchPriority="high"
              />
              <div className="hero-overlay" />
              <div className="hero-content">
                <div className="hero-kicker">
                  <span className="netflix-n">N</span>
                  <span>HISTÓRIAS PARA DESCOBRIR</span>
                </div>
                <p className="hero-eyebrow">EXPLORE O EXTRAORDINÁRIO</p>
                <h1>
                  Além do
                  <br />
                  <span>Horizonte</span>
                </h1>
                <div className="hero-meta">
                  <span className="feature-badge">DESTAQUE</span>
                  <span>2026</span>
                  <span>•</span>
                  <span>Aventura</span>
                  <span>•</span>
                  <span>1h 48min</span>
                </div>
                <p className="hero-description">
                  Às vezes, é preciso ir mais longe
                  <br className="desktop-break" /> para encontrar o que está
                  dentro de você.
                </p>
                <div className="button-group">
                  <button
                    className="button primary"
                    aria-label="Assistir agora"
                    onClick={() => play(featured)}
                  >
                    <Icon name="play" size={25} />
                    Assistir
                  </button>
                  <button
                    className="button secondary"
                    onClick={() => setDetails(featured)}
                  >
                    <Icon name="info" size={23} />
                    Mais informações
                  </button>
                </div>
                <p className="hero-demo">
                  Catálogo fictício · Vídeos de demonstração
                </p>
              </div>
              <div className="hero-side">
                <span className="hero-page">
                  <b>01</b> / 06
                </span>
                <span className="age-rating">12</span>
              </div>
            </section>
            <div className="home-content">
              <TitleRow
                name="Sua próxima descoberta"
                subtitle="Histórias que merecem um lugar na sua lista."
                titles={catalog.slice(1, 8)}
                onDetails={setDetails}
              />
              {continueWatching.length > 0 && (
                <TitleRow
                  name="Continue de onde parou"
                  titles={continueWatching}
                  onDetails={setDetails}
                  progress={state.progress}
                />
              )}
              <TitleRow
                name="Em alta nesta demonstração"
                titles={[
                  catalog[5],
                  catalog[0],
                  catalog[1],
                  catalog[4],
                  catalog[2],
                  catalog[8],
                ]}
                onDetails={setDetails}
                ranked
              />
              <section className="discovery-banner">
                <img src="/media/ocean.jpg" alt="" loading="lazy" />
                <div>
                  <span className="eyebrow">MUDE DE PERSPECTIVA</span>
                  <h2>
                    O mundo tem
                    <br />
                    muito para contar.
                  </h2>
                  <p>Uma pausa na rotina. Uma janela para o extraordinário.</p>
                  <button
                    className="button outline"
                    onClick={() => {
                      setQuery("Documentário");
                      setSearchOpen(true);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Explorar documentários
                    <Icon name="chevron" size={17} />
                  </button>
                </div>
                <span className="banner-index" aria-hidden="true">
                  NATUREZA &<br />
                  DESCOBERTAS
                </span>
              </section>
              <TitleRow
                name="Uma dose de aventura"
                titles={filterTitles(catalog, "aventura")}
                onDetails={setDetails}
              />
              <TitleRow
                name="Cinema aberto, grandes histórias"
                subtitle="Trailers de produções da Blender Foundation."
                titles={catalog.slice(-2)}
                onDetails={setDetails}
              />
            </div>
          </>
        ) : (
          <section className="browse-page">
            <div className="browse-heading">
              <span className="eyebrow">SEU PRÓXIMO PLAY ESTÁ AQUI</span>
              <h1>
                {query.trim()
                  ? `Resultados para “${query.trim()}”`
                  : headings[tab]}
              </h1>
              <p>
                {tab === "list" && !query.trim()
                  ? "As histórias que você escolheu guardar."
                  : `${results.length} ${results.length === 1 ? "história para descobrir" : "histórias para descobrir"}`}
              </p>
            </div>
            {results.length ? (
              <div className="catalog-grid">
                {results.map((t) => (
                  <TitleCard key={t.id} title={t} onDetails={setDetails} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">
                  <Icon
                    name={tab === "list" && !query ? "plus" : "search"}
                    size={36}
                  />
                </span>
                <h2>
                  {tab === "list" && !query
                    ? "Sua lista começa com uma boa história."
                    : "Nenhuma história por aqui. Ainda."}
                </h2>
                <p>
                  {tab === "list" && !query
                    ? "Abra os detalhes de um título e toque em + para guardar."
                    : "Tente buscar por outro título ou gênero, como aventura."}
                </p>
                <button
                  className="button outline"
                  onClick={() => navigate("home")}
                >
                  Explorar o catálogo
                  <Icon name="chevron" size={18} />
                </button>
              </div>
            )}
          </section>
        )}
      </main>
      <footer>
        <div className="footer-top">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("home");
            }}
            className="brand"
          >
            NETFLIX<span className="demo-mark">DEMO</span>
          </a>
          <span>Boas histórias merecem ser descobertas.</span>
          <span className="language">
            <Icon name="globe" size={17} />
            Português (Brasil)
          </span>
        </div>
        <div className="footer-bottom">
          <p>
            Projeto de demonstração independente. Sem vínculo com a Netflix.
            <br />
            Catálogo fictício e trailers abertos. Preferências salvas somente
            neste navegador.
          </p>
          <span>
            FEITO PARA EXPLORAR <span className="red-dot">●</span>
          </span>
        </div>
      </footer>
      {details && (
        <Details
          title={details}
          inList={state.list.includes(details.id)}
          onToggle={() => toggle(details)}
          onPlay={() => play(details)}
          onClose={() => setDetails(null)}
        />
      )}
      {showProfiles && (
        <Profiles
          current={profile.id}
          onSelect={selectProfile}
          onClose={() => setShowProfiles(false)}
        />
      )}
      {player && (
        <Player
          key={`${profile.id}:${player.id}`}
          title={player}
          progress={state.progress[player.id]}
          onClose={() => setPlayer(null)}
          onProgress={(position, duration) => {
            library.progress(profile.id, player.id, position, duration);
            refresh((v) => v + 1);
          }}
        />
      )}
    </>
  );
}
