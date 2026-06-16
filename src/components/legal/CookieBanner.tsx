import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { hasConsentDecision, setCookieConsent } from "@/lib/cookie-consent";
import { loadAnalyticsIfConsented } from "@/lib/analytics-loader";
import { cn } from "@/lib/utils";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!hasConsentDecision());
  }, []);

  function accept(analytics: boolean) {
    setCookieConsent(analytics);
    setVisible(false);
    if (analytics) loadAnalyticsIfConsented();
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
      className="fixed inset-x-0 bottom-0 z-[100] p-4 sm:p-6"
    >
      <div
        className={cn(
          "mx-auto max-w-3xl rounded-2xl border border-white/10 bg-[var(--ink)] p-5 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.6)] sm:p-6",
        )}
      >
        <h2 id="cookie-banner-title" className="text-sm font-semibold text-foreground sm:text-base">
          Cookies e privacidade
        </h2>
        <p id="cookie-banner-desc" className="mt-2 text-xs leading-relaxed text-foreground/60 sm:text-sm">
          Utilizamos cookies essenciais para o funcionamento do site. Com sua permissão, também
          usamos cookies de analytics e marketing (Google Analytics, Meta Pixel) para medir
          audiência e campanhas. Você pode recusar os cookies não essenciais sem prejuízo da
          navegação. Saiba mais na nossa{" "}
          <Link to="/privacidade" hash="cookies" className="text-[#00D8FF] hover:underline">
            Política de Privacidade
          </Link>
          .
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => accept(true)}
            className="rounded-full bg-gradient-brand px-4 py-2 text-xs font-semibold text-[#031225] transition hover:scale-[1.02] sm:px-5 sm:text-sm"
          >
            Aceitar todos
          </button>
          <button
            type="button"
            onClick={() => accept(false)}
            className="rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-foreground/75 transition hover:bg-white/5 sm:px-5 sm:text-sm"
          >
            Recusar não essenciais
          </button>
        </div>
      </div>
    </div>
  );
}
