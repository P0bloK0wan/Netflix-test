import { useRef } from "react";
import { scrollBehavior } from "../useReveal";
import type { Title, WatchProgress } from "../domain/types";
import { TitleCard } from "./TitleCard";
import { Icon } from "./Icon";
export function TitleRow({
  name,
  subtitle,
  titles,
  onDetails,
  onPlay,
  onToggle,
  savedIds,
  ranked = false,
  progress = {},
}: {
  name: string;
  subtitle?: string;
  titles: Title[];
  onDetails: (t: Title) => void;
  onPlay: (t: Title) => void;
  onToggle: (t: Title) => void;
  savedIds: string[];
  ranked?: boolean;
  progress?: Record<string, WatchProgress>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <section className="title-section" data-reveal>
      <div className="section-heading">
        <div>
          <h2>
            {name}
            <span className="heading-dot">.</span>
          </h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <div className="row-controls">
          <button
            aria-label={`Voltar em ${name}`}
            onClick={() =>
              ref.current?.scrollBy({
                left: -ref.current.clientWidth * 0.8,
                behavior: scrollBehavior(),
              })
            }
          >
            <Icon
              name="chevron"
              size={18}
              style={{ transform: "rotate(180deg)" }}
            />
          </button>
          <button
            aria-label={`Avançar em ${name}`}
            onClick={() =>
              ref.current?.scrollBy({
                left: ref.current.clientWidth * 0.8,
                behavior: scrollBehavior(),
              })
            }
          >
            <Icon name="chevron" size={18} />
          </button>
        </div>
      </div>
      <div className={"title-row " + (ranked ? "ranked-row" : "")} ref={ref}>
        {titles.map((title, index) => (
          <TitleCard
            key={title.id}
            title={title}
            onDetails={onDetails}
            onPlay={onPlay}
            onToggle={onToggle}
            savedIds={savedIds}
            index={index}
            progress={progress[title.id]}
            rank={ranked ? index + 1 : undefined}
          />
        ))}
      </div>
    </section>
  );
}
