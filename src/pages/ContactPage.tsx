import { Layout } from '../components/Layout';

export function ContactPage() {
  return (
    <Layout>
      <div className="max-w-lg mx-auto text-center py-20">
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">Contact Us</h1>
        <p className="text-gray-500">
          Have questions or feedback? Reach us at{' '}
          <a href="mailto:hello@pendowndigital.com" className="text-blue-600 hover:underline">
            hello@pendowndigital.com
          </a>
        </p>
      </div>
    </Layout>
  );
}
