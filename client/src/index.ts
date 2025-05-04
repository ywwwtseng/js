interface ClientOptions {
  baseUrl?: string;
  headers?: Record<string, string>;
  transformRequest?: (headers: Headers) => Headers;
  onResponse?: (res: Response) => void;
  onError?: <T>(res: Response, data: T) => void;
}

export class Client {
  baseUrl: string;
  headers?: Record<string, string>;
  transformRequest?: (headers: Headers) => Headers;
  onResponse?: (res: Response) => void;
  onError?: <T>(res: Response, data: T) => void;

  constructor({ baseUrl, headers, transformRequest, onResponse, onError }: ClientOptions = {}) {
    this.baseUrl = baseUrl || "";
    this.headers = headers;
    this.transformRequest = transformRequest;
    this.onResponse = onResponse;
    this.onError = onError;
  }

  async request<T>(url: string, options?: RequestInit):  Promise<T> {
    let headers = new Headers({ ...this.headers, ...options?.headers });
    if (!headers.get("Content-Type")) {
      headers.set("Content-Type", "application/json; charset=utf-8");
    }

    if (this.transformRequest) {
      headers = this.transformRequest(headers);
    }

    const res = await fetch(`${this.baseUrl}${url}`, {
      ...options,
      headers,
    });

    if (this.onResponse) {
      this.onResponse(res);
    }

    if (res.status < 200 || res.status >= 300) {
      const data: T = await res.json();
      if (this.onError) {
        this.onError<T>(res, data);
      }
      throw { status: res.status, data };
    } else if (res.headers.get("Content-Type") === "application/octet-stream") {
      const data = await res.blob();
      return data as T;
    } else {
      const data: T = await res.json();
      return data;
    }
  }

  get<T>(url: string, options?: RequestInit): Promise<T> {
    return this.request<T>(url, options);
  }

  post<T, U = unknown>(url: string, body?: U, options?: RequestInit): Promise<T> {
    return this.request<T>(url, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body || {}),
      ...options,
    });
  }

  put<T, U = unknown>(url: string, body?: U, options?: RequestInit): Promise<T> {
    return this.request<T>(url, {
      method: "PUT",
      body: JSON.stringify(body || {}),
      ...options,
    });
  }

  delete<T, U = unknown>(url: string, body?: U, options?: RequestInit): Promise<T> {
    return this.request<T>(url, {
      method: "DELETE",
      body: JSON.stringify(body || {}),
      ...options,
    });
  }
}
