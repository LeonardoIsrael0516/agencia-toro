import { useEffect, type RefObject } from "react";

const MOBILE_MQ = "(max-width: 1023px)";
const SETTLE_MS = 180;
const SNAP_LOCK_MS = 750;
const ALIGNED_PX = 8;

function syncReelsViewportHeight() {
  document.documentElement.style.setProperty("--reels-vh", `${window.innerHeight}px`);
}

function getSectionTop(section: HTMLElement) {
  return section.getBoundingClientRect().top + window.scrollY;
}

/** Encaixa a seção Reels ao entrar vindo de cima ou de baixo — sem prender ao sair. */
export function useReelsScrollSettle(sectionRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const section = sectionRef.current;
    const mq = window.matchMedia(MOBILE_MQ);
    if (!section) return;

    let settleTimer: number | undefined;
    let correctTimer: number | undefined;
    let snapLockUntil = 0;
    let lastScrollY = window.scrollY;
    let scrollDirection: "up" | "down" | null = null;

    function isAligned(sectionTop: number) {
      return Math.abs(window.scrollY - sectionTop) <= ALIGNED_PX;
    }

    function correctAlignment(sectionTop: number) {
      syncReelsViewportHeight();

      const rect = section!.getBoundingClientRect();
      const topOffset = Math.abs(rect.top);
      const bottomGap = window.innerHeight - rect.bottom;

      if (topOffset > ALIGNED_PX || bottomGap > ALIGNED_PX) {
        window.scrollTo({ top: sectionTop, behavior: "auto" });
      }
    }

    function snapToReels(sectionTop: number, fromAbove: boolean) {
      syncReelsViewportHeight();
      snapLockUntil = Date.now() + SNAP_LOCK_MS;

      window.scrollTo({
        top: sectionTop,
        behavior: fromAbove ? "smooth" : "smooth",
      });

      window.clearTimeout(correctTimer);
      correctTimer = window.setTimeout(() => {
        correctAlignment(sectionTop);
      }, fromAbove ? 420 : 320);
    }

    function snapIfEnteringReels() {
      if (!mq.matches || !section || !scrollDirection) return;
      if (Date.now() < snapLockUntil) return;

      const vh = window.innerHeight;
      const y = window.scrollY;
      const sectionTop = getSectionTop(section);
      const sectionBottom = sectionTop + section.offsetHeight;
      const viewportBottom = y + vh;

      if (isAligned(sectionTop)) {
        correctAlignment(sectionTop);
        return;
      }

      if (scrollDirection === "down") {
        const enteringFromAbove = y < sectionTop && viewportBottom > sectionTop + vh * 0.22;
        if (enteringFromAbove) snapToReels(sectionTop, true);
        return;
      }

      const enteringFromBelow = viewportBottom > sectionBottom && y < sectionBottom - vh * 0.22;
      if (enteringFromBelow) snapToReels(sectionTop, false);
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
      if (!mq.matches) {
        window.clearTimeout(settleTimer);
        window.clearTimeout(correctTimer);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    mq.addEventListener("change", onChange);

    return () => {
      window.removeEventListener("scroll", onScroll);
      mq.removeEventListener("change", onChange);
      window.clearTimeout(settleTimer);
      window.clearTimeout(correctTimer);
    };
  }, [sectionRef]);
}
