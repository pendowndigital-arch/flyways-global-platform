import { Layout } from '../components/Layout';

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-lg px-5 py-4 text-sm text-gray-700 leading-relaxed">
      {children}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">{title}</h2>
      {children}
    </section>
  );
}

function BulletList({ items }: { items: [string, string][] }) {
  return (
    <ul className="space-y-3">
      {items.map(([label, text]) => (
        <li key={label} className="flex gap-2.5 text-sm text-gray-600 leading-relaxed">
          <span className="text-blue-600 font-bold flex-shrink-0">•</span>
          <span><strong className="text-gray-900">{label}</strong> {text}</span>
        </li>
      ))}
    </ul>
  );
}

export function TermsPage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-12">
        <header className="mb-10">
          <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase mb-2">Terms and Conditions</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Plain-Language and Transparent Platform Operating Terms</h1>
        </header>

        <div className="space-y-8">
          <Section title="Welcome and Agreement">
            <p className="text-gray-600 leading-relaxed">
              These Terms and Conditions ("Terms") govern your access to and use of the Flyways Global website and
              related tools (collectively, the "Platform"), operated by Flyways Global ("Flyways", "we", "us", or
              "our"), based in Bengaluru, Karnataka, India.
            </p>
            <p className="text-gray-600 leading-relaxed">
              By registering on Flyways, browsing our guides, or interacting with our platform, you confirm that you
              have read, understood, and agreed to be bound by these Terms. If you do not agree with any part of
              these terms, please discontinue using the platform.
            </p>
          </Section>

          <Section title="Nature of the Platform: Educational & Decision Support Only">
            <Callout>
              <strong className="text-gray-900">Crucial Notice:</strong> Flyways Global is an independent
              educational decision platform. We are <strong className="text-gray-900">not</strong> an immigration
              consultancy, law firm, bank, embassy, or university admissions office.
            </Callout>
            <BulletList
              items={[
                ['Informational Purposes Only:', 'All published articles, cost estimates, and platform responses are provided solely for general educational and decision-support purposes. None of our content constitutes formal legal, financial, tax, or immigration advice.'],
                ['No Outcome Guarantee:', 'Flyways does not guarantee university admissions, scholarship awards, visa approvals, or post-study employment. Final admissions decisions rest exclusively with degree-granting universities, and immigration decisions rest solely with relevant sovereign foreign governments.'],
              ]}
            />
          </Section>

          <Section title="Student Accounts & Registration">
            <BulletList
              items={[
                ['Account Integrity:', 'You agree to provide accurate, truthful information when creating your profile or exploring our resources. Creating impersonated or fraudulent profiles is strictly prohibited.'],
                ['Free Access:', 'Our core content and articles are provided completely free of charge to registered students. Future optional tools may be introduced as pay-per-use utilities, which will always be clearly designated with upfront pricing.'],
              ]}
            />
          </Section>

          <Section title="Official Sourced Data">
            <p className="text-gray-600 leading-relaxed">
              Flyways utilizes information synthesized from authoritative public-domain portals, including foreign
              consular offices, embassies, and official governmental bodies.
            </p>
            <BulletList
              items={[
                ['User Responsibility for Secondary Verification:', 'While our research team works tirelessly to keep data current, immigration rules, visa quotas, and university tuition fees change rapidly. You must always cross-check critical figures, deadlines, and requirements on primary official embassy or university portals before submitting fees or documents.'],
              ]}
            />
          </Section>

          <Section title="Intellectual Property & Fair Use">
            <p className="text-gray-600 leading-relaxed">
              All original content, analysis, graphics, software architecture, and branding marks belong exclusively
              to Flyways Global and are protected under Indian and international copyright and trademark laws.
            </p>
            <BulletList
              items={[
                ['Permitted Use:', 'You are granted a personal, non-exclusive, non-commercial license to view, study, and print our materials for your own educational journey.'],
                ['Prohibited Actions:', 'You may not scrape, copy, republish, resell, or train external commercial AI models on our proprietary guides or structures without explicit written authorization from Flyways Global.'],
              ]}
            />
          </Section>

          <Section title="Limitation of Liability">
            <p className="text-gray-600 leading-relaxed">
              To the maximum extent permitted by Indian law, Flyways Global, its founders, team members, and
              contributors shall not be liable for any indirect, incidental, consequential, or punitive damages
              resulting from your use of the platform, including but not limited to university rejection, visa
              refusal, monetary loss incurred from third-party services, or changes in overseas government
              immigration policies.
            </p>
          </Section>

          <Section title="Governing Law & Dispute Resolution">
            <p className="text-gray-600 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the Republic of India.
              In the unlikely event of any dispute or claim arising out of these Terms or your use of the platform,
              you agree that the courts located in <strong className="text-gray-900">Bengaluru, Karnataka, India</strong>{' '}
              shall have exclusive jurisdiction.
            </p>
          </Section>
        </div>
      </div>
    </Layout>
  );
}
