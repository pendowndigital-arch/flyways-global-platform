import type { User } from '../models/user';

function loadUsers(): User[] {
  try { return JSON.parse(localStorage.getItem('flyways_users') ?? ''); } catch {}
  return [];
}

export async function updateProfile(updated: User): Promise<User> {
  const users = loadUsers();
  const idx = users.findIndex(u => u.email.toLowerCase() === updated.email.toLowerCase());
  if (idx >= 0) users[idx] = updated; else users.push(updated);
  localStorage.setItem('flyways_users', JSON.stringify(users));
  return Promise.resolve(updated);
}
