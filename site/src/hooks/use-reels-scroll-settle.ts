import { useEffect, type RefObject } from "react";

const MOBILE_MQ = "(max-width: 1023px)";
const SETTLE_MS = 180;
const SNAP_LOCK_MS = 700;
const ALIGNED_PX = 14;

/** Encaixa a seção Reels ao entrar vindo de cima ou de baixo — sem prender ao sair. */
export function useReelsScrollSettle(sectionRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const section = sectionRef.current;
    const mq = window.matchMedia(MOBILE_MQ);
    if (!section) return;

    let settleTimer: number | undefined;
    let snapLockUntil = 0;
    let lastScrollY = window.scrollY;
    let scrollDirection: "up" | "down" | null = null;

    function isAligned(sectionTop: number) {
      return Math.abs(window.scrollY - sectionTop) <= ALIGNED_PX;
    }

    function snapIfEnteringReels() {
      if (!mq.matches || !section || !scrollDirection) return;
      if (Date.now() < snapLockUntil) return;

      const vh = window.innerHeight;
      const y = window.scrollY;
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      const viewportBottom = y + vh;

      if (isAligned(sectionTop)) return;

      let shouldSnap = false;

      if (scrollDirection === "down") {
        const enteringFromAbove = y < sectionTop && viewportBottom > sectionTop + vh * 0.25;
        shouldSnap = enteringFromAbove;
      } else {
        const enteringFromBelow = viewportBottom > sectionBottom && y < sectionBottom - vh * 0.25;
        shouldSnap = enteringFromBelow;
      }

      if (!shouldSnap) return;

      snapLockUntil = Date.now() + SNAP_LOCK_MS;
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function onScroll() {
      if (!mq.matches) return;

      const y = window.scrollY;
      if (y > lastScrollY + 1) scrollDirection = "down";
      else if (y < lastScrollY - 1) scrollDirection = "up";
      lastScrollY = y;

      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(snapIfEnteringReels, SETTLE_MS);
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
