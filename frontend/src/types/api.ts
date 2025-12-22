/** API types */
export interface ApiError {
  detail: string;
  type?: string;
}

export class ApiException extends Error {
  constructor(
    public detail: string,
    public type?: string,
  ) {
    super(detail);
    this.name = 'ApiException';
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Network error occurred') {
    super(message);
    this.name = 'NetworkError';
  }
}

