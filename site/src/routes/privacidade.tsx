import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPageLayout, LegalSection } from "@/components/legal/LegalPageLayout";
import { LEGAL } from "@/lib/legal-config";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade | Toró Marketing" },
      {
        name: "description",
        content:
          "Saiba como a Toró Marketing trata seus dados pessoais em conformidade com a LGPD.",
      },
    ],
  }),
  component: PrivacidadePage,
});

function PrivacidadePage() {
  return (
    <LegalPageLayout title="Política de Privacidade" updatedAt={LEGAL.privacyPolicyVersion}>
      <p>
        Esta Política de Privacidade descreve como a {LEGAL.companyName}, responsável pelo site{" "}
        {LEGAL.website}, trata dados pessoais de visitantes e clientes em conformidade com a Lei nº
        13.709/2018 (LGPD).
      </p>

      <LegalSection title="1. Quem somos (controlador)">
        <p>
          A {LEGAL.companyName} é a controladora dos dados pessoais tratados por meio deste site e
          do formulário de análise gratuita. Para assuntos de privacidade, entre em contato pelo
          e-mail{" "}
          <a href={`mailto:${LEGAL.privacyEmail}`} className="text-[#006CFF] hover:underline">
            {LEGAL.privacyEmail}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="2. Dados que coletamos">
        <p>Podemos tratar as seguintes categorias de dados:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Navegação no site:</strong> endereço IP, tipo de navegador, páginas visitadas,
            data e hora de acesso, cookies e identificadores de dispositivo (quando aplicável).
          </li>
          <li>
            <strong>Formulário de análise gratuita:</strong> nome, WhatsApp, nome da empresa,
            segmento, Instagram (opcional), faixa de faturamento mensal aproximada e principal
            desafio de marketing.
          </li>
          <li>
            <strong>Contato:</strong> dados enviados por e-mail, WhatsApp ou redes sociais quando
            você entra em contato conosco.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Finalidades e bases legais">
        <p>Utilizamos seus dados para:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Responder solicitações de análise gratuita e manter contato comercial (base legal:
            consentimento e execução de procedimentos preliminares relacionados a contrato, art. 7º,
            I e V da LGPD).
          </li>
          <li>
            Melhorar o site, medir audiência e campanhas (base legal: consentimento, quando
            cookies de analytics/marketing forem utilizados).
          </li>
          <li>
            Cumprir obrigações legais e exercer direitos em processos (base legal: cumprimento de
            obrigação legal ou regulatória).
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="cookies" title="4. Cookies e tecnologias similares">
        <p>
          Cookies são pequenos arquivos armazenados no seu navegador. Utilizamos cookies e
          tecnologias similares nas categorias abaixo:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Essenciais:</strong> necessários para o funcionamento básico do site (ex.:
            preferências de consentimento). Não exigem consentimento.
          </li>
          <li>
            <strong>Analytics e marketing:</strong> ferramentas como Google Analytics e Meta Pixel,
            quando ativadas, medem tráfego e desempenho de campanhas. Só são carregadas após seu
            consentimento explícito pelo banner de cookies.
          </li>
        </ul>
        <p>
          Você pode alterar suas preferências a qualquer momento limpando os dados do site no
          navegador ou entrando em contato conosco. Saiba mais em{" "}
          <Link to="/privacidade" hash="cookies" className="text-[#006CFF] hover:underline">
            esta seção
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="5. Compartilhamento com operadores">
        <p>Podemos compartilhar dados com prestadores que nos auxiliam na operação, tais como:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Plataformas de CRM e automação de marketing</li>
          <li>Serviços de e-mail e comunicação (incluindo WhatsApp Business)</li>
          <li>Hospedagem e infraestrutura de nuvem</li>
          <li>Google (Analytics, Fonts) e Meta (Pixel), quando consentidos</li>
        </ul>
        <p>
          Esses operadores tratam dados conforme nossas instruções e apenas para as finalidades
          descritas nesta política.
        </p>
      </LegalSection>

      <LegalSection title="6. Transferência internacional">
        <p>
          Alguns fornecedores (como Google e Meta) podem processar dados em servidores fora do
          Brasil, inclusive nos Estados Unidos. Nesses casos, adotamos medidas contratuais e
          técnicas compatíveis com a LGPD para proteger seus dados.
        </p>
      </LegalSection>

      <LegalSection title="7. Retenção e eliminação">
        <p>
          Mantemos dados pessoais de leads e contatos por {LEGAL.retentionPeriod}. Após esse
          período, eliminamos ou anonimizamos os dados, salvo obrigação legal de retenção.
        </p>
      </LegalSection>

      <LegalSection title="8. Seus direitos">
        <p>Nos termos da LGPD, você pode solicitar:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Confirmação da existência de tratamento e acesso aos dados</li>
          <li>Correção de dados incompletos, inexatos ou desatualizados</li>
          <li>Anonimização, bloqueio ou eliminação de dados desnecessários</li>
          <li>Portabilidade, quando aplicável</li>
          <li>Revogação do consentimento e informação sobre compartilhamentos</li>
        </ul>
        <p>
          Envie sua solicitação para{" "}
          <a href={`mailto:${LEGAL.privacyEmail}`} className="text-[#006CFF] hover:underline">
            {LEGAL.privacyEmail}
          </a>
          . Responderemos em prazo razoável conforme a legislação.
        </p>
      </LegalSection>

      <LegalSection title="9. Segurança">
        <p>
          Adotamos medidas técnicas e organizacionais para proteger dados pessoais contra acessos
          não autorizados, perda ou destruição. Nenhum sistema é 100% seguro; recomendamos também
          proteger suas credenciais e dispositivos.
        </p>
      </LegalSection>

      <LegalSection title="10. Alterações">
        <p>
          Esta política pode ser atualizada periodicamente. A data da última revisão consta no topo
          desta página. Alterações relevantes serão comunicadas por meio do site ou contato direto,
          quando aplicável.
        </p>
        <p>
          Consulte também nossos{" "}
          <Link to="/termos" className="text-[#006CFF] hover:underline">
            Termos de Uso
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
