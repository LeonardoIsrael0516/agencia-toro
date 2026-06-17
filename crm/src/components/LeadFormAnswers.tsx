import { DESAFIO_OUTRO, type LeadRecord } from "@agencia-toro/shared";

import { cn, instagramUrl, whatsappUrl } from "@/lib/utils";

type LeadFormAnswersProps = {
  lead: LeadRecord;
  className?: string;
};

export function LeadFormAnswers({ lead, className }: LeadFormAnswersProps) {
  const instagramHandle = lead.instagram?.trim().replace(/^@/, "") ?? "";
  const instaUrl = instagramHandle ? instagramUrl(instagramHandle) : null;

  return (
    <dl className={cn("grid gap-4 sm:grid-cols-2", className)}>
      <AnswerField label="Nome" value={lead.nome} />
      <AnswerField
        label="WhatsApp"
        value={lead.whatsapp}
        href={whatsappUrl(lead.whatsapp)}
      />
      <AnswerField label="Empresa" value={lead.empresa} />
      <AnswerField label="Segmento" value={lead.segmento} />
      <AnswerField
        label="Instagram"
        value={instagramHandle ? `@${instagramHandle}` : "Não informado"}
        href={instaUrl ?? undefined}
        empty={!instagramHandle}
      />
      <AnswerField label="Faturamento mensal" value={lead.faturamento} />
      <AnswerField
        label="Principal desafio"
        value={lead.desafio}
        className="sm:col-span-2"
      />
      {lead.desafio === DESAFIO_OUTRO && lead.desafioOutro?.trim() ? (
        <AnswerField
          label="Descrição do desafio"
          value={lead.desafioOutro.trim()}
          className="sm:col-span-2"
        />
      ) : null}
    </dl>
  );
}

function AnswerField({
  label,
  value,
  href,
  empty,
  className,
}: {
  label: string;
  value: string;
  href?: string;
  empty?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-xs font-medium uppercase tracking-wide text-navy/45">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-navy">
        {href && !empty ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="text-brand-blue hover:underline"
          >
            {value}
          </a>
        ) : (
          <span className={empty ? "font-normal text-navy/45" : undefined}>{value}</span>
        )}
      </dd>
    </div>
  );
}
