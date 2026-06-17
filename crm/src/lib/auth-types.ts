export type AuthState = {
  user: { id: string; email: string; name: string; role: string } | null;
  loading: boolean;
};
