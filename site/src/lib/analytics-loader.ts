import { getCookieConsent } from "./cookie-consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

function injectScript(id: string, src: string, async = true) {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.src = src;
  script.async = async;
  document.head.appendChild(script);
}

function loadGoogleAnalytics(measurementId: string) {
  injectScript("toro-ga-loader", `https://www.googletagmanager.com/gtag/js?id=${measurementId}`);
  window.dataLayer = window.dataLayer ?? [];
  function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  }
  gtag("js", new Date());
  gtag("config", measurementId, { anonymize_ip: true });
}

function loadGoogleTagManager(containerId: string) {
  if (document.getElementById("toro-gtm-loader")) return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
  injectScript("toro-gtm-loader", `https://www.googletagmanager.com/gtm.js?id=${containerId}`);
}

function loadMetaPixel(pixelId: string) {
  if (window.fbq) return;
  const n = function (...args: unknown[]) {
    (n.queue as unknown[]).push(args);
  } as ((...args: unknown[]) => void) & { queue: unknown[] };
  n.queue = [];
  window.fbq = n;
  if (!window._fbq) window._fbq = n;
  window.fbq("init", pixelId);
  window.fbq("track", "PageView");
  injectScript("toro-meta-pixel", "https://connect.facebook.net/en_US/fbevents.js");
}

/** Carrega GA, GTM e Meta Pixel somente com consentimento de analytics. */
export function loadAnalyticsIfConsented() {
  const consent = getCookieConsent();
  if (!consent?.analytics) return;

  const gaId = import.meta.env.VITE_GA_ID as string | undefined;
  const gtmId = import.meta.env.VITE_GTM_ID as string | undefined;
  const pixelId = import.meta.env.VITE_META_PIXEL_ID as string | undefined;

  if (gtmId) loadGoogleTagManager(gtmId);
  else if (gaId) loadGoogleAnalytics(gaId);

  if (pixelId) loadMetaPixel(pixelId);
}
