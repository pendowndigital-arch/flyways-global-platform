import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white/60 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-gray-500">© {new Date().getFullYear()} Flyways Global. All rights reserved.</p>
        <div className="flex items-center gap-5">
          <Link to="/privacy-policy" className="text-sm text-gray-500 hover:text-blue-700 transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms-and-conditions" className="text-sm text-gray-500 hover:text-blue-700 transition-colors">
            Terms &amp; Conditions
          </Link>
        </div>
      </div>
    </footer>
  );
}
