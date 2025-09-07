interface ConfigLakeResponse {
  configs: Record<string, string>;
  secrets: Record<string, string>;
}

async function makeRequest(url: string, token: string): Promise<any> {
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function getConfig(baseUrl: string, token: string, projectId: number, environment: string): Promise<Record<string, string>> {
  const url = `${baseUrl.replace(/\/$/, '')}/api/config/${projectId}/${environment}`;
  const response = await makeRequest(url, token);
  return response.configs || {};
}

export async function getSecrets(baseUrl: string, token: string, projectId: number, environment: string): Promise<Record<string, string>> {
  const url = `${baseUrl.replace(/\/$/, '')}/api/secrets/${projectId}/${environment}`;
  const response = await makeRequest(url, token);
  return response.secrets || {};
}

export async function getAllDetails(baseUrl: string, token: string, projectId: number, environment: string): Promise<ConfigLakeResponse> {
  const url = `${baseUrl.replace(/\/$/, '')}/api/all/${projectId}/${environment}`;
  const response = await makeRequest(url, token);
  return {
    configs: response.configs || {},
    secrets: response.secrets || {}
  };
}

export default {
  getConfig,
  getSecrets,
  getAllDetails
};