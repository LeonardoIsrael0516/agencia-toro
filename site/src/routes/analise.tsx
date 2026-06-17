import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { AnaliseSidebar } from "@/components/analise/AnaliseSidebar";
import { AnaliseWizard } from "@/components/analise/AnaliseWizard";

export const Route = createFileRoute("/analise")({
  head: () => ({
    meta: [
      { title: "Análise gratuita | Toró Marketing" },
      {
        name: "description",
        content:
          "Preencha o formulário e nossa equipe fará uma análise inicial do seu marketing, presença digital e potencial de crescimento. Resposta em até 24h.",
      },
      { property: "og:title", content: "Solicite uma análise gratuita | Toró" },
      {
        property: "og:description",
        content:
          "Análise estratégica gratuita para clínicas e profissionais de saúde. Identifique oportunidades de crescimento em 24h.",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover",
      },
    ],
  }),
  component: AnalisePage,
});

function AnalisePage() {
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    if (!mq.matches) return;

    const { overflow, height } = document.body.style;
    document.body.style.overflow = "hidden";
    document.body.style.height = "100dvh";

    return () => {
      document.body.style.overflow = overflow;
      document.body.style.height = height;
    };
  }, []);

  return (
    <div className="h-dvh overflow-hidden bg-[var(--paper)] lg:grid lg:h-auto lg:min-h-svh lg:grid-cols-[45fr_55fr] lg:overflow-visible">
      <AnaliseSidebar />
      <AnaliseWizard />
    </div>
  );
}
