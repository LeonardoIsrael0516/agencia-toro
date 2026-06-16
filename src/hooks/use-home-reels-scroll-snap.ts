import { useEffect } from "react";

/** Ativa scroll-snap vertical no mobile da home, para a seção Reels encaixar em tela cheia. */
export function useHomeReelsScrollSnap() {
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");

    const apply = () => {
      document.documentElement.classList.toggle("home-reels-snap", mq.matches);
    };

    apply();
    mq.addEventListener("change", apply);

    return () => {
      mq.removeEventListener("change", apply);
      document.documentElement.classList.remove("home-reels-snap");
    };
  }, []);
}
