import { useState, useEffect, useRef } from 'react';
import { X, User as UserIcon, Mail, Phone, Lock, ChevronRight, Check, Sparkles, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { AuthModalMode } from '../context/AuthContext';
import type { User } from '../models/user';

// ── Constants ────────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s\-(). ]{7,20}$/;

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

function loadUsers(): User[] {
  try { return JSON.parse(localStorage.getItem('flyways_users') ?? ''); } catch {}
  return [];
}

function saveUser(user: User) {
  const users = loadUsers();
  const idx = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
  if (idx >= 0) users[idx] = user; else users.push(user);
  localStorage.setItem('flyways_users', JSON.stringify(users));
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

interface AuthModalProps {
  defaultMode: AuthModalMode;
  onClose: () => void;
}

export function AuthModal({ defaultMode, onClose }: AuthModalProps) {
  const { signIn } = useAuth();
  const [mode, setMode] = useState<AuthModalMode>(defaultMode);
  const [step, setStep] = useState(1);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [description, setDescription] = useState('');
  const [siEmail, setSiEmail] = useState('');
  const [siPassword, setSiPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  // Close suggestions on outside click + close modal on Escape
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!descRef.current?.contains(t) && !suggestionsRef.current?.contains(t))
        setShowSuggestions(false);
    };
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const switchMode = (m: AuthModalMode) => { setMode(m); setStep(1); setErrors({}); };

  const handleSignIn = () => {
    const errs: Record<string, string> = {};
    if (!siEmail.trim()) errs.siEmail = 'Email is required';
    else if (!EMAIL_RE.test(siEmail)) errs.siEmail = 'Enter a valid email address';
    if (!siPassword) errs.siPassword = 'Password is required';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const found = loadUsers().find(u => u.email.toLowerCase() === siEmail.trim().toLowerCase());
    if (!found) { setErrors({ siEmail: 'No account found with this email. Please sign up.' }); return; }
    if (found.password !== siPassword) { setErrors({ siPassword: 'Incorrect password.' }); return; }
    signIn(found);
    onClose();
  };

  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!email.trim()) errs.email = 'Email is required';
    else if (!EMAIL_RE.test(email)) errs.email = 'Enter a valid email address';
    if (!phone.trim()) errs.phone = 'Mobile number is required';
    else if (!PHONE_RE.test(phone)) errs.phone = 'Enter a valid phone number';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (!confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!consent) errs.consent = 'You must agree to the privacy policy to continue';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProceed = () => { if (validateStep1()) { setErrors({}); setStep(2); } };

  const handleSubmit = () => {
    if (!description.trim()) { setErrors({ description: 'Please describe yourself to continue' }); return; }
    const trimmed = description.trim();
    if (!loadStatements().includes(trimmed)) saveStatement(trimmed);
    const user = { fullName: name.trim(), email: email.trim(), phoneNumber: phone.trim(), password, description: trimmed };
    saveUser(user);
    signIn(user);
    onClose();
  };

  const isSignup = mode === 'signup';
  const title = isSignup
    ? (step === 1 ? 'Create Your Account' : 'Tell us about yourself')
    : 'Sign in to Flyways Global';
  const subtitle = isSignup
    ? (step === 1 ? 'Join thousands navigating global mobility.' : 'Help us personalise your experience.')
    : 'Access exclusive content on study, work, and residence abroad.';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div role="dialog" aria-modal="true" aria-labelledby="auth-modal-title"
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

        <div className="px-8 pt-7 pb-5 relative">
          <button onClick={onClose} aria-label="Close"
            className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
          <h2 id="auth-modal-title" className="text-xl font-bold text-gray-900 mb-1">{title}</h2>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>

        <div className="px-8 pb-8">

          {/* Sign In */}
          {mode === 'signin' && (
            <div className="space-y-4">
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
                  className={inputCls(errors.siPassword)}
                />
              </Field>
              <button onClick={handleSignIn} className={`w-full ${primaryBtnCls}`}>Sign In</button>
              <p className="text-center text-sm text-gray-400">
                Don't have an account?{' '}
                <button onClick={() => switchMode('signup')} className="text-blue-600 hover:underline font-medium">Sign Up</button>
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
                  placeholder="e.g. Arjun Sharma" autoComplete="name" className={inputCls(errors.name)} />
              </Field>
              <Field id="su-email" label="Email ID" icon={Mail} error={errors.email}>
                <input id="su-email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleProceed()}
                  placeholder="you@example.com" autoComplete="email" className={inputCls(errors.email)} />
              </Field>
              <Field id="su-phone" label="Mobile Number" icon={Phone} error={errors.phone}>
                <input id="su-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleProceed()}
                  placeholder="+91 98765 43210" autoComplete="tel" className={inputCls(errors.phone)} />
              </Field>
              <Field id="su-password" label="Password" icon={Lock} error={errors.password}>
                <input id="su-password" type="password" value={password} onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleProceed()}
                  placeholder="Min. 8 characters" autoComplete="new-password" className={inputCls(errors.password)} />
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
                    <a href="#" className="text-blue-600 hover:underline font-medium">Privacy Policy</a>
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
                <button onClick={() => switchMode('signin')} className="text-blue-600 hover:underline font-medium">Sign In</button>
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
                <button type="button" onClick={() => { setStep(1); setErrors({}); }}
                  className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                  <ArrowLeft size={15} /> Back
                </button>
                <button type="button" onClick={handleSubmit} className={`flex-1 ${primaryBtnCls}`}>
                  Submit &amp; Get Started
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
