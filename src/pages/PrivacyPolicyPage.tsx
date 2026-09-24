import { Layout } from '../components/Layout';

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="border-l-4 border-blue-500 bg-blue-50/60 rounded-r-lg px-5 py-4 text-sm text-gray-700 leading-relaxed italic">
      {children}
    </blockquote>
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

export function PrivacyPolicyPage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-12">
        <header className="mb-10">
          <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase mb-2">Privacy Policy</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Transparent, Empathetic, and DPDPA 2023-Compliant Data Stewardship
          </h1>
        </header>

        <div className="space-y-8">
          <Section title="Our Privacy Pledge: No Cold Calls, No Sold Leads">
            <p className="text-gray-600 leading-relaxed">
              In the traditional study-abroad sector in India, the standard business model is built on selling
              student leads. Many students sign up for an informational brochure or cost calculator only to find
              their personal phone number sold to dozens of aggressive agency call centers, resulting in weeks of
              unrelenting telemarketing harassment.
            </p>
            <Callout>
              Flyways Global was created to eliminate predatory lead brokering. We make an absolute promise to you:
              we will never sell, rent, or trade your phone number or email address to third-party telemarketers,
              cold-callers, or marketing agencies. Period.
            </Callout>
          </Section>

          <Section title="What Information We Collect (And Why)">
            <p className="text-gray-600 leading-relaxed">
              We only collect information that is genuinely necessary to provide you with tailored research,
              structured learning resources, and ensure an honest, personalized experience:
            </p>
            <BulletList
              items={[
                ['Account & Contact Information:', 'Your full name, email address, and optional phone/WhatsApp number. We use this to secure your account and send requested educational updates.'],
                ['Educational Profile & Intent Data:', 'Your current level of education, target study destinations, planned fields of study, and estimated budget ranges. This information allows our platform to recommend relevant country guides and insights.'],
                ['Engagement & Behavioral Metrics:', 'Time spent reading specific articles, return visits, and interaction depth. We use this data to understand which topics students find most valuable.'],
                ['Technical Information:', 'Standard server logs, IP addresses, and device/browser details used for cybersecurity, fraud prevention, and ensuring proper website display.'],
              ]}
            />
          </Section>

          <Section title="How We Use Your Data">
            <p className="text-gray-600 leading-relaxed">
              Every piece of data collected serves a clear, student-centric purpose:
            </p>
            <BulletList
              items={[
                ['Access:', 'To provide free access to our library of articles and verified insights.'],
                ['Personalisation:', 'To provide you personalized content/suggestions tailored to your study-abroad preferences and destination interests.'],
                ['Alerts:', 'To notify you about critical, time-sensitive policy alerts (e.g., changes to financial thresholds, visa caps, or work visa regulations).'],
                ['Research:', 'To conduct internal research and optimize our educational offerings.'],
              ]}
            />
          </Section>

          <Section title="Data Security, Storage & Indian Infrastructure">
            <p className="text-gray-600 leading-relaxed">
              Flyways Global adheres to rigorous cybersecurity standards. Your data is encrypted in transit using
              modern Transport Layer Security (TLS 1.3) and encrypted at rest using enterprise-grade AES-256
              protocols. Our core databases and primary servers operate in compliance with Indian data sovereignty
              guidelines.
            </p>
          </Section>

          <Section title="Your Rights Under India's DPDPA 2023">
            <p className="text-gray-600 leading-relaxed">
              Under the Digital Personal Data Protection Act, 2023, you have clear legal rights regarding your
              personal digital information:
            </p>
            <BulletList
              items={[
                ['Right to Access:', 'You may request a summary of the personal data we hold about you and the processing activities undertaken.'],
                ['Right to Correction & Completion:', 'You can update, correct, or complete any inaccurate profile details directly from your dashboard or by emailing us.'],
                ['Right to Erasure ("Right to Be Forgotten"):', 'You may delete your account and request complete erasure of your personal records at any time.'],
                ['Right to Withdraw Consent:', 'If you previously agreed to receive email updates or notifications, you can unsubscribe with a single click at any time.'],
              ]}
            />
          </Section>

          <Section title="Cookie & Tracking Transparency">
            <p className="text-gray-600 leading-relaxed">We believe in minimal, ethical web tracking:</p>
            <BulletList
              items={[
                ['Essential Cookies:', 'Required to keep you securely logged into your account and maintain session preferences.'],
                ['Analytics Cookies:', 'Anonymized usage data used to measure reading depth and fix technical bugs.'],
                ['No Cross-Site Ad Trackers:', 'We do not deploy invasive third-party ad retargeting pixels to follow you across the web.'],
              ]}
            />
          </Section>

          <Section title="Statutory Grievance Redressal Officer">
            <p className="text-gray-600 leading-relaxed">
              In accordance with the Information Technology Act, 2000 and the Digital Personal Data Protection Act,
              2023, you can address any privacy concerns, data deletion requests, or grievances directly to our
              appointed officer:
            </p>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 text-sm text-gray-600 leading-relaxed space-y-1">
              <p><strong className="text-gray-900">Designation:</strong> Data Protection &amp; Grievance Officer</p>
              <p><strong className="text-gray-900">Organization:</strong> Flyways Global</p>
              <p>
                <strong className="text-gray-900">Email:</strong>{' '}
                <a href="mailto:communications@flywaysglobal.com" className="text-blue-600 hover:underline">
                  communications@flywaysglobal.com
                </a>
              </p>
            </div>
          </Section>
        </div>
      </div>
    </Layout>
  );
}
