import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { ServicoCard } from "@/components/sections/ServicoCard";
import { ParaQuem } from "@/components/sections/ParaQuem";
import { Metodo } from "@/components/sections/Metodo";
import { Diferencial } from "@/components/sections/Diferencial";
import { CtaFinal } from "@/components/sections/CtaFinal";
import { NaPratica } from "@/components/sections/NaPratica";
import { NA_PRATICA_VIDEO_SRC, preloadNaPraticaVideo } from "@/lib/na-pratica-video";
import { useHomeReelsScrollSnap } from "@/hooks/use-home-reels-scroll-snap";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Toró | Marketing para clínicas, odontologia e estética" },
      {
        name: "description",
        content:
          "Agência especializada em saúde, odontologia e estética. Geramos pacientes, faturamento e autoridade com estratégia, tráfego e funis de venda.",
      },
      { property: "og:title", content: "Toró | Marketing que faz chover resultados" },
      {
        property: "og:description",
        content:
          "Estratégia, dados e performance para clínicas médicas, odontológicas e estéticas crescerem com previsibilidade.",
      },
    ],
    links: [
      {
        rel: "preload",
        href: NA_PRATICA_VIDEO_SRC,
        as: "video",
        type: "video/quicktime",
      },
    ],
  }),
  component: Home,
});

function Home() {
  useHomeReelsScrollSnap();

  useEffect(() => {
    preloadNaPraticaVideo();
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      <SiteHeader />
      <Hero />
      <Marquee />
      <Stats />
      <Servicos />
      <ParaQuem />
      <Metodo />
      <NaPratica />
      <div className="max-lg:snap-section-next">
        <Diferencial />
      </div>
      <CtaFinal />
      <SiteFooter />
    </div>
  );
}

/* ------------------------------- STATS ---------------------------------- */
const DESTAQUES = [
  ["Estratégia", "transformada em crescimento"],
  ["360°", "da captação à conversão"],
  ["Dados", "resultados mensuráveis"],
  ["Parceria", "crescimento de longo prazo"],
] as const;

function Stats() {
  return (
    <section id="sobre" className="relative mx-auto max-w-[1400px] px-6 py-32 lg:px-10">
      <div className="mb-20 grid grid-cols-2 gap-x-8 gap-y-8 border-b border-white/5 pb-16 sm:grid-cols-4 lg:gap-x-12">
        {DESTAQUES.map(([n, l]) => (
          <div key={l}>
            <div className="text-2xl font-bold tracking-tight sm:text-[1.75rem]">{n}</div>
            <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{l}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
        <div>
          <Eyebrow>Quem é a Toró</Eyebrow>
          <h2 className="mt-6 text-balance text-[clamp(2rem,4.6vw,4rem)] font-bold leading-[1.02] tracking-tight">
            Transformamos estratégia em <span className="text-gradient-brand">crescimento previsível.</span>
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-foreground/55">
            Mais do que uma agência. Somos parceiros de crescimento para quem vive de transformar vidas.
          </p>
        </div>
        <div className="flex flex-col gap-6 text-lg leading-relaxed text-foreground/75">
          <p>
            A Toró existe para ajudar clínicas, consultórios e negócios de estética a atrair pacientes, aumentar
            faturamento e fortalecer autoridade no mercado, com estratégia, execução e melhoria contínua.
          </p>
          <p>
            Unimos marketing, tecnologia, vendas e inteligência de dados em um só lugar. Do anúncio ao agendamento,
            do lead ao paciente fidelizado: cuidamos de toda a jornada para que seu investimento vire receita.
          </p>
          <div className="mt-2 rounded-2xl border border-white/8 bg-white/[0.02] px-5 py-4">
            <p className="text-sm leading-relaxed text-foreground/65">
              <span className="font-medium text-foreground/90">Nossa cultura:</span> cada projeto é tratado como
              negócio próprio. Sem métrica de vaidade. Só crescimento, faturamento e previsibilidade.
            </p>
          </div>
          <ValoresPilares />
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- SERVIÇOS --------------------------------- */
const SERVICOS = [
  {
    n: "01",
    t: "Estratégia e Planejamento",
    d: "Base sólida antes de qualquer campanha. Direção clara para sua marca crescer com método.",
    items: [
      "Planejamento de marketing",
      "Posicionamento de marca",
      "Branding e identidade visual",
      "Pesquisa de mercado",
      "Planejamento de campanhas",
      "Consultoria estratégica",
    ],
  },
  {
    n: "02",
    t: "Redes Sociais",
    d: "Presença digital ativa, conteúdo que conecta e comunidade que engaja de verdade.",
    items: [
      "Instagram, Facebook e TikTok",
      "Calendário de conteúdo",
      "Legendas e roteiros",
      "Design para posts e stories",
      "Monitoramento e interação",
      "Crescimento orgânico",
    ],
  },
  {
    n: "03",
    t: "Tráfego Pago",
    d: "Anúncios que convertem. Investimento direcionado para leads, vendas e retorno mensurável.",
    items: [
      "Meta Ads (Instagram e Facebook)",
      "Google Ads",
      "YouTube Ads",
      "Campanhas de conversão",
      "Remarketing",
      "Segmentação de público",
    ],
  },
  {
    n: "04",
    t: "Design e Criação",
    d: "Visual que comunica, impressiona e fortalece a percepção da sua marca em cada touchpoint.",
    items: [
      "Logotipo e identidade visual",
      "Artes gráficas",
      "Materiais impressos",
      "Outdoor, banners e fachadas",
      "Apresentações institucionais",
    ],
  },
  {
    n: "05",
    t: "Produção Audiovisual",
    d: "Imagens e vídeos profissionais para redes, campanhas, eventos e autoridade de marca.",
    items: [
      "Filmagem e edição",
      "Reels e vídeos virais",
      "Cobertura de eventos",
      "Fotografia profissional",
      "Imagens com drone",
    ],
  },
  {
    n: "06",
    t: "Marketing Político",
    d: "Estratégia, imagem e comunicação para campanhas, mandatos e gestão pública.",
    items: [
      "Estratégia eleitoral",
      "Gestão de imagem pública",
      "Produção de discursos",
      "Cobertura de agendas",
      "Campanhas eleitorais",
      "Gerenciamento de crise",
      "Comunicação institucional",
    ],
  },
  {
    n: "07",
    t: "Desenvolvimento Digital",
    d: "Presença online completa: do site à automação, com foco em conversão e visibilidade.",
    items: [
      "Sites e landing pages",
      "Loja virtual",
      "Automação de atendimento",
      "Integração com WhatsApp",
      "SEO para Google",
    ],
  },
  {
    n: "08",
    t: "Consultoria & Treinamento",
    d: "Capacitação e direção para sua equipe vender mais e seu negócio escalar com processo.",
    items: [
      "Diagnóstico estratégico",
      "Treinamento comercial",
      "Scripts de atendimento",
      "Estruturação de processos",
      "Acompanhamento de indicadores",
      "Otimização contínua",
    ],
  },
] as const;

function Servicos() {
  return (
    <section id="servicos" className="section-light py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <Eyebrow light>O que fazemos</Eyebrow>
            <h2 className="mt-6 max-w-3xl text-balance text-[clamp(2rem,4.6vw,4rem)] font-bold leading-[1.02] tracking-tight text-[var(--ink)]">
              Tudo que sua marca precisa para crescer, em um só lugar.
            </h2>
          </div>
          <p className="max-w-md text-[var(--ink)]/65">
            Da estratégia ao criativo, do tráfego ao digital. Um time completo para transformar ideia em resultado.
          </p>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-[var(--ink)]/10 bg-[var(--ink)]/[0.04] md:grid-cols-2 lg:grid-cols-4">
          {SERVICOS.map((s) => (
            <ServicoCard key={s.n} servico={s} />
          ))}
        </div>
      </div>
    </section>
  );
}



/* ----------------------------- helpers ---------------------------------- */
function ValoresPilares() {
  return (
    <div className="mt-4">
      <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-foreground/40">Como operamos</p>
      <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
        {VALORES.map((valor, i) => (
          <li
            key={valor.title}
            className="group relative overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.025] p-4 transition duration-300 hover:border-[#006CFF]/25 hover:bg-white/[0.04]"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-0.5 origin-top scale-y-0 bg-gradient-brand transition duration-300 group-hover:scale-y-100"
            />
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-[#00D8FF]">
                <ValorIcon type={valor.icon} />
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="font-mono text-[10px] tabular-nums text-[#00D8FF]/60">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-0.5 text-sm font-semibold leading-snug text-foreground/90">{valor.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-foreground/50">{valor.desc}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const VALORES = [
  {
    title: "Mentalidade de dono",
    desc: "Tratamos sua clínica como extensão do nosso próprio negócio.",
    icon: "owner",
  },
  {
    title: "Transparência",
    desc: "Relatórios claros, reuniões honestas e zero caixa preta.",
    icon: "transparency",
  },
  {
    title: "Performance & dados",
    desc: "Decisões guiadas por métricas que impactam agenda e faturamento.",
    icon: "data",
  },
  {
    title: "Parceria de longo prazo",
    desc: "Construímos crescimento sustentável, não campanhas isoladas.",
    icon: "partnership",
  },
] as const;

function ValorIcon({ type }: { type: (typeof VALORES)[number]["icon"] }) {
  const cls = "h-4 w-4";
  switch (type) {
    case "owner":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 3 4 9v12h6v-7h4v7h6V9l-8-6z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "transparency":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.75" />
          <path d="M12 8v4l2.5 2.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );
    case "data":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M4 19V5M10 19V9M16 19v-6M22 19V3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );
    case "partnership":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M7 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm10 0a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21c0-3.3 2.7-5 5-5s5 1.7 5 5M12 21c0-2.2 1.8-4 4-4s4 1.8 4 4"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}

function Eyebrow({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div
      className={`inline-flex items-center gap-3 rounded-full px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.28em] ${
        light
          ? "border border-[var(--ink)]/10 bg-[var(--ink)]/[0.04] text-[var(--ink)]/55"
          : "border border-white/10 bg-white/5 text-foreground/70"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[#9DFF2F]" />
      {children}
    </div>
  );
}
