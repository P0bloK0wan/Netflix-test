import type { Title, WatchProgress } from "../domain/types";
export function TitleCard({
  title,
  onDetails,
  progress,
  rank,
}: {
  title: Title;
  onDetails: (title: Title) => void;
  progress?: WatchProgress;
  rank?: number;
}) {
  return (
    <div className={"card-wrap " + (rank ? "ranked" : "")}>
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
    </div>
  );
}
