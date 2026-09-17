import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useSearchParams, Navigate } from 'react-router-dom';
import { User as UserIcon, Mail, Phone, Lock, ChevronRight, Check, Sparkles, ArrowLeft } from 'lucide-react';
import { Layout } from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { registerUser, loginUser, forgotPassword, ApiError } from '../services/authService';
import { getCurrentUser } from '../services/userService';

// ── Constants ────────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Country code (entered inside the braces, e.g. "+1") and local number
// (always exactly 10 digits) are captured as separate fields.
const DEFAULT_COUNTRY_CODE = '+91';
const COUNTRY_CODE_RE = /^\+\d{1,3}$/;
const PHONE_LOCAL_LENGTH = 10;
const PHONE_RE = new RegExp(`^\\d{${PHONE_LOCAL_LENGTH}}$`);
const NAME_MAX_LENGTH = 100;

// Keeps only digits, capped at 3, always prefixed with "+" once non-empty.
function sanitizeCountryCode(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 3);
  return digits ? `+${digits}` : '';
}
// At least one lowercase, one uppercase and one digit, 8+ characters.
const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const PASSWORD_HINT = 'At least 8 characters, with uppercase, lowercase and a number';

const DEFAULT_STATEMENTS = [
  'BTech Computer Science graduate with 3.5 years experience and IELTS 7',
  'Masters student in Business Administration looking to study abroad',
  'Working professional with 5 years experience seeking work visa guidance',
  'Recent graduate exploring scholarship opportunities in Europe',
  'MBBS graduate planning to apply for medical residency abroad',
  'Software engineer with 2 years experience interested in Canada PR',
  'Undergraduate student preparing for GRE and MS applications in the US',
  'Commerce graduate planning to pursue MBA from a top UK university',
  'Nurse with 4 years experience exploring overseas work opportunities',
  'High school student researching undergraduate programs in Canada and Australia',
];

// ── Storage helpers ──────────────────────────────────────────────────────────

function loadStatements(): string[] {
  try { return JSON.parse(localStorage.getItem('flyways_preparedStatements') ?? ''); } catch {}
  return DEFAULT_STATEMENTS;
}

function saveStatement(stmt: string) {
  const list = loadStatements();
  if (!list.includes(stmt))
    localStorage.setItem('flyways_preparedStatements', JSON.stringify([...list, stmt]));
}

// ── Shared styles ────────────────────────────────────────────────────────────

const inputCls = (error?: string) =>
  `w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
    error ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400'
  }`;

const primaryBtnCls =
  'py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 hover:shadow-md hover:shadow-blue-200 transition-all duration-200 active:scale-95';

// ── Field component ──────────────────────────────────────────────────────────

function Field({ id, label, icon: Icon, error, children }: {
  id: string; label: string; icon: React.ElementType; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-gray-600 mb-1.5 tracking-wide">{label}</label>
      <div className="relative">
        <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        {children}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

export type AuthPageMode = 'signin' | 'signup';

interface AuthPageProps {
  mode: AuthPageMode;
}

interface LocationState {
  successMessage?: string;
  prefillEmail?: string;
}

export function AuthPage({ mode }: AuthPageProps) {
  const { isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  const redirectQuery = searchParams.get('redirect') ? `?redirect=${encodeURIComponent(redirectTo)}` : '';

  const locationState = location.state as LocationState | null;

  const [showForgot, setShowForgot] = useState(false);
  const [step, setStep] = useState(1);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState(DEFAULT_COUNTRY_CODE);
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [description, setDescription] = useState('');
  const [siEmail, setSiEmail] = useState(locationState?.prefillEmail ?? '');
  const [siPassword, setSiPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(locationState?.successMessage ?? '');
  const [signInError, setSignInError] = useState('');

  const [forgotEmail, setForgotEmail] = useState('');
  const [isSendingForgot, setIsSendingForgot] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');
  const [forgotError, setForgotError] = useState('');

  const descRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Live suggestions
  useEffect(() => {
    const q = description.trim();
    if (q.length < 2) { setSuggestions([]); setShowSuggestions(false); return; }
    const filtered = loadStatements().filter(s => s.toLowerCase().includes(q.toLowerCase()));
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  }, [description]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!descRef.current?.contains(t) && !suggestionsRef.current?.contains(t))
        setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, []);

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const goToMode = (m: AuthPageMode) => {
    setStep(1); setErrors({}); setSignInError('');
    navigate(`${m === 'signin' ? '/login' : '/signup'}${redirectQuery}`);
  };

  const goToForgot = () => {
    setErrors({}); setForgotMessage(''); setForgotError('');
    setForgotEmail(siEmail);
    setShowForgot(true);
  };

  const backToSignIn = () => {
    setErrors({}); setForgotMessage(''); setForgotError('');
    setShowForgot(false);
  };

  const handleForgotPassword = async () => {
    const trimmed = forgotEmail.trim();
    if (!trimmed) { setErrors({ forgotEmail: 'Email is required' }); return; }
    if (!EMAIL_RE.test(trimmed)) { setErrors({ forgotEmail: 'Enter a valid email address' }); return; }

    setErrors({});
    setForgotError('');
    setIsSendingForgot(true);
    try {
      const message = await forgotPassword(trimmed);
      setForgotMessage(message);
    } catch (err) {
      setForgotMessage('');
      setForgotError(err instanceof ApiError ? err.message : 'Unable to send reset instructions. Please try again.');
    } finally {
      setIsSendingForgot(false);
    }
  };

  const handleSignIn = async () => {
    const errs: Record<string, string> = {};
    if (!siEmail.trim()) errs.siEmail = 'Email is required';
    else if (!EMAIL_RE.test(siEmail)) errs.siEmail = 'Enter a valid email address';
    if (!siPassword) errs.siPassword = 'Password is required';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSignInError('');
    setIsSigningIn(true);
    try {
      await loginUser(siEmail.trim(), siPassword);
      const profile = await getCurrentUser();
      setSuccessMessage('');
      signIn(profile);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Unable to sign in. Please try again.';
      setSuccessMessage('');
      setSignInError(message);
    } finally {
      setIsSigningIn(false);
    }
  };

  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!email.trim()) errs.email = 'Email is required';
    else if (!EMAIL_RE.test(email)) errs.email = 'Enter a valid email address';
    if (!countryCode.trim()) errs.countryCode = 'Required';
    else if (!COUNTRY_CODE_RE.test(countryCode.trim())) errs.countryCode = 'Invalid';
    if (!phone.trim()) errs.phone = 'Mobile number is required';
    else if (!PHONE_RE.test(phone.trim())) errs.phone = 'Enter a valid 10-digit mobile number';
    if (!password) errs.password = 'Password is required';
    else if (!PASSWORD_RE.test(password)) errs.password = PASSWORD_HINT;
    if (!confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (!PASSWORD_RE.test(confirmPassword)) errs.confirmPassword = PASSWORD_HINT;
    else if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!consent) errs.consent = 'You must agree to the privacy policy to continue';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProceed = () => { if (validateStep1()) { setErrors({}); setStep(2); } };

  const handleSubmit = async () => {
    if (!description.trim()) { setErrors({ description: 'Please describe yourself to continue' }); return; }
    const trimmed = description.trim();
    if (!loadStatements().includes(trimmed)) saveStatement(trimmed);

    setIsSubmitting(true);
    try {
      const message = await registerUser({
        name: email.trim(),
        mail: email.trim(),
        password,
        field_fullname: name.trim(),
        field_phone_number: `${countryCode.replace(/\D/g, '')}${phone.trim()}`,
        field_bio: trimmed,
      });
      navigate(`/login${redirectQuery}`, { state: { successMessage: message, prefillEmail: email.trim() } });
    } catch (err) {
      if (err instanceof ApiError && err.details) {
        const mapped: Record<string, string> = {};
        if (err.details.mail) mapped.email = err.details.mail[0];
        if (err.details.name) mapped.email = err.details.name[0];
        if (err.details.password) mapped.password = err.details.password[0];
        if (err.details.field_phone_number) mapped.phone = err.details.field_phone_number[0];
        if (err.details.field_fullname) mapped.name = err.details.field_fullname[0];
        if (Object.keys(mapped).length === 0) mapped.description = err.message;
        setErrors(mapped);
        if (mapped.email || mapped.password || mapped.phone || mapped.name) setStep(1);
      } else {
        setErrors({ description: err instanceof Error ? err.message : 'Registration failed. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSignup = mode === 'signup';
  const title = showForgot
    ? 'Reset your password'
    : isSignup ? (step === 1 ? 'Create Your Account' : 'Tell us about yourself') : 'Sign in to Flyways Global';
  const subtitle = showForgot
    ? "Enter your email and we'll send you reset instructions."
    : isSignup ? (step === 1 ? 'Join thousands navigating global mobility.' : 'Help us personalise your experience.')
    : 'Access exclusive content on study, work, and residence abroad.';

  return (
    <Layout>
      <div className="max-w-md mx-auto py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

          <div className="px-8 pt-7 pb-8">
            <div className="mb-5">
              <h1 className="text-xl font-bold text-gray-900 mb-1">{title}</h1>
              <p className="text-sm text-gray-500">{subtitle}</p>
            </div>

            {/* Sign In */}
            {mode === 'signin' && !showForgot && (
              <div className="space-y-4">
                {successMessage && (
                  <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2.5">
                    {successMessage}
                  </p>
                )}
                {signInError && (
                  <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                    {signInError}
                  </p>
                )}
                <Field id="si-email" label="Email ID" icon={Mail} error={errors.siEmail}>
                  <input
                    id="si-email" type="email" value={siEmail} onChange={e => setSiEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSignIn()}
                    placeholder="you@example.com" autoComplete="email" autoFocus
                    className={inputCls(errors.siEmail)}
                  />
                </Field>
                <Field id="si-password" label="Password" icon={Lock} error={errors.siPassword}>
                  <input
                    id="si-password" type="password" value={siPassword} onChange={e => setSiPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSignIn()}
                    placeholder="Enter your password" autoComplete="current-password"
                    className={inputCls(errors.siPassword || signInError)}
                  />
                </Field>
                <div className="flex justify-end -mt-2">
                  <button type="button" onClick={goToForgot}
                    className="text-xs text-blue-600 hover:underline font-medium">
                    Forgot password?
                  </button>
                </div>
                <button onClick={handleSignIn} disabled={isSigningIn} className={`w-full ${primaryBtnCls} disabled:opacity-60 disabled:cursor-not-allowed`}>
                  {isSigningIn ? 'Signing in…' : 'Sign In'}
                </button>
                <p className="text-center text-sm text-gray-400">
                  Don't have an account?{' '}
                  <button onClick={() => goToMode('signup')} className="text-blue-600 hover:underline font-medium">Sign Up</button>
                </p>
              </div>
            )}

            {/* Forgot Password */}
            {mode === 'signin' && showForgot && (
              <div className="space-y-4">
                {forgotMessage && (
                  <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2.5">
                    {forgotMessage}
                  </p>
                )}
                {forgotError && (
                  <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                    {forgotError}
                  </p>
                )}
                <Field id="fp-email" label="Email ID" icon={Mail} error={errors.forgotEmail}>
                  <input
                    id="fp-email" type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleForgotPassword()}
                    placeholder="you@example.com" autoComplete="email" autoFocus
                    className={inputCls(errors.forgotEmail)}
                  />
                </Field>
                <button onClick={handleForgotPassword} disabled={isSendingForgot} className={`w-full ${primaryBtnCls} disabled:opacity-60 disabled:cursor-not-allowed`}>
                  {isSendingForgot ? 'Sending…' : 'Send Reset Instructions'}
                </button>
                <p className="text-center text-sm text-gray-400">
                  <button onClick={backToSignIn} className="text-blue-600 hover:underline font-medium inline-flex items-center gap-1">
                    <ArrowLeft size={13} /> Back to Sign In
                  </button>
                </p>
              </div>
            )}

            {/* Step indicator */}
            {isSignup && (
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <div className={`flex-1 h-0.5 transition-colors duration-300 ${step === 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
                <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${step === 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                <span className="ml-1 text-xs text-gray-400 font-medium whitespace-nowrap">Step {step} of 2</span>
              </div>
            )}

            {/* Sign Up Step 1: Basic Info */}
            {isSignup && step === 1 && (
              <div className="space-y-4">
                <Field id="su-name" label="Full Name" icon={UserIcon} error={errors.name}>
                  <input id="su-name" type="text" value={name} onChange={e => setName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleProceed()}
                    placeholder="e.g. Arjun Sharma" maxLength={NAME_MAX_LENGTH} autoComplete="name" className={inputCls(errors.name)} />
                </Field>
                <Field id="su-email" label="Email ID" icon={Mail} error={errors.email}>
                  <input id="su-email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleProceed()}
                    placeholder="you@example.com" autoComplete="email" className={inputCls(errors.email)} />
                </Field>
                <div>
                  <label htmlFor="su-phone" className="block text-xs font-semibold text-gray-600 mb-1.5 tracking-wide">Mobile Number</label>
                  <div className="flex gap-2">
                    <div className={`flex items-center border rounded-lg transition-colors ${
                      errors.countryCode ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}>
                      <span className="pl-2.5 text-gray-400 text-sm select-none">(</span>
                      <input id="su-country-code" type="text" inputMode="tel" value={countryCode}
                        onChange={e => setCountryCode(sanitizeCountryCode(e.target.value))}
                        onKeyDown={e => e.key === 'Enter' && handleProceed()}
                        placeholder={DEFAULT_COUNTRY_CODE} maxLength={4}
                        className="w-12 py-2.5 text-sm text-gray-900 text-center bg-transparent focus:outline-none" />
                      <span className="pr-2.5 text-gray-400 text-sm select-none">)</span>
                    </div>
                    <div className="relative flex-1">
                      <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input id="su-phone" type="tel" inputMode="numeric" value={phone}
                        onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, PHONE_LOCAL_LENGTH))}
                        onKeyDown={e => e.key === 'Enter' && handleProceed()}
                        placeholder="2025551234" maxLength={PHONE_LOCAL_LENGTH} autoComplete="tel"
                        className={inputCls(errors.phone)} />
                    </div>
                  </div>
                  {(errors.countryCode || errors.phone) && (
                    <p className="mt-1 text-xs text-red-500">{errors.countryCode ? `Country code: ${errors.countryCode}` : errors.phone}</p>
                  )}
                </div>
                <Field id="su-password" label="Password" icon={Lock} error={errors.password}>
                  <input id="su-password" type="password" value={password} onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleProceed()}
                    placeholder={PASSWORD_HINT} autoComplete="new-password" className={inputCls(errors.password)} />
                </Field>
                <Field id="su-confirm-password" label="Confirm Password" icon={Lock} error={errors.confirmPassword}>
                  <input id="su-confirm-password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleProceed()}
                    placeholder="Re-enter your password" autoComplete="new-password" className={inputCls(errors.confirmPassword)} />
                </Field>

                <div>
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <button type="button" role="checkbox" aria-checked={consent}
                      onClick={() => setConsent(v => !v)}
                      className={`mt-0.5 w-4 h-4 flex-shrink-0 rounded border-2 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        consent ? 'bg-blue-600 border-blue-600' : errors.consent ? 'border-red-400' : 'border-gray-400 hover:border-blue-500'
                      }`}>
                      {consent && <Check size={10} className="text-white" strokeWidth={3} />}
                    </button>
                    <span className="text-xs text-gray-600 leading-relaxed">
                      I agree to the{' '}
                      <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">Privacy Policy</a>
                      {' '}and consent to processing of my personal information (Email &amp; Phone) in accordance with data protection regulations.
                    </span>
                  </label>
                  {errors.consent && <p className="mt-1.5 text-xs text-red-500">{errors.consent}</p>}
                </div>

                <button onClick={handleProceed} className={`w-full mt-2 flex items-center justify-center gap-2 ${primaryBtnCls}`}>
                  Proceed <ChevronRight size={16} />
                </button>
                <p className="text-center text-sm text-gray-400">
                  Already have an account?{' '}
                  <button onClick={() => goToMode('signin')} className="text-blue-600 hover:underline font-medium">Sign In</button>
                </p>
              </div>
            )}

            {/* Sign Up Step 2: Describe yourself */}
            {isSignup && step === 2 && (
              <div className="space-y-4">
                <div className="relative">
                  <label htmlFor="su-desc" className="block text-xs font-semibold text-gray-600 mb-1.5 tracking-wide">Describe Yourself</label>
                  <div className="relative">
                    <Sparkles size={15} className="absolute left-3 top-3.5 text-gray-400 pointer-events-none" />
                    <textarea id="su-desc" ref={descRef} value={description}
                      onChange={e => setDescription(e.target.value)}
                      onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                      placeholder='e.g. "BTech Computer Science graduate with 3.5 years experience and IELTS 7"'
                      rows={3} className={`${inputCls(errors.description)} resize-none`}
                    />
                  </div>
                  {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}

                  {showSuggestions && (
                    <div ref={suggestionsRef} className="absolute z-10 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
                      <div className="px-3 py-1.5 bg-gray-50 border-b border-gray-100">
                        <span className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                          <Sparkles size={11} /> Suggestions
                        </span>
                      </div>
                      <div className="max-h-44 overflow-y-auto">
                        {suggestions.map((s, i) => (
                          <button key={i} type="button"
                            onClick={() => { setDescription(s); setShowSuggestions(false); setErrors({}); }}
                            className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors border-b border-gray-50 last:border-0"
                          >{s}</button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-xs text-gray-500 leading-relaxed bg-blue-50 rounded-lg px-3 py-2.5">
                  This helps us personalise content recommendations for you. Unique descriptions are saved anonymously to help future users.
                </p>

                <div className="flex gap-3 pt-1">
                  <button type="button" disabled={isSubmitting} onClick={() => { setStep(1); setErrors({}); }}
                    className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                    <ArrowLeft size={15} /> Back
                  </button>
                  <button type="button" onClick={handleSubmit} disabled={isSubmitting}
                    className={`flex-1 ${primaryBtnCls} disabled:opacity-60 disabled:cursor-not-allowed`}>
                    {isSubmitting ? 'Creating account…' : 'Submit & Get Started'}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </Layout>
  );
}
