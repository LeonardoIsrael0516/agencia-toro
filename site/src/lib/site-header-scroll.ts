export const HEADER_PROBE = 72;
export const SCROLL_THRESHOLD = 16;

export function getScrollY() {
  return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

export function isOverLightSection(probe = HEADER_PROBE) {
  const sections = document.querySelectorAll(".section-light, .section-muted");
  for (const el of sections) {
    const rect = el.getBoundingClientRect();
    if (rect.top < probe && rect.bottom > probe * 0.5) return true;
  }
  return false;
}

export function updateSiteHeaderAttributes() {
  const header = document.querySelector<HTMLElement>("[data-site-header]");
  if (!header) return { scrolled: false, light: false, showBar: false };

  const scrolled = getScrollY() > SCROLL_THRESHOLD;
  const light = isOverLightSection();
  const showBar = scrolled || light;

  header.dataset.scrolled = scrolled ? "true" : "false";
  header.dataset.light = light ? "true" : "false";
  header.dataset.showBar = showBar ? "true" : "false";

  return { scrolled, light, showBar };
}

let teardown: (() => void) | null = null;

export function initSiteHeaderScroll() {
  if (typeof window === "undefined") return () => {};

  teardown?.();

  const onChange = () => updateSiteHeaderAttributes();

  onChange();
  window.addEventListener("scroll", onChange, { passive: true, capture: true });
  document.addEventListener("scroll", onChange, { passive: true, capture: true });
  window.addEventListener("resize", onChange);

  teardown = () => {
    window.removeEventListener("scroll", onChange, true);
    document.removeEventListener("scroll", onChange, true);
    window.removeEventListener("resize", onChange);
  };

  return teardown;
}

/** Script inline no HTML — funciona mesmo se a hidratação React atrasar/falhar. */
export const SITE_HEADER_SCROLL_INLINE = `(()=>{const p=72,t=16;function y(){return window.scrollY||document.documentElement.scrollTop||document.body.scrollTop||0}function l(){const s=document.querySelectorAll(".section-light, .section-muted");for(const e of s){const r=e.getBoundingClientRect();if(r.top<p&&r.bottom>p*.5)return!0}return!1}function u(){const h=document.querySelector("[data-site-header]");if(!h)return;const s=y()>t,a=l(),b=s||a;h.dataset.scrolled=s?"true":"false";h.dataset.light=a?"true":"false";h.dataset.showBar=b?"true":"false"}u();window.addEventListener("scroll",u,{passive:!0,capture:!0});document.addEventListener("scroll",u,{passive:!0,capture:!0});window.addEventListener("resize",u)})();`;
