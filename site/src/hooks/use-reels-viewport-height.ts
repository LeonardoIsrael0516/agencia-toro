import { useEffect } from "react";

const MOBILE_MQ = "(max-width: 1023px)";

/** Mantém a seção Reels com a mesma altura da viewport visível (evita “vazar” a seção de baixo). */
export function useReelsViewportHeight() {
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const root = document.documentElement;

    const sync = () => {
      if (!mq.matches) {
        root.style.removeProperty("--reels-vh");
        return;
      }
      root.style.setProperty("--reels-vh", `${window.innerHeight}px`);
    };

    sync();
    window.addEventListener("resize", sync);
    window.addEventListener("orientationchange", sync);
    mq.addEventListener("change", sync);
    window.visualViewport?.addEventListener("resize", sync);

    return () => {
      window.removeEventListener("resize", sync);
      window.removeEventListener("orientationchange", sync);
      mq.removeEventListener("change", sync);
      window.visualViewport?.removeEventListener("resize", sync);
      root.style.removeProperty("--reels-vh");
    };
  }, []);
}
