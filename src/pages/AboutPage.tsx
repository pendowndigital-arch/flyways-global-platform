import { Layout } from '../components/Layout';

export function AboutPage() {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-12">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">About Us</h1>
        <p className="text-gray-600 leading-relaxed mb-4">
          PenDown Digital is a content platform dedicated to helping students navigate the complex world
          of international education — from visa applications and scholarship hunting to finding housing
          and understanding campus regulations.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Our team of experienced writers and advisors curate up-to-date, accurate, and actionable
          articles so you can focus on what matters: achieving your academic goals.
        </p>
      </div>
    </Layout>
  );
}
