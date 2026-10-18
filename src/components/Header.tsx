import { useEffect, useRef } from "react";
import type { Profile } from "../domain/types";
import { Icon } from "./Icon";
export type Tab = "home" | "series" | "film" | "list";
export function Header({
  tab,
  navigate,
  query,
  onSearch,
  searchOpen,
  setSearchOpen,
  profile,
  onProfiles,
}: {
  tab: Tab;
  navigate: (tab: Tab) => void;
  query: string;
  onSearch: (q: string) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  profile: Profile;
  onProfiles: () => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (searchOpen) input.current?.focus();
  }, [searchOpen]);
  return (
    <header className="header">
      <a
        className="brand"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          navigate("home");
        }}
        aria-label="Netflix Test — Início"
      >
        NETFLIX<span className="demo-mark">DEMO</span>
      </a>
      <nav aria-label="Navegação principal">
        {(
          [
            ["home", "Início"],
            ["series", "Séries"],
            ["film", "Filmes"],
            ["list", "Minha Lista"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            className={tab === value ? "nav-link active" : "nav-link"}
            aria-current={tab === value ? "page" : undefined}
            onClick={() => navigate(value)}
          >
            {label}
          </button>
        ))}
      </nav>
      <div className="header-actions">
        <div className={"search-control " + (searchOpen ? "expanded" : "")}>
          {searchOpen ? (
            <>
              <Icon name="search" size={19} />
              <input
                ref={input}
                type="search"
                aria-label="Buscar por título ou gênero"
                placeholder="Títulos, gêneros…"
                value={query}
                onChange={(e) => onSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    onSearch("");
                    setSearchOpen(false);
                  }
                }}
              />
              <button
                className="icon-button"
                aria-label="Fechar busca"
                onClick={() => {
                  onSearch("");
                  setSearchOpen(false);
                }}
              >
                <Icon name="close" size={18} />
              </button>
            </>
          ) : (
            <button
              className="icon-button"
              aria-label="Buscar títulos"
              onClick={() => setSearchOpen(true)}
            >
              <Icon name="search" />
            </button>
          )}
        </div>
        <span className="profile-name">{profile.name}</span>
        <button
          className="profile-trigger"
          aria-label="Trocar perfil"
          title="Trocar perfil"
          onClick={onProfiles}
        >
          <span className="avatar mini" style={{ background: profile.color }}>
            <i />
            <i />
            <b />
          </span>
          <span className="down-caret">▾</span>
        </button>
      </div>
    </header>
  );
}
