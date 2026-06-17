export const NA_PRATICA_VIDEO_SRC = "https://media.agenciatoro.com.br/site.MOV";

let preloadStarted = false;

/** Inicia o download do vídeo da seção Na prática o mais cedo possível. */
export function preloadNaPraticaVideo() {
  if (preloadStarted || typeof document === "undefined") return;
  preloadStarted = true;

  if (!document.querySelector(`link[rel="preload"][href="${NA_PRATICA_VIDEO_SRC}"]`)) {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "video";
    link.href = NA_PRATICA_VIDEO_SRC;
    link.type = "video/quicktime";
    document.head.appendChild(link);
  }

  const existing = document.getElementById("na-pratica-video-preload") as HTMLVideoElement | null;
  if (existing) return;

  const video = document.createElement("video");
  video.id = "na-pratica-video-preload";
  video.preload = "auto";
  video.muted = true;
  video.playsInline = true;
  video.src = NA_PRATICA_VIDEO_SRC;
  video.tabIndex = -1;
  video.setAttribute("aria-hidden", "true");
  video.style.cssText = "position:fixed;width:0;height:0;opacity:0;pointer-events:none;";
  document.body.appendChild(video);
  video.load();
}
