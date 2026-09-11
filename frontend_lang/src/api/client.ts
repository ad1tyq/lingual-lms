export class ApiError extends Error {
  status: number;
  error?: string;

  constructor(message: string, status: number, error?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.error = error;
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...customConfig } = options;

  let url = endpoint;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const token = localStorage.getItem('token');

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...customConfig,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorData: any = {};
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText || 'An error occurred' };
    }

    const message = errorData.message || 'Request failed';

    if (response.status === 401) {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    } else if (response.status === 403 && (errorData.error === 'Subscription Required' || message.includes('Subscription'))) {
      window.dispatchEvent(new CustomEvent('auth:subscription-required', { detail: { message } }));
    }

    throw new ApiError(message, response.status, errorData.error);
  }

  // Handle 204 No Content or empty bodies
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
