import { useState } from 'react';
import { User as UserIcon, Mail, Phone, FileText, Pencil, X } from 'lucide-react';
import { Layout } from '../components/Layout';
import { useAuth } from '../context/AuthContext';

// Country code (entered inside the braces, e.g. "+1") and local number
// (always exactly 10 digits) are captured as separate fields.
const DEFAULT_COUNTRY_CODE = '+91';
const COUNTRY_CODE_RE = /^\+\d{1,3}$/;
const PHONE_LOCAL_LENGTH = 10;
const PHONE_RE = new RegExp(`^\\d{${PHONE_LOCAL_LENGTH}}$`);
const BIO_MAX_LENGTH = 250;

// Keeps only digits, capped at 3, always prefixed with "+" once non-empty.
function sanitizeCountryCode(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 3);
  return digits ? `+${digits}` : '';
}

// Splits a raw stored number (e.g. "12025551234") into country code + local
// number; legacy numbers with no stored country code fall back to the default.
function splitStoredPhone(raw: string): { countryCode: string; phone: string } {
  const digits = raw.replace(/\D/g, '');
  const local = digits.slice(-PHONE_LOCAL_LENGTH);
  const codeDigits = digits.slice(0, digits.length - PHONE_LOCAL_LENGTH);
  return { countryCode: codeDigits ? `+${codeDigits}` : DEFAULT_COUNTRY_CODE, phone: local };
}

// Formats a raw stored number for read-only display, e.g. "12025551234" -> "+1 2025551234".
function formatStoredPhone(raw: string): string {
  if (!raw.trim()) return '';
  const { countryCode, phone } = splitStoredPhone(raw);
  return `${countryCode} ${phone}`;
}

const inputCls = (error?: string) =>
  `w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
    error ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400'
  }`;

function ReadField({ label, icon: Icon, value }: {
  label: string; icon: React.ElementType; value: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 mb-1 tracking-wide uppercase">{label}</p>
      <div className="flex items-center gap-2.5">
        <Icon size={15} className="text-gray-400 flex-shrink-0" />
        <p className="text-sm text-gray-900">{value || <span className="text-gray-400 italic">Not provided</span>}</p>
      </div>
    </div>
  );
}

export function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [countryCode, setCountryCode] = useState(DEFAULT_COUNTRY_CODE);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [countryCodeError, setCountryCodeError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [saving, setSaving] = useState(false);

  if (!user) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <p className="text-gray-500">Please sign in to view your profile.</p>
        </div>
      </Layout>
    );
  }

  const initials = user.fullName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleEdit = () => {
    setBio(user.description ?? '');
    const split = splitStoredPhone(user.phoneNumber ?? '');
    setCountryCode(split.countryCode);
    setPhone(split.phone);
    setError('');
    setCountryCodeError('');
    setPhoneError('');
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setError('');
    setCountryCodeError('');
    setPhoneError('');
  };

  const handleUpdate = async () => {
    const trimmedCode = countryCode.trim();
    const trimmedPhone = phone.trim();
    let hasError = false;
    if (!trimmedCode) { setCountryCodeError('Required'); hasError = true; }
    else if (!COUNTRY_CODE_RE.test(trimmedCode)) { setCountryCodeError('Invalid'); hasError = true; }
    else setCountryCodeError('');
    if (!trimmedPhone) { setPhoneError('Mobile number is required'); hasError = true; }
    else if (!PHONE_RE.test(trimmedPhone)) { setPhoneError('Enter a valid 10-digit mobile number'); hasError = true; }
    else setPhoneError('');
    if (hasError) return;

    setSaving(true);
    setError('');
    try {
      await updateProfile({ bio: bio.trim(), phoneNumber: `${trimmedCode.replace(/\D/g, '')}${trimmedPhone}` });
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto py-10">

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Header strip */}
          <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

          <div className="px-8 py-6">

            {/* Top row: avatar + name + edit button */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {initials}
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">{user.fullName}</h1>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>

              {!editing && (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Pencil size={14} /> Edit
                </button>
              )}
            </div>

            <div className="border-t border-gray-100 pt-6">
              <div className="space-y-5">
                {/* Full name and email are managed server-side and are always read-only here. */}
                <ReadField label="Full Name" icon={UserIcon} value={user.fullName} />
                <ReadField label="Email ID" icon={Mail} value={user.email} />

                {!editing ? (
                  <ReadField label="Mobile Number" icon={Phone} value={formatStoredPhone(user.phoneNumber)} />
                ) : (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-1.5 tracking-wide uppercase">Mobile Number</p>
                    <div className="flex gap-2">
                      <div className={`flex items-center border rounded-lg transition-colors ${
                        countryCodeError ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}>
                        <span className="pl-2.5 text-gray-400 text-sm select-none">(</span>
                        <input
                          type="text" inputMode="tel" value={countryCode}
                          onChange={e => setCountryCode(sanitizeCountryCode(e.target.value))}
                          placeholder={DEFAULT_COUNTRY_CODE} maxLength={4}
                          className="w-12 py-2.5 text-sm text-gray-900 text-center bg-transparent focus:outline-none"
                        />
                        <span className="pr-2.5 text-gray-400 text-sm select-none">)</span>
                      </div>
                      <div className="relative flex-1">
                        <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input
                          type="tel" inputMode="numeric" value={phone}
                          onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, PHONE_LOCAL_LENGTH))}
                          placeholder="2025551234" maxLength={PHONE_LOCAL_LENGTH} autoComplete="tel"
                          className={inputCls(phoneError)}
                        />
                      </div>
                    </div>
                    {(countryCodeError || phoneError) && (
                      <p className="mt-1 text-xs text-red-500">{countryCodeError ? `Country code: ${countryCodeError}` : phoneError}</p>
                    )}
                  </div>
                )}

                {!editing ? (
                  <ReadField label="About You" icon={FileText} value={user.description ?? ''} />
                ) : (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-1.5 tracking-wide uppercase">About You</p>
                    <div className="relative">
                      <FileText size={15} className="absolute left-3 top-3.5 text-gray-400 pointer-events-none" />
                      <textarea
                        value={bio} onChange={e => setBio(e.target.value)}
                        placeholder='e.g. "BTech CS graduate with 3.5 years experience and IELTS 7"'
                        rows={3} maxLength={BIO_MAX_LENGTH}
                        className={`${inputCls(error)} resize-none`}
                      />
                    </div>
                    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                      <button
                        type="button" onClick={handleCancel}
                        className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <X size={15} /> Cancel
                      </button>
                      <button
                        type="button" onClick={handleUpdate} disabled={saving}
                        className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 hover:shadow-md hover:shadow-blue-200 transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {saving ? 'Updating…' : 'Update'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}
