import { Mail } from 'lucide-react';
import { Layout } from '../components/Layout';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">{title}</h2>
      {children}
    </section>
  );
}

export function ContactPage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Humane, Trust-First Communication</h1>
        </header>

        <div className="space-y-8">
          <Section title="A Human Welcome">
            <blockquote className="border-l-4 border-blue-500 bg-blue-50/60 rounded-r-lg px-5 py-4 text-sm text-gray-700 leading-relaxed italic">
              "Deciding to study overseas is often a family's single biggest financial commitment. You don't need
              high-pressure telemarketers calling you three times a day. You need honest, clear answers."
            </blockquote>
            <p className="text-gray-600 leading-relaxed">
              At Flyways Global, we believe the traditional overseas education industry is broken by aggressive
              sales targets and undisclosed commissions. When you reach out to us, you are not being routed to a
              commission-driven call center. You are speaking with researchers, writers, and educators who care
              deeply about your future.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Whether you are a student feeling anxious about loan numbers, a parent trying to evaluate genuine
              return on investment, a college professor wanting a hype-free workshop on campus, or someone who
              noticed a shifting visa regulation—we are here to listen and help.
            </p>
          </Section>

          <Section title="Get in Touch">
            <p className="text-gray-600 leading-relaxed">
              For all inquiries, questions regarding our platform, editorial feedback, or campus sessions, please
              reach out to our team directly via our primary communication channels:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">General &amp; Student Inquiries</h3>
                <a href="mailto:ask@flywaysglobal.com" className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline font-medium">
                  <Mail size={14} /> ask@flywaysglobal.com
                </a>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Communications &amp; Editorial Desk</h3>
                <a href="mailto:communications@flywaysglobal.com" className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline font-medium">
                  <Mail size={14} /> communications@flywaysglobal.com
                </a>
              </div>
            </div>
          </Section>

          <Section title="Response SLA &amp; Office Coordinates">
            <div className="bg-blue-50 border border-blue-100 rounded-lg px-5 py-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                <strong className="text-gray-900">Our Human Commitment:</strong> Every message is reviewed by an
                actual team member. We do not use automated bots to dismiss your queries. You can expect a
                thoughtful, human reply within a timely manner.
              </p>
            </div>
            <div className="text-sm text-gray-600 leading-relaxed space-y-1">
              <p><strong className="text-gray-900">Registered Operations:</strong> Bengaluru, Karnataka, India</p>
              <p><strong className="text-gray-900">Working Hours:</strong> Monday – Friday | 10:00 AM – 6:30 PM IST</p>
            </div>
          </Section>
        </div>
      </div>
    </Layout>
  );
}
