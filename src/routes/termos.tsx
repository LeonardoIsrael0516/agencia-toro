import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPageLayout, LegalSection } from "@/components/legal/LegalPageLayout";
import { LEGAL } from "@/lib/legal-config";

export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title: "Termos de Uso | Toró Marketing" },
      {
        name: "description",
        content: "Termos de uso do site institucional da Toró Marketing.",
      },
    ],
  }),
  component: TermosPage,
});

function TermosPage() {
  return (
    <LegalPageLayout title="Termos de Uso" updatedAt={LEGAL.privacyPolicyVersion}>
      <p>
        Estes Termos de Uso regulam o acesso e a utilização do site da {LEGAL.companyName}. Ao
        navegar neste site, você concorda com as condições abaixo.
      </p>

      <LegalSection title="1. Objeto">
        <p>
          O site apresenta informações institucionais sobre serviços de marketing para clínicas e
          profissionais de saúde e estética, além de formulário para solicitação de análise
          gratuita.
        </p>
      </LegalSection>

      <LegalSection title="2. Uso permitido">
        <p>
          Você pode utilizar o site para informar-se sobre nossos serviços e enviar solicitações
          legítimas de contato. É proibido utilizar o site para fins ilícitos, enviar conteúdo
          ofensivo, tentar acessar áreas restritas ou interferir no funcionamento da plataforma.
        </p>
      </LegalSection>

      <LegalSection title="3. Propriedade intelectual">
        <p>
          Textos, marcas, logotipos, layout, imagens e demais conteúdos do site pertencem à{" "}
          {LEGAL.companyName} ou a licenciadores, sendo protegidos pela legislação aplicável.
          Reprodução não autorizada é vedada.
        </p>
      </LegalSection>

      <LegalSection title="4. Formulário e comunicações">
        <p>
          Ao preencher o formulário de análise gratuita, você declara que as informações fornecidas
          são verdadeiras e autoriza o contato comercial conforme descrito na{" "}
          <Link to="/privacidade" className="text-[#006CFF] hover:underline">
            Política de Privacidade
          </Link>
          . A análise gratuita não constitui proposta comercial vinculante.
        </p>
      </LegalSection>

      <LegalSection title="5. Links externos">
        <p>
          O site pode conter links para WhatsApp, Instagram e outros serviços de terceiros. Não
          nos responsabilizamos pelo conteúdo ou práticas de privacidade desses sites.
        </p>
      </LegalSection>

      <LegalSection title="6. Limitação de responsabilidade">
        <p>
          Empregamos esforços para manter informações atualizadas, mas não garantimos ausência de
          erros ou indisponibilidade temporária. Resultados de marketing variam conforme contexto
          de cada negócio; depoimentos e cases não garantem desempenho futuro.
        </p>
      </LegalSection>

      <LegalSection title="7. Alterações">
        <p>
          Podemos alterar estes Termos a qualquer momento. O uso continuado do site após
          publicação de alterações implica ciência das novas condições.
        </p>
      </LegalSection>

      <LegalSection title="8. Contato">
        <p>
          Dúvidas sobre estes Termos:{" "}
          <a href={`mailto:${LEGAL.contactEmail}`} className="text-[#006CFF] hover:underline">
            {LEGAL.contactEmail}
          </a>
          . Questões sobre dados pessoais:{" "}
          <a href={`mailto:${LEGAL.privacyEmail}`} className="text-[#006CFF] hover:underline">
            {LEGAL.privacyEmail}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
