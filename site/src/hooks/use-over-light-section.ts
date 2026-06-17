import { useEffect, useState } from "react";

const HEADER_PROBE = 72;

export function useOverLightSection() {
  const [overLight, setOverLight] = useState(false);

  useEffect(() => {
    const sections = document.querySelectorAll(".section-light, .section-muted");

    const check = () => {
      if (!sections.length) {
        setOverLight(false);
        return;
      }

      let found = false;
      sections.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < HEADER_PROBE && rect.bottom > HEADER_PROBE * 0.5) {
          found = true;
        }
      });
      setOverLight(found);
    };

    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return overLight;
}
