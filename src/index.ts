import { request } from 'https';
import { request as httpRequest } from 'http';
import { URL } from 'url';

interface ConfigLakeResponse {
  configs: Record<string, string>;
  secrets: Record<string, string>;
}

interface ConfigLakeError extends Error {
  statusCode?: number;
  details?: string;
}

class ConfigLakeClient {
  private makeRequest(url: string, token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const isHttps = urlObj.protocol === 'https:';
      const requestModule = isHttps ? request : httpRequest;

      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname + urlObj.search,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'configlake-npm/1.0.2'
        }
      };

      const req = requestModule(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
              const result = JSON.parse(data);
              resolve(result);
            } else {
              const error: ConfigLakeError = new Error(`Request failed with status ${res.statusCode}`);
              error.statusCode = res.statusCode;
              error.details = data;
              reject(error);
            }
          } catch (parseError) {
            const error: ConfigLakeError = new Error('Failed to parse response');
            error.details = data;
            reject(error);
          }
        });
      });

      req.on('error', (error) => {
        const configError: ConfigLakeError = new Error(`Network error: ${error.message}`);
        reject(configError);
      });

      req.setTimeout(10000, () => {
        req.destroy();
        const error: ConfigLakeError = new Error('Request timeout');
        reject(error);
      });

      req.end();
    });
  }

  private validateInputs(baseUrl: string, token: string, projectId: number, environment: string): void {
    if (!baseUrl || typeof baseUrl !== 'string') {
      throw new Error('Base URL is required and must be a string');
    }
    
    if (!token || typeof token !== 'string') {
      throw new Error('API token is required and must be a string');
    }
    
    if (!projectId || typeof projectId !== 'number' || projectId <= 0) {
      throw new Error('Project ID is required and must be a positive number');
    }
    
    if (!environment || typeof environment !== 'string') {
      throw new Error('Environment is required and must be a string');
    }
  }

  async getConfig(baseUrl: string, token: string, projectId: number, environment: string): Promise<Record<string, string>> {
    try {
      this.validateInputs(baseUrl, token, projectId, environment);
      
      const url = `${baseUrl.replace(/\/$/, '')}/api/projects/${projectId}/environments/${environment}/configs`;
      const response = await this.makeRequest(url, token);
      
      return response.configs || {};
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch configs: ${error.message}`);
      }
      throw new Error('Failed to fetch configs: Unknown error');
    }
  }

  async getSecrets(baseUrl: string, token: string, projectId: number, environment: string): Promise<Record<string, string>> {
    try {
      this.validateInputs(baseUrl, token, projectId, environment);
      
      const url = `${baseUrl.replace(/\/$/, '')}/api/projects/${projectId}/environments/${environment}/secrets`;
      const response = await this.makeRequest(url, token);
      
      return response.secrets || {};
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch secrets: ${error.message}`);
      }
      throw new Error('Failed to fetch secrets: Unknown error');
    }
  }

  async getAllDetails(baseUrl: string, token: string, projectId: number, environment: string): Promise<ConfigLakeResponse> {
    try {
      this.validateInputs(baseUrl, token, projectId, environment);
      
      const url = `${baseUrl.replace(/\/$/, '')}/api/all/${projectId}/${environment}`;
      const response = await this.makeRequest(url, token);
      
      return {
        configs: response.configs || {},
        secrets: response.secrets || {}
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch all details: ${error.message}`);
      }
      throw new Error('Failed to fetch all details: Unknown error');
    }
  }
}

const client = new ConfigLakeClient();

export const getConfig = client.getConfig.bind(client);
export const getSecrets = client.getSecrets.bind(client);
export const getAllDetails = client.getAllDetails.bind(client);

export default {
  getConfig,
  getSecrets,
  getAllDetails
};