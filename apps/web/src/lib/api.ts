const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface RequestOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  params?: Record<string, string | number | undefined>;
}

class ApiClient {
  private baseUrl: string;
  private accessToken: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('accessToken');
    }
  }

  setToken(token: string | null) {
    this.accessToken = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('accessToken', token);
      } else {
        localStorage.removeItem('accessToken');
      }
    }
  }

  getToken() {
    return this.accessToken;
  }

  private buildUrl(path: string, params?: Record<string, string | number | undefined>): string {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          url.searchParams.append(key, String(value));
        }
      });
    }
    return url.toString();
  }

  private async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {}, params } = options;

    const url = this.buildUrl(path, params);

    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(this.accessToken && { Authorization: `Bearer ${this.accessToken}` }),
        ...headers,
      },
      credentials: 'include',
    };

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(url, config);

    // Handle token refresh
    if (response.status === 401 && this.accessToken) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        // Retry with new token
        config.headers = {
          ...config.headers as Record<string, string>,
          Authorization: `Bearer ${this.accessToken}`,
        };
        const retryResponse = await fetch(url, config);
        return this.handleResponse<T>(retryResponse);
      }
      // Refresh failed, redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
      throw new Error('Session expired');
    }

    return this.handleResponse<T>(response);
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || 'An error occurred',
        errors: data.errors,
      };
    }

    return data;
  }

  private async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        this.setToken(data.data.accessToken);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  // ============================================
  // HTTP Methods
  // ============================================
  get<T>(path: string, params?: Record<string, string | number | undefined>) {
    return this.request<T>(path, { params });
  }

  post<T>(path: string, body?: any) {
    return this.request<T>(path, { method: 'POST', body });
  }

  put<T>(path: string, body?: any) {
    return this.request<T>(path, { method: 'PUT', body });
  }

  patch<T>(path: string, body?: any) {
    return this.request<T>(path, { method: 'PATCH', body });
  }

  delete<T>(path: string) {
    return this.request<T>(path, { method: 'DELETE' });
  }

  // ============================================
  // Upload (multipart)
  // ============================================
  async upload<T>(path: string, formData: FormData): Promise<T> {
    const url = this.buildUrl(path);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...(this.accessToken && { Authorization: `Bearer ${this.accessToken}` }),
      },
      credentials: 'include',
      body: formData,
    });
    return this.handleResponse<T>(response);
  }
}

export const api = new ApiClient(API_URL);
export default api;
