export interface User {
  fullName: string;
  email: string;
  phoneNumber: string;
  // Real auth is server-side; nothing client-side needs
  // to hold the password once login goes through the API.
  password?: string;
  description?: string;
}
