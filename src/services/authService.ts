import type { LoginCredentials, User } from '../types/auth';

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.email === "admin@gsu.edu" && credentials.password === "admin") {
          resolve({
            id: "1",
            name: "Admin",
            email: credentials.email,
            role: "admin"
          });
        } else {
          reject(new Error("Invalid credentials"));
        }
      }, 1000);
    });
  },

  async logout(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}; 