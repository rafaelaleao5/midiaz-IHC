const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  type: "consumer" | "photographer" | "admin";
  avatar: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  user_type: "consumer" | "photographer" | "admin";
  cpf: string;
  phone: string;
}

export class AuthService {
  private static getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('midiaz_token');
    }
    return null;
  }

  private static setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('midiaz_token', token);
    }
  }

  private static removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('midiaz_token');
    }
  }

  static async login(email: string, password: string): Promise<LoginResponse> {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Erro no login');
    }

    const data = await response.json();
    this.setToken(data.access_token);
    return data;
  }

  static async register(userData: RegisterData): Promise<LoginResponse> {
    const formData = new FormData();
    formData.append('name', userData.name);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    formData.append('user_type', userData.user_type);
    formData.append('cpf', userData.cpf);
    formData.append('phone', userData.phone);

    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Erro no registro');
    }

    const data = await response.json();
    this.setToken(data.access_token);
    return data;
  }

  static async getCurrentUser(): Promise<User | null> {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        this.removeToken();
        return null;
      }

      return await response.json();
    } catch (error) {
      this.removeToken();
      return null;
    }
  }

  static logout(): void {
    this.removeToken();
  }

  static isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  static getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
} 