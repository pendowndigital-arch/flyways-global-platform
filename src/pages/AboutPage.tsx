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

export function AboutPage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-12">
        <header className="mb-10">
          <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase mb-2">About Flyways Global</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            A Student-First Decision Platform Built on Radical Transparency
          </h1>
        </header>

        <div className="space-y-8">
          <Section title="The Uncomfortable Truth About Studying Abroad">
            <p className="text-gray-600 leading-relaxed">
              Every year, hundreds of thousands of Indian graduates and school-leavers dream of taking flight. For
              most families, sending a child overseas for higher education is not a casual lifestyle choice—it is a
              monumental financial and emotional leap, funded by ancestral land sales, retirement savings, or
              massive multi-decade bank loans.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Yet for decades, the study-abroad ecosystem in India has been structured around a glaring conflict of
              interest:
            </p>
            <Callout>
              Most study-abroad consultancies advertise "free guidance" to students. In reality, they earn
              substantial commissions—often thousands of dollars per enrollment—from specific foreign universities.
              When an advisor is financially rewarded for sending you to University A over University B, you are not
              receiving independent counsel; you are the product being sold.
            </Callout>
            <p className="text-gray-600 leading-relaxed">
              In 2026, the margin for error has disappeared. With shifting immigration caps, stricter post-study
              work regulations in traditional destinations, rising cost of living, and mandatory living-cost
              requirements, Indian students cannot afford biased advice. A misguided choice is no longer just a
              disappointing semester—it is an economic catastrophe.
            </p>
          </Section>

          <Section title="Why Flyways Global Exists">
            <p className="text-gray-600 leading-relaxed">
              Flyways Global was founded to stand firmly on the student's side of the table. We believe that
              choosing where to study, how to finance it, and whether to go abroad at all should be guided by cold,
              hard data—not glossy promotional brochures or sales quotas.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We are not a consultancy. We do not represent universities. We are a decision platform designed to
              empower students and their families with the unvarnished facts and objective intelligence needed to
              make life-defining choices with absolute confidence.
            </p>
          </Section>

          <Section title="The Core Pillars of Our Platform">
            <p className="text-gray-600 leading-relaxed">
              Rather than acting as another opinion blog, Flyways Global operates a comprehensive educational
              ecosystem:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">
                  The Continuous Ground-Truth Content Engine
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Our in-house editorial team of researchers and subject-matter reviewers publishes ongoing, deeply
                  investigated analyses. We explore the topics commercial agencies avoid: real after-tax salaries,
                  post-study work visa realities, part-time job availability, hidden currency conversion costs, and
                  honest return on investment (ROI).
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">Grassroots College Outreach</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  We believe genuine trust is built face-to-face. Flyways actively visits university campuses and
                  colleges across Indian cities, conducting factual, hype-free workshops that demystify global
                  admissions for students long before they encounter high-pressure sales agents.
                </p>
              </div>
            </div>
          </Section>

          <Section title="Our Guiding Principles">
            <ul className="space-y-3">
              {[
                ['Radical Honesty:', 'If an international degree or destination does not justify its cost in 2026, we tell you openly. If staying in India or exploring an emerging alternative is the smarter choice, we say it.'],
                ['Respect for Family Capital:', "We treat every student's budget with the sanctity it deserves. Education should unlock generational prosperity, not debt traps."],
                ['Facts Over Promises:', 'We believe in verifiable numbers, primary official sources, and transparent methodologies over marketing rhetoric.'],
                ['Student-First Independence:', 'Our advice is never bought, sponsored, or influenced by university recruitment quotas.'],
              ].map(([label, text]) => (
                <li key={label} className="flex gap-2.5 text-sm text-gray-600 leading-relaxed">
                  <span className="text-blue-600 font-bold flex-shrink-0">•</span>
                  <span><strong className="text-gray-900">{label}</strong> {text}</span>
                </li>
              ))}
            </ul>
          </Section>
        </div>

        <p className="text-center text-xs text-gray-400 mt-12 pt-6 border-t border-gray-100">
          Flyways Global © 2026 • Grounded in Bengaluru, Built for Ambitious Minds Across India
        </p>
      </div>
    </Layout>
  );
}
