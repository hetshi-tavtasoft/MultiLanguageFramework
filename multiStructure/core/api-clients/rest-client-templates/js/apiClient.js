class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.token = null;
  }

  async login(username, password) {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    this.token = data.token;
    return this.token;
  }

  async request(path, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...(options.headers || {}),
    };

    return fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers,
    });
  }

  async get(path) {
    const response = await this.request(path);
    return response.json();
  }

  async post(path, body) {
    const response = await this.request(path, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return response.json();
  }

  async put(path, body) {
    const response = await this.request(path, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    return response.json();
  }

  async delete(path) {
    const response = await this.request(path, { method: 'DELETE' });
    return response.json();
  }
}

module.exports = { ApiClient };
