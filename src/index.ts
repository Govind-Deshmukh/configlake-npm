/**
 * Config Lake - Node.js Client
 * Simple functions to fetch and decrypt configurations and secrets
 */

import axios from 'axios';

const version = '1.0.0';

function decryptSecret(encryptedValue: string, environmentKey: string): string {
    try {
        // Simple base64 decode for now - works with current encryption
        const decoded = Buffer.from(encryptedValue, 'base64').toString('utf8');
        return decoded;
    } catch (error) {
        throw new Error(`Decryption failed: ${(error as Error).message}`);
    }
}

async function makeRequest(apiUrl: string, token: string, endpoint: string): Promise<any> {
    const url = `${apiUrl.replace(/\/$/, '')}${endpoint}`;
    
    try {
        const response = await axios.get(url, {
            headers: { 'Authorization': `Bearer ${token}` },
            timeout: 30000
        });
        
        return response.data;
        
    } catch (error: any) {
        if (error.response) {
            const status = error.response.status;
            const message = error.response.data || error.message;
            
            switch (status) {
                case 401:
                    throw new Error('Authentication failed - invalid API token');
                case 403:
                    throw new Error('Access forbidden - token not valid for this project');
                case 404:
                    throw new Error('Resource not found - check project ID and environment name');
                default:
                    throw new Error(`API request failed: ${status} ${message}`);
            }
        } else if (error.code === 'ECONNABORTED') {
            throw new Error('Request timeout');
        } else {
            throw new Error(`Request failed: ${error.message}`);
        }
    }
}

/**
 * Get plain-text configurations
 */
export async function getConfig(apiUrl: string, token: string, projectId: number, environment: string): Promise<Record<string, string>> {
    const endpoint = `/api/config/${projectId}/${environment}`;
    const data = await makeRequest(apiUrl, token, endpoint);
    return data.configs || {};
}

/**
 * Get decrypted secrets
 */
export async function getSecrets(apiUrl: string, token: string, projectId: number, environment: string): Promise<Record<string, string>> {
    const endpoint = `/api/secrets/${projectId}/${environment}`;
    const data = await makeRequest(apiUrl, token, endpoint);
    
    const environmentKey = data.environment_key;
    const encryptedSecrets = data.secrets || {};
    
    if (!environmentKey) {
        throw new Error('Environment key not found in API response');
    }
    
    // Decrypt all secrets
    const decryptedSecrets: Record<string, string> = {};
    for (const [key, encryptedValue] of Object.entries(encryptedSecrets)) {
        decryptedSecrets[key] = decryptSecret(encryptedValue as string, environmentKey);
    }
    
    return decryptedSecrets;
}

/**
 * Get both configurations and decrypted secrets
 */
export async function getAllDetails(apiUrl: string, token: string, projectId: number, environment: string): Promise<{
    configs: Record<string, string>;
    secrets: Record<string, string>;
    project_id: number;
    environment: string;
}> {
    const endpoint = `/api/all/${projectId}/${environment}`;
    const data = await makeRequest(apiUrl, token, endpoint);
    
    const configs = data.configs || {};
    const environmentKey = data.environment_key;
    const encryptedSecrets = data.secrets || {};
    
    if (!environmentKey) {
        throw new Error('Environment key not found in API response');
    }
    
    // Decrypt all secrets
    const decryptedSecrets: Record<string, string> = {};
    for (const [key, encryptedValue] of Object.entries(encryptedSecrets)) {
        decryptedSecrets[key] = decryptSecret(encryptedValue as string, environmentKey);
    }
    
    return {
        configs,
        secrets: decryptedSecrets,
        project_id: data.project_id,
        environment: data.environment
    };
}

export { version };