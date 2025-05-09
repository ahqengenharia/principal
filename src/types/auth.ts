export type UserRole = 'TOTAL' | 'OPERACIONAL' | 'NIVEL_1';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}