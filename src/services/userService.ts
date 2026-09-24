import { ENDPOINTS, authHeaders, getToken } from '../config/api';
import { toApiError, refreshAccessToken } from './authService';
import type { User } from '../models/user';

interface UserApiBody {
  mail?: string;
  field_fullname?: string;
  field_phone_number?: string;
  field_bio?: string;
}

interface UserApiResponse {
  data: { user: UserApiBody };
}

function toUser(response: UserApiResponse): User {
  const body = response.data.user;
  return {
    fullName: body.field_fullname ?? '',
    email: body.mail ?? '',
    phoneNumber: body.field_phone_number ?? '',
    description: body.field_bio ?? '',
  };
}

// /user/me always 401s without a bearer token; fail fast instead of firing
// a request that can never succeed.
function requireToken(): void {
  if (!getToken()) throw new Error('Not signed in.');
}

export async function getCurrentUser(): Promise<User> {
  requireToken();
  const res = await fetch(ENDPOINTS.me, {
    headers: { Accept: 'application/json', ...authHeaders() },
  });
  if (!res.ok) throw await toApiError(res);
  return toUser(await res.json());
}

// Full name, bio, and phone number are user-editable from the profile page;
// every other field is managed elsewhere.
export async function updateProfile(updates: { fullName: string; bio: string; phoneNumber: string }): Promise<User> {
  requireToken();
  await refreshAccessToken();
  const res = await fetch(ENDPOINTS.me, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...authHeaders() },
    body: JSON.stringify({
      field_fullname: updates.fullName,
      field_bio: updates.bio,
      field_phone_number: updates.phoneNumber,
    }),
  });
  if (!res.ok) throw await toApiError(res);
  return toUser(await res.json());
}
