import { X } from 'lucide-react';

export type LegalDoc = 'privacy' | 'terms';

const CONTENT: Record<LegalDoc, { title: string; updated: string; body: string[] }> = {
  privacy: {
    title: 'Privacy Policy',
    updated: 'Last updated: January 2026',
    body: [
      'This is placeholder content for the Privacy Policy. Replace it with your actual policy before launch.',
      'We collect information you provide directly to us, such as your name, email address, and phone number when you create an account, along with usage data collected automatically as you browse the site.',
      'We use this information to operate and improve Flyways Global, personalise the content we show you, communicate with you about your account, and comply with legal obligations.',
      'We do not sell your personal information. We may share it with service providers who help us run the platform, or when required by law.',
      'You can request access to, correction of, or deletion of your personal data at any time by contacting us through the Contact Us page.',
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    updated: 'Last updated: January 2026',
    body: [
      'This is placeholder content for the Terms & Conditions. Replace it with your actual terms before launch.',
      'By accessing or using Flyways Global, you agree to be bound by these terms. If you do not agree, please do not use the platform.',
      'You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.',
      'Content on this site is provided for informational purposes only and does not constitute professional immigration, legal, or financial advice.',
      'We may update these terms from time to time. Continued use of the platform after changes are posted constitutes acceptance of the revised terms.',
    ],
  },
};

interface LegalModalProps {
  doc: LegalDoc;
  onClose: () => void;
}

export function LegalModal({ doc, onClose }: LegalModalProps) {
  const { title, updated, body } = CONTENT[doc];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div role="dialog" aria-modal="true" aria-labelledby="legal-modal-title"
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 flex-shrink-0" />

        <div className="px-8 pt-7 pb-4 relative flex-shrink-0 text-center">
          <button onClick={onClose} aria-label="Close"
            className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
          <h2 id="legal-modal-title" className="text-xl font-bold text-gray-900 mb-1">{title}</h2>
          <p className="text-sm text-gray-500">{updated}</p>
        </div>

        <div className="px-8 pb-8 overflow-y-auto space-y-4">
          {body.map((paragraph, i) => (
            <p key={i} className="text-sm text-gray-600 leading-relaxed">{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
