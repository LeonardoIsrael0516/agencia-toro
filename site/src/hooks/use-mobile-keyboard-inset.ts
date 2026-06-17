import { useEffect, useState } from "react";

/** Distância do fundo da viewport visível (útil para posicionar UI acima do teclado mobile). */
export function useMobileKeyboardInset() {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const update = () => {
      const isMobile = window.matchMedia("(max-width: 1023px)").matches;
      if (!isMobile) {
        setInset(0);
        return;
      }
      setInset(Math.max(0, window.innerHeight - vv.height - vv.offsetTop));
    };

    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    update();

    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return inset;
}
