import type { CSSProperties } from "react";
import { Icon } from "./Icon";
import { ListMark } from "./ListMark";
import type { Title, WatchProgress } from "../domain/types";
export function TitleCard({
  title,
  onDetails,
  onPlay,
  onToggle,
  savedIds,
  index = 0,
  progress,
  rank,
}: {
  title: Title;
  onDetails: (title: Title) => void;
  onPlay: (title: Title) => void;
  onToggle: (title: Title) => void;
  savedIds: string[];
  index?: number;
  progress?: WatchProgress;
  rank?: number;
}) {
  const inList = savedIds.includes(title.id);
  return (
    <div
      className={"card-wrap " + (rank ? "ranked" : "")}
      style={
        { "--card-delay": `${Math.min(index, 5) * 45}ms` } as CSSProperties
      }
    >
      {rank && (
        <span className="rank-number" aria-hidden="true">
          {rank}
        </span>
      )}
      <button
        className="title-card"
        aria-label={`Ver detalhes de ${title.name}`}
        onClick={() => onDetails(title)}
      >
        <img src={title.image} alt="" loading="lazy" />
        <span className="card-shade" />
        <span className="card-brand" aria-hidden="true">
          N
        </span>
        <span className="card-type">
          {title.kind === "series" ? "SÉRIE" : "FILME"}
        </span>
        <span className="card-content">
          <span className="card-title" style={{ color: title.color }}>
            {title.name}
          </span>
          <span className="card-meta">
            {title.genres[0]} <span>•</span> {title.year}
          </span>
        </span>
        {progress && (
          <span className="progress-track">
            <span
              style={{
                width: `${(100 * progress.position) / progress.duration}%`,
              }}
            />
          </span>
        )}
      </button>
      <div className="card-quick-actions">
        <button
          className="quick-play"
          aria-label={`Assistir demonstração de ${title.name}`}
          onClick={() => onPlay(title)}
        >
          <Icon name="play" size={16} />
        </button>
        <button
          className="quick-save"
          aria-pressed={inList}
          aria-label={
            inList
              ? `Remover ${title.name} da Minha Lista`
              : `Adicionar ${title.name} à Minha Lista`
          }
          onClick={(event) => {
            const inSavedGrid =
              inList && event.currentTarget.closest('[data-list-view="true"]');
            const card = event.currentTarget.closest(".card-wrap");
            const neighbor =
              card?.nextElementSibling ?? card?.previousElementSibling;
            const nextFocus =
              neighbor?.querySelector<HTMLButtonElement>(".title-card");
            onToggle(title);
            if (inSavedGrid)
              requestAnimationFrame(() => {
                const target = nextFocus?.isConnected
                  ? nextFocus
                  : document.querySelector<HTMLButtonElement>(
                      ".empty-state .button",
                    );
                target?.focus();
              });
          }}
        >
          <ListMark saved={inList} size={18} />
        </button>
      </div>
    </div>
  );
}
