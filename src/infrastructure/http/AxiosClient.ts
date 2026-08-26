import axios, { type AxiosInstance } from 'axios';

export class AxiosClient {
  constructor(private readonly client: AxiosInstance = axios) {}

  async get<T>(
    url: string,
    config?: {
      params?: Record<string, unknown>;
      headers?: Record<string, string>;
    },
  ) {
    return this.client.get<T>(url, config);
  }
}