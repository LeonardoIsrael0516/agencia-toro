import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { LEGAL } from "@/lib/legal-config";

export function SiteFooter() {
  return (
    <footer className="relative mt-32 border-t border-white/5 bg-[var(--ink)]">
      <div className="mx-auto max-w-[1400px] px-6 pb-16 pt-24 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-6 max-w-sm text-balance text-2xl font-semibold leading-tight text-foreground">
              Marketing que faz <span className="text-gradient-brand">chover resultados</span> para clínicas e profissionais de saúde.
            </p>
            <Link
              to="/analise"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-[#031225]"
            >
              Solicitar análise gratuita →
            </Link>
          </div>
          <FooterCol title="Agência" links={[["Quem somos", "#sobre"], ["Método", "#metodo"], ["Na prática", "#na-pratica"], ["Cultura", "#cultura"]]} />
          <FooterCol title="Serviços" links={[["Tráfego pago", "#servicos"], ["Funis de venda", "#servicos"], ["Conteúdo", "#servicos"], ["Treinamento comercial", "#servicos"]]} />
          <FooterCol
            title="Contato"
            links={[
              [LEGAL.whatsappDisplay, LEGAL.whatsappUrl],
              [LEGAL.contactEmail, `mailto:${LEGAL.contactEmail}`],
              [LEGAL.instagramHandle, LEGAL.instagramUrl],
            ]}
          />
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-white/5 pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:gap-1">
            <span>© {new Date().getFullYear()} {LEGAL.companyName}. Todos os direitos reservados.</span>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <Link to="/privacidade" className="transition hover:text-foreground">
                Política de Privacidade
              </Link>
              <Link to="/termos" className="transition hover:text-foreground">
                Termos de Uso
              </Link>
              <a href={`mailto:${LEGAL.privacyEmail}`} className="transition hover:text-foreground">
                Canal do titular (LGPD)
              </a>
            </div>
            <p className="max-w-md text-[10px] leading-relaxed text-muted-foreground/50">
              {LEGAL.address}
            </p>
          </div>
          <span className="tracking-[0.2em] uppercase">Estratégia · Dados · Performance · Resultados</span>
        </div>
      </div>

      {/* huge wordmark */}
      <div aria-hidden className="pointer-events-none overflow-hidden">
        <div className="bg-gradient-brand bg-clip-text px-2 text-[28vw] font-black leading-[0.8] tracking-tighter text-transparent opacity-[0.08]">
          toró
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">{title}</h4>
      <ul className="mt-5 space-y-3 text-sm">
        {links.map(([label, href]) => (
          <li key={label}>
            <a
              href={href}
              className="text-foreground/80 transition hover:text-foreground"
              {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
