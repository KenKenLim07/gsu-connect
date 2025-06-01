export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

export interface AuthResponse {
  user: User;
  token: string;
} 