import { Link } from "@tanstack/react-router";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

type LegalPageLayoutProps = {
  title: string;
  updatedAt: string;
  children: React.ReactNode;
};

export function LegalPageLayout({ title, updatedAt, children }: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-28 lg:px-10 lg:py-32">
        <Link
          to="/"
          className="text-sm text-foreground/50 transition hover:text-foreground/80"
        >
          ← Voltar ao site
        </Link>
        <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-foreground/45">Última atualização: {updatedAt}</p>
        <div className="legal-prose mt-10 space-y-8 text-sm leading-relaxed text-foreground/75 sm:text-base">
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

export function LegalSection({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id}>
      <h2 className="text-lg font-semibold text-foreground sm:text-xl">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}
