export class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async login(username: string, password: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    this.token = data.token;
    return this.token;
  }

  private async request(path: string, options: RequestInit = {}): Promise<Response> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...(options.headers as Record<string, string> || {}),
    };

    return fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers,
    });
  }

  async get(path: string): Promise<any> {
    const response = await this.request(path);
    return response.json();
  }

  async post(path: string, body: any): Promise<any> {
    const response = await this.request(path, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return response.json();
  }

  async put(path: string, body: any): Promise<any> {
    const response = await this.request(path, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    return response.json();
  }

  async delete(path: string): Promise<any> {
    const response = await this.request(path, { method: 'DELETE' });
    return response.json();
  }
}
