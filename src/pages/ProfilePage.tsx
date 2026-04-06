import { useState } from 'react';
import { User as UserIcon, Mail, Phone, FileText, Pencil, X } from 'lucide-react';
import { Layout } from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import type { User } from '../models/user';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s\-(). ]{7,20}$/;

const inputCls = (error?: string) =>
  `w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
    error ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400'
  }`;

function Field({ label, icon: Icon, error, children }: {
  label: string; icon: React.ElementType; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 mb-1.5 tracking-wide uppercase">{label}</p>
      <div className="relative">
        <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        {children}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

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
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Omit<User, 'password'>>({ fullName: '', email: '', phoneNumber: '', description: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
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
    setForm({
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      description: user.description ?? '',
    });
    setErrors({});
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setErrors({});
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!EMAIL_RE.test(form.email)) errs.email = 'Enter a valid email address';
    if (!form.phoneNumber.trim()) errs.phoneNumber = 'Mobile number is required';
    else if (!PHONE_RE.test(form.phoneNumber)) errs.phoneNumber = 'Enter a valid phone number';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleUpdate = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await updateUser({ ...user, ...form });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

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

              {/* Read view */}
              {!editing && (
                <div className="space-y-5">
                  <ReadField label="Full Name" icon={UserIcon} value={user.fullName} />
                  <ReadField label="Email ID" icon={Mail} value={user.email} />
                  <ReadField label="Mobile Number" icon={Phone} value={user.phoneNumber} />
                  <ReadField label="About You" icon={FileText} value={user.description ?? ''} />
                </div>
              )}

              {/* Edit view */}
              {editing && (
                <div className="space-y-4">
                  <Field label="Full Name" icon={UserIcon} error={errors.fullName}>
                    <input
                      type="text" value={form.fullName} onChange={set('fullName')}
                      placeholder="e.g. Arjun Sharma" autoComplete="name"
                      className={inputCls(errors.fullName)}
                    />
                  </Field>

                  <Field label="Email ID" icon={Mail} error={errors.email}>
                    <input
                      type="email" value={form.email} onChange={set('email')}
                      placeholder="you@example.com" autoComplete="email"
                      className={inputCls(errors.email)}
                    />
                  </Field>

                  <Field label="Mobile Number" icon={Phone} error={errors.phoneNumber}>
                    <input
                      type="tel" value={form.phoneNumber} onChange={set('phoneNumber')}
                      placeholder="+91 98765 43210" autoComplete="tel"
                      className={inputCls(errors.phoneNumber)}
                    />
                  </Field>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-1.5 tracking-wide uppercase">About You</p>
                    <div className="relative">
                      <FileText size={15} className="absolute left-3 top-3.5 text-gray-400 pointer-events-none" />
                      <textarea
                        value={form.description} onChange={set('description')}
                        placeholder='e.g. "BTech CS graduate with 3.5 years experience and IELTS 7"'
                        rows={3}
                        className={`${inputCls(errors.description)} resize-none`}
                      />
                    </div>
                    {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
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
    </Layout>
  );
}
