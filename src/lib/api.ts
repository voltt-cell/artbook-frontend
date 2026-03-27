const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';

type RequestOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    headers?: Record<string, string>;
    body?: unknown;
};

export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    // Guard: don't make API calls during SSR
    if (typeof window === 'undefined') {
        return {} as T;
    }

    const { method = 'GET', headers = {}, body } = options;

    const config: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        credentials: 'include', // sends JWT cookie automatically
        cache: 'no-store', // Disable Next.js / Browser caching for dynamic API responses
        body: body ? JSON.stringify(body) : undefined,
    };

    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error((errorData as Record<string, string>).error || `API Error: ${response.statusText}`);
    }

    return response.json();
}

export const api = {
    get: <T>(endpoint: string) => apiRequest<T>(endpoint),
    post: <T>(endpoint: string, body: unknown) => apiRequest<T>(endpoint, { method: 'POST', body }),
    put: <T>(endpoint: string, body: unknown) => apiRequest<T>(endpoint, { method: 'PUT', body }),
    patch: <T>(endpoint: string, body: unknown) => apiRequest<T>(endpoint, { method: 'PATCH', body }),
    delete: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'DELETE' }),
};
