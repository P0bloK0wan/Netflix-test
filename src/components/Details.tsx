import type { Title } from "../domain/types";
import { Dialog } from "./Dialog";
import { Icon } from "./Icon";
import { ListMark } from "./ListMark";
export function Details({
  title,
  inList,
  onToggle,
  onPlay,
  onClose,
}: {
  title: Title;
  inList: boolean;
  onToggle: () => void;
  onPlay: () => void;
  onClose: () => void;
}) {
  return (
    <Dialog
      label={`Detalhes de ${title.name}`}
      onClose={onClose}
      className="details-dialog"
    >
      <div className="detail-art">
        <img src={title.image} alt="" />
        <div className="detail-gradient" />
        <button
          className="close-button"
          aria-label="Fechar detalhes"
          onClick={onClose}
          autoFocus
        >
          <Icon name="close" />
        </button>
        <div className="detail-heading">
          <span className="eyebrow">
            {title.kind === "series" ? "SÉRIE" : "FILME"} · CATÁLOGO DEMO
          </span>
          <h2>{title.name}</h2>
          <div className="button-group">
            <button className="button primary" onClick={onPlay}>
              <Icon name="play" />
              Assistir demonstração
            </button>
            <button
              className={"round-button " + (inList ? "selected" : "")}
              aria-label={
                inList ? "Remover da Minha Lista" : "Adicionar à Minha Lista"
              }
              title={
                inList ? "Remover da Minha Lista" : "Adicionar à Minha Lista"
              }
              onClick={onToggle}
              aria-pressed={inList}
            >
              <ListMark saved={inList} />
            </button>
          </div>
        </div>
      </div>
      <div className="detail-body">
        <div className="metadata">
          <span className="new-label">Disponível na demo</span>
          <span>{title.year}</span>
          <span className="rating">{title.rating}</span>
          <span>{title.duration}</span>
        </div>
        <p className="synopsis">{title.synopsis}</p>
        <p className="detail-genres">
          <span>Gêneros:</span> {title.genres.join(", ")}
        </p>
        <aside className="demo-note">
          <Icon name="info" size={18} />
          <div>
            <strong>Uma experiência de demonstração</strong>
            <p>
              {title.demoCredit}. A duração indicada no catálogo fictício não
              representa o trailer reproduzido.
            </p>
          </div>
        </aside>
      </div>
    </Dialog>
  );
}
