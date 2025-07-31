import { User } from "@shared/schema";

export interface AuthUser extends Omit<User, 'password'> {}

export class AuthService {
  private static instance: AuthService;
  private currentUser: AuthUser | null = null;

  private constructor() {
    // Check localStorage for existing session
    const savedUser = localStorage.getItem('bloodconnect_user');
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
      } catch {
        localStorage.removeItem('bloodconnect_user');
      }
    }
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(email: string, password: string): Promise<AuthUser> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const { user } = await response.json();
    this.currentUser = user;
    localStorage.setItem('bloodconnect_user', JSON.stringify(user));
    return user;
  }

  async register(userData: {
    email: string;
    password: string;
    role: 'patient' | 'donor' | 'healthcare_provider';
    name: string;
    phone?: string;
    location?: string;
    bloodGroup?: string;
  }): Promise<AuthUser> {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const { user } = await response.json();
    this.currentUser = user;
    localStorage.setItem('bloodconnect_user', JSON.stringify(user));
    return user;
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('bloodconnect_user');
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  hasRole(role: string): boolean {
    return this.currentUser?.role === role;
  }
}

export const authService = AuthService.getInstance();
