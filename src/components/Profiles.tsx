import { profiles } from "../data/catalog";
import type { Profile } from "../domain/types";
import { Dialog } from "./Dialog";
import { Icon } from "./Icon";
export function Profiles({
  current,
  onSelect,
  onClose,
}: {
  current: string;
  onSelect: (p: Profile) => void;
  onClose: () => void;
}) {
  return (
    <Dialog
      label="Escolher perfil"
      onClose={onClose}
      className="profiles-dialog"
    >
      <button
        className="close-button"
        aria-label="Fechar perfis"
        onClick={onClose}
      >
        <Icon name="close" />
      </button>
      <span className="eyebrow">CADA PESSOA, UMA HISTÓRIA</span>
      <h2>Quem está assistindo?</h2>
      <p>Sua lista e suas próximas descobertas, do seu jeito.</p>
      <div className="profile-options">
        {profiles.map((p, index) => (
          <button
            key={p.id}
            style={{ animationDelay: `${index * 65}ms` }}
            aria-label={`Selecionar perfil ${p.name}`}
            aria-pressed={current === p.id}
            onClick={() => onSelect(p)}
          >
            <span className="avatar" style={{ background: p.color }}>
              <i />
              <i />
              <b />
            </span>
            <span>{p.name}</span>
            {current === p.id && <small>Perfil atual</small>}
          </button>
        ))}
      </div>
      <span className="local-note">
        Perfis de demonstração · Salvos neste navegador
      </span>
    </Dialog>
  );
}
