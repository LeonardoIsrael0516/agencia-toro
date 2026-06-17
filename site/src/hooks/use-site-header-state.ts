import { useLayoutEffect, useState } from "react";

function getScrollY() {
  return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

function headerHeight() {
  return document.querySelector<HTMLElement>("[data-site-header]")?.offsetHeight ?? 72;
}

function isOverLightSection() {
  const band = headerHeight();
  const sections = document.querySelectorAll(".section-light, .section-muted");
  if (!sections.length) return false;

  for (const el of sections) {
    const rect = el.getBoundingClientRect();
    if (rect.top < band && rect.bottom > 0) return true;
  }
  return false;
}

export type SiteHeaderBar = "transparent" | "dark" | "light";

export function useSiteHeaderState(isHome: boolean) {
  const [scrolled, setScrolled] = useState(false);
  const [overLight, setOverLight] = useState(false);

  useLayoutEffect(() => {
    if (!isHome) {
      setScrolled(true);
      setOverLight(false);
      return;
    }

    let frame = 0;
    let observer: IntersectionObserver | null = null;
    const intersecting = new Set<Element>();

    const syncLight = () => {
      setOverLight(intersecting.size > 0 || isOverLightSection());
    };

    const syncScroll = () => {
      setScrolled(getScrollY() > 12);
    };

    const tick = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        syncScroll();
        syncLight();
      });
    };

    const setupObserver = () => {
      observer?.disconnect();
      intersecting.clear();

      const h = headerHeight();
      const marginBottom = -(window.innerHeight - h);

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) intersecting.add(entry.target);
            else intersecting.delete(entry.target);
          }
          syncLight();
        },
        { root: null, rootMargin: `0px 0px ${marginBottom}px 0px`, threshold: [0, 0.01, 0.1] },
      );

      document.querySelectorAll(".section-light, .section-muted").forEach((el) => observer!.observe(el));
      syncLight();
    };

    syncScroll();
    setupObserver();
    tick();

    window.addEventListener("scroll", tick, { passive: true, capture: true });
    document.addEventListener("scroll", tick, { passive: true, capture: true });
    window.addEventListener("resize", () => {
      setupObserver();
      tick();
    });

    const header = document.querySelector("[data-site-header]");
    const ro = header ? new ResizeObserver(() => setupObserver()) : null;
    ro?.observe(header!);

    const retry = window.setTimeout(tick, 150);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(retry);
      observer?.disconnect();
      ro?.disconnect();
      window.removeEventListener("scroll", tick, true);
      document.removeEventListener("scroll", tick, true);
    };
  }, [isHome]);

  const showBar = isHome ? scrolled || overLight : true;
  const bar: SiteHeaderBar = !showBar ? "transparent" : overLight ? "light" : "dark";

  return { scrolled, overLight, showBar, bar, light: overLight };
}
