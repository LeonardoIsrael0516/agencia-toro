import { useEffect, type RefObject } from "react";

const MOBILE_MQ = "(max-width: 1023px)";

/** Encaixa a seção Reels ao entrar vindo de cima ou de baixo — sem prender ao sair. */
export function useReelsScrollSettle(sectionRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const section = sectionRef.current;
    const mq = window.matchMedia(MOBILE_MQ);
    if (!section) return;

    let settleTimer: number | undefined;
    let lastScrollY = window.scrollY;
    let scrollDirection: "up" | "down" | null = null;

    function snapIfEnteringReels() {
      if (!mq.matches || !section || !scrollDirection) return;

      const vh = window.innerHeight;
      const y = window.scrollY;
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      const viewportBottom = y + vh;

      // Já encaixado
      if (Math.abs(y - sectionTop) <= 12) return;

      if (scrollDirection === "down") {
        // Vindo do Método: viewport ainda não passou do topo da seção
        const enteringFromAbove = y < sectionTop && viewportBottom > sectionTop + vh * 0.2;
        if (enteringFromAbove) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        return;
      }

      if (scrollDirection === "up") {
        // Vindo da Cultura: viewport ainda não passou do fim da seção
        const enteringFromBelow = viewportBottom > sectionBottom && y < sectionBottom - vh * 0.2;
        if (enteringFromBelow) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }

    function onScroll() {
      if (!mq.matches) return;

      const y = window.scrollY;
      if (y > lastScrollY) scrollDirection = "down";
      else if (y < lastScrollY) scrollDirection = "up";
      lastScrollY = y;

      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(snapIfEnteringReels, 120);
    }

    const onChange = () => {
      if (!mq.matches) window.clearTimeout(settleTimer);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    mq.addEventListener("change", onChange);

    return () => {
      window.removeEventListener("scroll", onScroll);
      mq.removeEventListener("change", onChange);
      window.clearTimeout(settleTimer);
    };
  }, [sectionRef]);
}
