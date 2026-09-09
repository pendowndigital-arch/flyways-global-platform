import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Lock, KeyRound } from 'lucide-react';
import { Layout } from '../components/Layout';
import { resetPassword, ApiError } from '../services/authService';

// At least one lowercase, one uppercase and one digit, 8+ characters.
const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const PASSWORD_HINT = 'At least 8 characters, with uppercase, lowercase and a number';

const inputCls = (error?: string) =>
  `w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
    error ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400'
  }`;

function Field({ id, label, error, children }: {
  id: string; label: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-gray-600 mb-1.5 tracking-wide">{label}</label>
      <div className="relative">
        <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        {children}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async () => {
    const errs: Record<string, string> = {};
    if (!password) errs.password = 'Password is required';
    else if (!PASSWORD_RE.test(password)) errs.password = PASSWORD_HINT;
    if (!confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    if (!token) {
      setSubmitError('Reset link is invalid or missing a token.');
      return;
    }

    setSubmitError('');
    setSuccessMessage('');
    setIsSubmitting(true);
    try {
      const message = await resetPassword(token, password);
      setSuccessMessage(message);
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : 'Unable to reset password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

          <div className="px-8 py-7">
            <div className="flex items-center gap-2.5 mb-1">
              <KeyRound size={18} className="text-blue-600" />
              <h1 className="text-lg font-semibold text-gray-900">Reset your password</h1>
            </div>
            <p className="text-sm text-gray-500 mb-6">Enter a new password for your account.</p>

            {successMessage && (
              <p className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2.5">
                {successMessage}
              </p>
            )}
            {submitError && (
              <p className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                {submitError}
              </p>
            )}

            <div className="space-y-4">
              <Field id="rp-password" label="New Password" error={errors.password}>
                <input
                  id="rp-password" type="password" value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  placeholder={PASSWORD_HINT} autoComplete="new-password"
                  className={inputCls(errors.password)}
                />
              </Field>
              <Field id="rp-confirm-password" label="Confirm New Password" error={errors.confirmPassword}>
                <input
                  id="rp-confirm-password" type="password" value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  placeholder="Re-enter your new password" autoComplete="new-password"
                  className={inputCls(errors.confirmPassword)}
                />
              </Field>

              <button
                type="button" onClick={handleSubmit} disabled={isSubmitting}
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 hover:shadow-md hover:shadow-blue-200 transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Resetting…' : 'Reset Password'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
