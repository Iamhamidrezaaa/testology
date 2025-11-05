export type IntegrationType = 'WEBHOOK' | 'API' | 'OAUTH';
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface Integration {
  id: string;
  name: string;
  type: IntegrationType;
  description?: string;
  config: {
    url: string;
    method: HttpMethod;
    headers: Record<string, string>;
    auth: {
      type: 'basic' | 'bearer' | 'api-key';
      username?: string;
      password?: string;
      token?: string;
      apiKey?: string;
    };
    events: string[];
    isActive: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IntegrationTestResult {
  success: boolean;
  message: string;
  responseTime?: number;
  statusCode?: number;
  error?: string;
}