import { useLayoutEffect, useState } from "react";

function headerBandHeight() {
  const header = document.querySelector<HTMLElement>("[data-site-header]");
  return header?.offsetHeight ?? 72;
}

function isOverLightSection() {
  const band = headerBandHeight();
  const sections = document.querySelectorAll(".section-light, .section-muted");
  if (!sections.length) return false;

  for (const el of sections) {
    const rect = el.getBoundingClientRect();
    // Seção cruza a faixa do header (0 … altura do header)
    if (rect.top < band && rect.bottom > 0) return true;
  }
  return false;
}

export function useOverLightSection(enabled = true) {
  const [overLight, setOverLight] = useState(false);

  useLayoutEffect(() => {
    if (!enabled) {
      setOverLight(false);
      return;
    }

    let frame = 0;

    const check = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setOverLight(isOverLightSection());
      });
    };

    check();

    window.addEventListener("scroll", check, { passive: true });
    document.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);

    const header = document.querySelector("[data-site-header]");
    const ro = header ? new ResizeObserver(check) : null;
    ro?.observe(header);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", check);
      document.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      ro?.disconnect();
    };
  }, [enabled]);

  return overLight;
}
