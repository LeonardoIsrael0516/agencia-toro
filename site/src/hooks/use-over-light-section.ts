import { useEffect, useState } from "react";
import { updateSiteHeaderAttributes } from "@/lib/site-header-scroll";

export function useOverLightSection() {
  const [overLight, setOverLight] = useState(false);

  useEffect(() => {
    const sync = () => {
      const { light } = updateSiteHeaderAttributes();
      setOverLight(light);
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true, capture: true });
    document.addEventListener("scroll", sync, { passive: true, capture: true });
    window.addEventListener("resize", sync);

    return () => {
      window.removeEventListener("scroll", sync, true);
      document.removeEventListener("scroll", sync, true);
      window.removeEventListener("resize", sync);
    };
  }, []);

  return overLight;
}
