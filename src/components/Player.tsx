import { useRef, useState, useEffect } from "react";
import type { Title, WatchProgress } from "../domain/types";
import { Dialog } from "./Dialog";
import { Icon } from "./Icon";
export function Player({
  title,
  progress,
  onProgress,
  onClose,
}: {
  title: Title;
  progress?: WatchProgress;
  onProgress: (position: number, duration: number) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const restored = useRef(false);
  const lastSaved = useRef(-1);
  const save = () => {
    const video = ref.current;
    if (video && video.readyState > 0)
      onProgress(video.currentTime, video.duration);
  };
  const saveRef = useRef(save);
  saveRef.current = save;
  useEffect(() => {
    const save = () => saveRef.current();
    window.addEventListener("pagehide", save);
    const visibility = () => {
      if (document.hidden) save();
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      window.removeEventListener("pagehide", save);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  const close = () => {
    save();
    ref.current?.pause();
    onClose();
  };
  return (
    <Dialog
      label={`Player de ${title.name}`}
      onClose={close}
      className="player-dialog"
    >
      <div className="player-top">
        <button
          className="icon-button"
          aria-label="Fechar player"
          onClick={close}
          autoFocus
        >
          <Icon name="arrow" />
        </button>
        <div>
          <h2>{title.name}</h2>
          <span>REPRODUÇÃO DE DEMONSTRAÇÃO</span>
        </div>
      </div>
      <div className="video-wrap">
        <video
          ref={ref}
          controls
          autoPlay
          playsInline
          preload="metadata"
          aria-label={`Vídeo de demonstração de ${title.name}`}
          onLoadedMetadata={() => {
            const video = ref.current!;
            if (!restored.current) {
              restored.current = true;
              if (progress && progress.position / progress.duration < 0.95)
                video.currentTime = Math.min(progress.position, video.duration);
            }
          }}
          onTimeUpdate={() => {
            const video = ref.current!;
            const bucket = Math.floor(video.currentTime / 5);
            if (bucket !== lastSaved.current) {
              lastSaved.current = bucket;
              save();
            }
          }}
          onPause={save}
          onEnded={save}
          onError={() => setFailed(true)}
          src={title.video}
        />
        {failed && (
          <div className="video-error" role="alert">
            <Icon name="info" size={36} />
            <h3>Não foi possível carregar o vídeo.</h3>
            <p>Verifique sua conexão e tente novamente.</p>
            <button
              className="button primary"
              onClick={() => {
                setFailed(false);
                ref.current?.load();
                void ref.current?.play().catch(() => {});
              }}
            >
              Tentar novamente
            </button>
          </div>
        )}
      </div>
      <p className="player-credit">{title.demoCredit}</p>
    </Dialog>
  );
}
