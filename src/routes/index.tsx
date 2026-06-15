import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import heroStorm from "@/assets/hero-storm.jpg";
import caseOdonto from "@/assets/case-odonto.jpg";
import caseEstetica from "@/assets/case-estetica.jpg";
import caseClinica from "@/assets/case-clinica.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Toró — Marketing para clínicas, odontologia e estética" },
      {
        name: "description",
        content:
          "Agência especializada em saúde, odontologia e estética. Geramos pacientes, faturamento e autoridade com estratégia, tráfego e funis de venda.",
      },
      { property: "og:title", content: "Toró — Marketing que faz chover resultados" },
      {
        property: "og:description",
        content:
          "Estratégia, dados e performance para clínicas médicas, odontológicas e estéticas crescerem com previsibilidade.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      <SiteHeader />
      <Hero />
      <Marquee />
      <Stats />
      <Servicos />
      <ParaQuem />
      <Metodo />
      <Cases />
      <Diferencial />
      <CtaFinal />
      <SiteFooter />
    </div>
  );
}

/* ------------------------------- HERO ----------------------------------- */
function Hero() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden pt-28">
      <img
        src={heroStorm}
        alt=""
        width={1600}
        height={1200}
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-60"
      />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_50%_0%,transparent,var(--ink)_75%)]" />
      <div className="absolute -left-40 top-1/3 -z-10 h-[520px] w-[520px] rounded-full bg-[#006CFF]/30 blur-[140px] animate-pulse-glow" />
      <div className="absolute -right-40 top-1/2 -z-10 h-[520px] w-[520px] rounded-full bg-[#9DFF2F]/15 blur-[160px]" />

      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.32em] text-muted-foreground">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#9DFF2F] animate-pulse-glow" />
          Agência especializada em saúde, odontologia e estética
        </div>

        <h1 className="mt-8 max-w-[18ch] text-balance text-[clamp(2.6rem,8vw,7.5rem)] font-black leading-[0.92] tracking-[-0.035em]">
          Marketing que faz <span className="text-gradient-brand">chover</span> pacientes na sua clínica.
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-foreground/75 sm:text-xl">
          Somos parceiros de crescimento para clínicas médicas, consultórios odontológicos e centros estéticos.
          Estratégia, tráfego, funis e treinamento comercial em um só lugar — para transformar investimento em faturamento.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            to="/analise"
            className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-brand px-7 py-4 text-base font-semibold text-[#031225] shadow-[0_20px_60px_-20px_rgba(0,108,255,0.7)] transition hover:scale-[1.02]"
          >
            Solicitar análise gratuita
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[#031225] text-foreground transition group-hover:rotate-[-45deg]">→</span>
          </Link>
          <a href="#cases" className="text-sm text-foreground/70 underline-offset-4 hover:text-foreground hover:underline">
            Ver cases de clientes
          </a>
        </div>

        <div className="mt-24 grid max-w-3xl grid-cols-2 gap-x-10 gap-y-6 sm:grid-cols-4">
          {[
            ["+R$ 80mi", "gerados em faturamento"],
            ["+200", "clínicas atendidas"],
            ["98%", "retenção de clientes"],
            ["6 anos", "no segmento de saúde"],
          ].map(([n, l]) => (
            <div key={l}>
              <div className="text-3xl font-bold tracking-tight">{n}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ MARQUEE --------------------------------- */
function Marquee() {
  const words = [
    "Estratégia.",
    "Dados.",
    "Criatividade.",
    "Performance.",
    "Resultados.",
    "Marketing que faz chover resultados.",
  ];
  const row = [...words, ...words, ...words];
  return (
    <div className="relative overflow-hidden border-y border-white/5 bg-[var(--ink-2)] py-6">
      <div className="flex w-[200%] gap-12 animate-marquee whitespace-nowrap">
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-12 text-2xl font-medium text-foreground/80 sm:text-3xl">
            {w}
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden className="text-[#9DFF2F]">
              <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" fill="currentColor" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------- STATS ---------------------------------- */
function Stats() {
  return (
    <section id="sobre" className="relative mx-auto max-w-[1400px] px-6 py-32 lg:px-10">
      <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
        <div>
          <Eyebrow>Quem é a Toró</Eyebrow>
          <h2 className="mt-6 text-balance text-[clamp(2rem,4.6vw,4rem)] font-bold leading-[1.02] tracking-tight">
            Mais que uma agência. Um <span className="text-gradient-brand">parceiro de crescimento</span> para o setor de saúde.
          </h2>
        </div>
        <div className="flex flex-col gap-6 text-lg leading-relaxed text-foreground/75">
          <p>
            Nascemos com um propósito claro: ajudar clínicas, consultórios e profissionais de saúde e estética a crescer
            de forma estratégica, previsível e sustentável.
          </p>
          <p>
            Combinamos marketing, tecnologia, vendas e inteligência de dados para transformar negócios locais em
            referências em suas regiões.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <ValueChip>Mentalidade de dono</ValueChip>
            <ValueChip>Foco em resultado</ValueChip>
            <ValueChip>Aprendizado constante</ValueChip>
            <ValueChip>Parcerias de longo prazo</ValueChip>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- SERVIÇOS --------------------------------- */
const SERVICOS = [
  { n: "01", t: "Gestão de Tráfego Pago", d: "Google, Meta e YouTube Ads. Campanhas de captação de pacientes com previsibilidade." },
  { n: "02", t: "Marketing Estratégico", d: "Planejamento, posicionamento e análise de concorrência para sua clínica dominar a região." },
  { n: "03", t: "Funis de Venda", d: "Automação, nutrição de leads e CRM para transformar interesse em paciente agendado." },
  { n: "04", t: "Produção de Conteúdo", d: "Redes sociais, copywriting e roteiros que conectam autoridade médica e linguagem humana." },
  { n: "05", t: "Desenvolvimento Web", d: "Sites institucionais e landing pages de alta conversão, otimizados para captação." },
  { n: "06", t: "Treinamento Comercial", d: "Capacitação de recepção e vendas, com scripts para converter lead em paciente." },
  { n: "07", t: "Consultoria de Crescimento", d: "Diagnóstico, planejamento e estruturação de processos para escalar com saúde." },
  { n: "08", t: "Inteligência de Dados", d: "Painéis e indicadores que mostram exatamente onde cada real investido voltou." },
];

function Servicos() {
  return (
    <section id="servicos" className="relative mx-auto max-w-[1400px] px-6 py-32 lg:px-10">
      <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <Eyebrow>O que fazemos</Eyebrow>
          <h2 className="mt-6 max-w-3xl text-balance text-[clamp(2rem,4.6vw,4rem)] font-bold leading-[1.02] tracking-tight">
            Toda a jornada de crescimento da sua clínica, sob um único time.
          </h2>
        </div>
        <p className="max-w-md text-foreground/70">
          Enquanto outras agências entregam só métrica, a Toró atua do anúncio à conversão dentro do consultório.
        </p>
      </div>

      <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-white/5 bg-white/5 md:grid-cols-2 lg:grid-cols-4">
        {SERVICOS.map((s) => (
          <article
            key={s.n}
            className="group relative isolate flex flex-col justify-between bg-background p-8 transition hover:bg-[var(--ink-2)]"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">{s.n}</span>
              <span className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-foreground/70 transition group-hover:border-[#9DFF2F] group-hover:text-[#9DFF2F]">→</span>
            </div>
            <div className="mt-16">
              <h3 className="text-xl font-semibold leading-tight">{s.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/65">{s.d}</p>
            </div>
            <span className="pointer-events-none absolute inset-x-8 bottom-0 h-px origin-left scale-x-0 bg-gradient-brand transition duration-500 group-hover:scale-x-100" />
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------- PARA QUEM --------------------------------- */
const PARAQUEM = [
  "Clínicas médicas",
  "Consultórios odontológicos",
  "Clínicas de estética",
  "Dermatologistas",
  "Cirurgiões plásticos",
  "Nutricionistas",
  "Psicólogos",
  "Fisioterapeutas",
  "Academias",
  "Centros de bem-estar",
];

function ParaQuem() {
  return (
    <section id="para-quem" className="relative overflow-hidden border-y border-white/5 bg-[var(--ink-2)] py-32">
      <div className="mx-auto grid max-w-[1400px] gap-16 px-6 lg:grid-cols-[1fr_1.2fr] lg:px-10">
        <div>
          <Eyebrow>Para quem trabalhamos</Eyebrow>
          <h2 className="mt-6 text-balance text-[clamp(2rem,4.6vw,4rem)] font-bold leading-[1.02] tracking-tight">
            Especialistas <span className="text-gradient-brand">obcecados</span> pelo setor de saúde e estética.
          </h2>
          <p className="mt-6 max-w-md text-foreground/70">
            Não fazemos marketing para qualquer nicho. Cada estratégia, criativo e funil é desenhado considerando regulamentações,
            jornada do paciente e comportamento de compra do nosso mercado.
          </p>
        </div>
        <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/5 sm:grid-cols-2">
          {PARAQUEM.map((p, i) => (
            <li key={p} className="flex items-center gap-4 bg-[var(--ink-2)] px-6 py-5">
              <span className="font-mono text-[11px] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-lg font-medium">{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------ MÉTODO ---------------------------------- */
const STEPS = [
  { n: "01", t: "Diagnóstico", d: "Mergulhamos no seu negócio: histórico, indicadores, concorrência e oportunidades não exploradas." },
  { n: "02", t: "Estratégia", d: "Plano de crescimento personalizado com canais, ofertas e funis adequados ao seu segmento." },
  { n: "03", t: "Execução", d: "Tráfego, conteúdo, automações e treinamento comercial rodando em paralelo com squad dedicado." },
  { n: "04", t: "Otimização", d: "Análise contínua de dados e reuniões de performance para escalar o que funciona e cortar o que não." },
];

function Metodo() {
  return (
    <section id="metodo" className="relative mx-auto max-w-[1400px] px-6 py-32 lg:px-10">
      <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <Eyebrow>Nosso método</Eyebrow>
          <h2 className="mt-6 max-w-3xl text-balance text-[clamp(2rem,4.6vw,4rem)] font-bold leading-[1.02] tracking-tight">
            Planejar. Executar. Analisar. <span className="text-gradient-brand">Crescer.</span>
          </h2>
        </div>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s) => (
          <div key={s.n} className="relative overflow-hidden rounded-3xl border border-white/8 bg-[var(--ink-2)]/60 p-8">
            <div className="text-5xl font-black tracking-tight text-gradient-brand">{s.n}</div>
            <h3 className="mt-8 text-xl font-semibold">{s.t}</h3>
            <p className="mt-3 text-sm leading-relaxed text-foreground/65">{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------- CASES ---------------------------------- */
const CASES = [
  {
    img: caseOdonto,
    seg: "Odontologia",
    title: "Clínica Odonto Premium triplicou o volume de avaliações em 4 meses.",
    kpis: [["+312%", "agendamentos"], ["-38%", "CAC"], ["4,2x", "ROAS"]],
  },
  {
    img: caseEstetica,
    seg: "Estética",
    title: "Studio de estética escalou de R$ 80k para R$ 320k/mês.",
    kpis: [["4x", "faturamento"], ["+1.8k", "leads/mês"], ["62%", "show-rate"]],
  },
  {
    img: caseClinica,
    seg: "Clínica Médica",
    title: "Clínica multidisciplinar abriu 2 novas unidades em 11 meses.",
    kpis: [["2", "novas unidades"], ["+220%", "pacientes"], ["3 meses", "payback"]],
  },
];

function Cases() {
  return (
    <section id="cases" className="relative overflow-hidden border-y border-white/5 bg-[var(--ink)] py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <Eyebrow>Cases reais</Eyebrow>
            <h2 className="mt-6 max-w-3xl text-balance text-[clamp(2rem,4.6vw,4rem)] font-bold leading-[1.02] tracking-tight">
              Resultados que falam mais alto que palavra de agência.
            </h2>
          </div>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {CASES.map((c) => (
            <article key={c.seg} className="group relative overflow-hidden rounded-3xl border border-white/8 bg-[var(--ink-2)]">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={c.img}
                  alt=""
                  loading="lazy"
                  width={1200}
                  height={1500}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)] via-[var(--ink)]/30 to-transparent" />
                <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full bg-background/70 px-3 py-1.5 text-xs font-medium uppercase tracking-wider backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#9DFF2F]" /> {c.seg}
                </div>
              </div>
              <div className="p-7">
                <h3 className="text-balance text-xl font-semibold leading-snug">{c.title}</h3>
                <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/5 pt-5">
                  {c.kpis.map(([k, l]) => (
                    <div key={l}>
                      <div className="text-lg font-bold text-gradient-brand">{k}</div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- DIFERENCIAL -------------------------------- */
function Diferencial() {
  const pts = [
    "Atendimento dedicado de squad multidisciplinar",
    "Reuniões mensais de performance com dashboards próprios",
    "Especialistas no setor de saúde — entendemos regulamentação e ticket alto",
    "Treinamos sua equipe interna para sustentar o crescimento",
  ];
  return (
    <section id="cultura" className="relative mx-auto max-w-[1400px] px-6 py-32 lg:px-10">
      <div className="grid gap-16 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <Eyebrow>O diferencial Toró</Eyebrow>
          <h2 className="mt-6 text-balance text-[clamp(2rem,4.6vw,4rem)] font-bold leading-[1.02] tracking-tight">
            Não vendemos visibilidade. Vendemos <span className="text-gradient-brand">crescimento previsível.</span>
          </h2>
          <p className="mt-6 max-w-xl text-foreground/70">
            Geramos tráfego, captamos leads, estruturamos processos comerciais, treinamos equipes e acompanhamos
            indicadores para garantir que o investimento em marketing se transforme em faturamento.
          </p>
        </div>
        <ul className="space-y-3">
          {pts.map((p, i) => (
            <li
              key={p}
              className="flex items-start gap-5 rounded-2xl border border-white/8 bg-white/[0.02] p-5 transition hover:border-[#9DFF2F]/50 hover:bg-white/[0.04]"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-brand text-sm font-bold text-[#031225]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-base text-foreground/90">{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ----------------------------- CTA FINAL -------------------------------- */
function CtaFinal() {
  return (
    <section className="relative mx-auto max-w-[1400px] px-6 py-24 lg:px-10">
      <div className="relative isolate overflow-hidden rounded-[2.5rem] border border-white/10 bg-[var(--ink-2)] p-10 md:p-16">
        <div className="absolute -right-32 -top-32 -z-10 h-[420px] w-[420px] rounded-full bg-[#006CFF]/40 blur-[140px]" />
        <div className="absolute -bottom-32 -left-32 -z-10 h-[420px] w-[420px] rounded-full bg-[#9DFF2F]/20 blur-[160px]" />

        <Eyebrow>Próximo passo</Eyebrow>
        <h2 className="mt-6 max-w-3xl text-balance text-[clamp(2.2rem,5.4vw,5rem)] font-black leading-[0.95] tracking-tight">
          Pronto para fazer <span className="text-gradient-brand">chover pacientes</span> no seu consultório?
        </h2>
        <p className="mt-6 max-w-xl text-lg text-foreground/75">
          Solicite uma análise gratuita. Em até 24h apresentamos oportunidades reais para o seu negócio crescer.
        </p>
        <Link
          to="/analise"
          className="mt-10 inline-flex items-center gap-3 rounded-full bg-gradient-brand px-7 py-4 text-base font-semibold text-[#031225] shadow-[0_30px_80px_-20px_rgba(0,108,255,0.7)] transition hover:scale-[1.02]"
        >
          Quero minha análise gratuita
          <span className="grid h-7 w-7 place-items-center rounded-full bg-[#031225] text-foreground">→</span>
        </Link>
      </div>
    </section>
  );
}

/* ----------------------------- helpers ---------------------------------- */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/70">
      <span className="h-1.5 w-1.5 rounded-full bg-[#9DFF2F]" />
      {children}
    </div>
  );
}

function ValueChip({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm font-medium text-foreground/85">
      {children}
    </div>
  );
}
