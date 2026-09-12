import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Layout } from '../components/Layout';
import { activateAccount, ApiError } from '../services/authService';

type Status = 'loading' | 'success' | 'error';

export function ActivateAccountPage() {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('');
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    if (!token) {
      setStatus('error');
      setMessage('Activation link is invalid or missing a token.');
      return;
    }

    activateAccount(token)
      .then(msg => { setStatus('success'); setMessage(msg); })
      .catch(err => {
        setStatus('error');
        setMessage(err instanceof ApiError ? err.message : 'Unable to activate your account. Please try again.');
      });
  }, [token]);

  return (
    <Layout>
      <div className="max-w-md mx-auto py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

          <div className="px-8 py-10 flex flex-col items-center text-center">
            {status === 'loading' && (
              <>
                <Loader2 size={36} className="text-blue-600 animate-spin mb-4" />
                <h1 className="text-lg font-semibold text-gray-900 mb-1">Activating your account…</h1>
                <p className="text-sm text-gray-500">Please wait a moment.</p>
              </>
            )}

            {status === 'success' && (
              <>
                <CheckCircle2 size={40} className="text-green-600 mb-4" />
                <h1 className="text-lg font-semibold text-gray-900 mb-1.5">Account activated</h1>
                <p className="text-sm text-gray-600 mb-6">{message}</p>
                <Link
                  to="/login"
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 hover:shadow-md hover:shadow-blue-200 transition-all duration-200 active:scale-95"
                >
                  Continue to Sign In
                </Link>
              </>
            )}

            {status === 'error' && (
              <>
                <XCircle size={40} className="text-red-500 mb-4" />
                <h1 className="text-lg font-semibold text-gray-900 mb-1.5">Activation failed</h1>
                <p className="text-sm text-gray-600 mb-6">{message}</p>
                <Link
                  to="/login"
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back to Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
