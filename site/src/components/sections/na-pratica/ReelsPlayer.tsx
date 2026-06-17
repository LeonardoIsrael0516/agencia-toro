import { useCallback, useEffect, useRef, useState } from "react";
import logoWhite from "@/assets/logo-white.png";
import { cn } from "@/lib/utils";

import { NA_PRATICA_VIDEO_SRC } from "@/lib/na-pratica-video";

type ReelsPlayerProps = {
  variant: "mobile" | "desktop";
  fullscreen?: boolean;
  active?: boolean;
  className?: string;
};

function formatCount(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "").replace(".", ",")} mi`;
  if (n >= 10_000) return `${Math.floor(n / 1000)} mil`;
  if (n >= 1_000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "").replace(".", ",")} mil`;
  return String(n);
}

function ReelsAction({
  label,
  count,
  onClick,
  active,
  compact,
  children,
}: {
  label: string;
  count: number;
  onClick?: () => void;
  active?: boolean;
  compact?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn("flex flex-col items-center text-white transition active:scale-90", compact ? "gap-0.5" : "gap-1")}
    >
      <span
        className={cn(
          "grid place-items-center drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]",
          compact ? "h-6 w-6" : "h-10 w-10",
          active ? "text-[#FF3040]" : "text-white",
        )}
      >
        {children}
      </span>
      <span
        className={cn(
          "min-w-[2rem] text-center font-semibold tabular-nums drop-shadow-md",
          compact ? "text-[9px]" : "text-[11px]",
        )}
      >
        {formatCount(count)}
      </span>
    </button>
  );
}

export function ReelsPlayer({ variant, fullscreen = false, active = true, className }: ReelsPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [likes, setLikes] = useState(847);
  const [comments, setComments] = useState(42);
  const [shares, setShares] = useState(18);
  const lastTapRef = useRef(0);
  const userUnmutedRef = useRef(false);

  const playMuted = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!userUnmutedRef.current) {
      video.muted = true;
      setMuted(true);
    }

    void video.play().catch(() => {});
  }, []);

  const pauseAndReset = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    userUnmutedRef.current = false;
    video.muted = true;
    setMuted(true);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    setMuted(true);

    const onTimeUpdate = () => {
      if (video.duration > 0) setProgress(video.currentTime / video.duration);
    };

    const onReady = () => {
      if (active) playMuted();
    };

    video.addEventListener("loadeddata", onReady);
    video.addEventListener("canplay", onReady);
    video.addEventListener("timeupdate", onTimeUpdate);

    if (active) {
      playMuted();
    } else {
      pauseAndReset();
    }

    return () => {
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("canplay", onReady);
      video.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [active, playMuted, pauseAndReset]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setLikes((n) => n + (Math.random() > 0.35 ? 1 : 0));
      if (Math.random() > 0.55) setComments((n) => n + 1);
      if (Math.random() > 0.7) setShares((n) => n + 1);
    }, 2600);

    return () => window.clearInterval(id);
  }, []);

  const unmute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    userUnmutedRef.current = true;
    video.currentTime = 0;
    setProgress(0);
    video.muted = false;
    setMuted(false);
    void video.play().catch(() => {});
  }, []);

  const triggerLike = useCallback(() => {
    setLiked(true);
    setLikes((n) => n + 1);
    setShowHeartBurst(true);
    window.setTimeout(() => setShowHeartBurst(false), 700);
  }, []);

  const handleVideoTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTapRef.current < 320) {
      triggerLike();
      lastTapRef.current = 0;
      return;
    }
    lastTapRef.current = now;
  }, [triggerLike]);

  const isDesktop = variant === "desktop";
  const isFullscreenMobile = !isDesktop && fullscreen;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative",
        isFullscreenMobile ? "h-full w-full" : "mx-auto",
        !isFullscreenMobile && (isDesktop ? "aspect-[9/16] h-[min(68vh,680px)] w-auto" : "w-full max-w-[min(100%,380px)]"),
        className,
      )}
    >
      {isDesktop ? (
        <div
          className="pointer-events-none absolute -inset-6 rounded-[2.75rem] bg-gradient-to-br from-[#006CFF]/15 via-[#00D8FF]/6 to-[#9DFF2F]/10 blur-2xl"
          aria-hidden
        />
      ) : null}

      <div
        className={cn(
          "relative overflow-hidden bg-black",
          isFullscreenMobile
            ? "h-full w-full"
            : isDesktop
              ? "h-full rounded-[2.5rem] border border-white/12 p-2.5 shadow-[0_36px_90px_-26px_rgba(0,108,255,0.5)]"
              : "rounded-[1.75rem] border border-white/10 shadow-[0_40px_100px_-30px_rgba(0,108,255,0.45)]",
        )}
      >
        {isDesktop ? (
          <div
            className="pointer-events-none absolute left-1/2 top-3.5 z-30 h-[20px] w-[76px] -translate-x-1/2 rounded-full bg-black/90"
            aria-hidden
          />
        ) : null}

        <div
          className={cn(
            "relative overflow-hidden bg-black",
            isDesktop && "h-full w-full rounded-[2rem]",
            !isDesktop && !isFullscreenMobile && "aspect-[9/16] w-full rounded-[1.35rem]",
            isFullscreenMobile && "h-full min-h-0 w-full",
          )}
        >
          <video
            ref={videoRef}
            src={NA_PRATICA_VIDEO_SRC}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            muted={muted}
            playsInline
            preload="auto"
            disablePictureInPicture
          >
            <track kind="captions" />
          </video>

          {/* Camada de toque — não bloqueia scroll vertical */}
          <div
            className="absolute inset-0 z-[5] touch-pan-y"
            onClick={handleVideoTap}
            aria-hidden
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent via-[22%] to-black/80" />

          {showHeartBurst ? (
            <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center">
              <svg
                width="88"
                height="88"
                viewBox="0 0 24 24"
                aria-hidden
                className="animate-in zoom-in-50 fade-in duration-300 text-[#FF3040] drop-shadow-lg"
              >
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill="currentColor"
                />
              </svg>
            </div>
          ) : null}

          {muted ? (
            <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center">
              <button
                type="button"
                aria-label="Ativar som"
                onClick={(e) => {
                  e.stopPropagation();
                  unmute();
                }}
                className={cn(
                  "pointer-events-auto flex flex-col items-center rounded-full transition active:scale-95",
                  isDesktop ? "gap-1" : "gap-2.5",
                )}
              >
                <span
                  className={cn(
                    "grid place-items-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md",
                    isDesktop ? "h-10 w-10" : "h-[4.5rem] w-[4.5rem]",
                  )}
                >
                  <svg width={isDesktop ? 16 : 26} height={isDesktop ? 16 : 26} viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M11 5 6 9H3v6h3l5 4V5z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
                    <path d="m16 9 5 5M21 9l-5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                  </svg>
                </span>
                <span
                  className={cn(
                    "rounded-full bg-black/45 font-medium text-white/90 backdrop-blur-sm",
                    isDesktop ? "px-2 py-0.5 text-[8px]" : "px-3 py-1 text-[11px]",
                  )}
                >
                  {isDesktop ? "Clique para som" : "Toque para ativar o som"}
                </span>
              </button>
            </div>
          ) : null}

          {/* Topo */}
          <div
            className={cn(
              "absolute inset-x-0 top-0 z-20 flex items-center gap-2 pb-2",
              isFullscreenMobile ? "px-4 pt-[max(0.75rem,env(safe-area-inset-top))]" : isDesktop ? "px-2.5 pt-2 pb-1" : "px-4 pt-3.5 sm:pt-4",
            )}
          >
            <span className={cn("grid overflow-hidden rounded-full ring-1 ring-white/30", isDesktop ? "h-4 w-4" : "h-7 w-7")}>
              <img src={logoWhite} alt="" className="h-full w-full object-contain bg-[var(--ink)] p-px" />
            </span>
            <span className={cn("font-semibold text-white drop-shadow-md", isDesktop ? "text-[10px]" : "text-[13px]")}>
              Reels
            </span>
          </div>

          {/* Rail direita */}
          <div
            className={cn(
              "absolute bottom-[26%] right-2 z-20 flex flex-col items-center sm:right-3",
              isDesktop ? "bottom-[22%] right-1 gap-1.5" : "gap-3.5 sm:gap-4",
            )}
          >
            <div className={cn("relative", isDesktop ? "mb-0" : "mb-1")}>
              <span className={cn("block overflow-hidden rounded-full ring-2 ring-white", isDesktop ? "h-6 w-6" : "h-10 w-10")}>
                <img src={logoWhite} alt="" className="h-full w-full object-contain bg-[var(--ink)] p-0.5" />
              </span>
              <span
                className={cn(
                  "absolute left-1/2 grid -translate-x-1/2 place-items-center rounded-full bg-[#0095F6] font-bold text-white ring-2 ring-black",
                  isDesktop ? "-bottom-0.5 h-2.5 w-2.5 text-[7px]" : "-bottom-1.5 h-4 w-4 text-[10px]",
                )}
              >
                +
              </span>
            </div>

            <ReelsAction label="Curtir" count={likes} active={liked} compact={isDesktop} onClick={triggerLike}>
              <svg width={isDesktop ? 18 : 28} height={isDesktop ? 18 : 28} viewBox="0 0 24 24" aria-hidden fill={liked ? "currentColor" : "none"}>
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  stroke="currentColor"
                  strokeWidth={liked ? 0 : 1.5}
                  fill={liked ? "currentColor" : "none"}
                />
              </svg>
            </ReelsAction>

            <ReelsAction label="Comentários" count={comments} compact={isDesktop}>
              <svg width={isDesktop ? 16 : 26} height={isDesktop ? 16 : 26} viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M21 11.5a8.38 8.38 0 0 1-1.9 5.4 8.5 8.5 0 0 1-6.6 3.1 8.38 8.38 0 0 1-3.9-.9L3 21l1.9-5.4a8.38 8.38 0 0 1-.9-3.9 8.5 8.5 0 0 1 3.1-6.6 8.38 8.38 0 0 1 5.4-1.9h.5a8.48 8.48 0 0 1 8 8v.3z"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinejoin="round"
                />
              </svg>
            </ReelsAction>

            <ReelsAction label="Compartilhar" count={shares} compact={isDesktop}>
              <svg width={isDesktop ? 16 : 26} height={isDesktop ? 16 : 26} viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="m22 2-7 7M22 2l-8.5 18-3.5-7.5L2 9l20-7z"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinejoin="round"
                />
              </svg>
            </ReelsAction>
          </div>

          {/* Rodapé — caption + áudio */}
          <div
            className={cn(
              "absolute inset-x-0 bottom-0 z-20",
              isFullscreenMobile
                ? "px-3.5 pt-12 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-4"
                : isDesktop
                  ? "px-2 pt-6 pb-2"
                  : "px-3.5 pt-12 pb-4 sm:px-4 sm:pb-5",
            )}
          >
            <p className={cn("font-semibold text-white drop-shadow-md", isDesktop ? "text-[10px]" : "text-sm")}>
              @agenciatoromkt
            </p>
            <p
              className={cn(
                "line-clamp-2 leading-snug text-white/95 drop-shadow-md",
                isDesktop ? "mt-0.5 text-[9px]" : "mt-2 text-[13px]",
              )}
            >
              Do diagnóstico à escala: marketing que faz chover resultados para clínicas e estética.
            </p>
            <div className={cn("flex items-center overflow-hidden", isDesktop ? "mt-1 gap-1" : "mt-2.5 gap-2")}>
              <svg width={isDesktop ? 8 : 12} height={isDesktop ? 8 : 12} viewBox="0 0 24 24" aria-hidden className="shrink-0 text-white">
                <path d="M9 18V5l12-7v13M6 9v10" fill="none" stroke="currentColor" strokeWidth="1.75" />
              </svg>
              <p className={cn("truncate text-white/85", isDesktop ? "text-[8px]" : "text-xs")}>
                <span className="font-medium">agenciatoromkt</span>
                <span className="text-white/60"> · Áudio original</span>
              </p>
            </div>
          </div>

          {/* Barra de progresso — embaixo */}
          <div className="absolute inset-x-0 bottom-0 z-30 px-0">
            <div className="h-[2px] bg-white/15">
              <div
                className="h-full origin-left rounded-full bg-white transition-[width] duration-150 ease-linear"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {isDesktop ? (
        <p className="mt-2.5 text-center text-[9px] tracking-wide text-foreground/30">
          Duplo clique para curtir · clique para ativar o som
        </p>
      ) : !isFullscreenMobile ? (
        <p className="mt-3 text-center text-[11px] text-foreground/40">Toque duas vezes para curtir</p>
      ) : null}
    </div>
  );
}
