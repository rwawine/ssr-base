import { ApiResponse } from "../types";

interface FetcherOptions extends RequestInit {
  timeout?: number;
}

class FetcherError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string,
    public data?: unknown,
  ) {
    super(message);
    this.name = "FetcherError";
  }
}

async function fetcher<T>(
  url: string,
  options: FetcherOptions = {},
): Promise<T> {
  const { timeout = 10000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorData: unknown;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }

      throw new FetcherError(
        `HTTP error! status: ${response.status}`,
        response.status,
        response.statusText,
        errorData,
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof FetcherError) {
      throw error;
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw new FetcherError("Request timeout", 408, "Request Timeout");
    }

    throw new FetcherError(
      error instanceof Error ? error.message : "Unknown error",
      500,
      "Internal Server Error",
    );
  }
}

// Специализированные методы
export const api = {
  get: <T>(url: string, options?: FetcherOptions) =>
    fetcher<T>(url, { ...options, method: "GET" }),

  post: <T>(url: string, data?: unknown, options?: FetcherOptions) =>
    fetcher<T>(url, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(url: string, data?: unknown, options?: FetcherOptions) =>
    fetcher<T>(url, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(url: string, options?: FetcherOptions) =>
    fetcher<T>(url, { ...options, method: "DELETE" }),
};

export { fetcher, FetcherError };
