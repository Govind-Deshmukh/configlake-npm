"use strict";
// Browser-compatible HTTP client implementation
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDetails = exports.getSecrets = exports.getConfig = void 0;
class ConfigLakeClient {
    makeRequest(url, token) {
        return new Promise((resolve, reject) => {
            // Use fetch API for browser compatibility
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'User-Agent': 'configlake-npm/1.0.3'
                },
                signal: controller.signal
            })
                .then(async (response) => {
                clearTimeout(timeoutId);
                const data = await response.text();
                if (response.ok) {
                    try {
                        const result = JSON.parse(data);
                        resolve(result);
                    }
                    catch (parseError) {
                        const error = new Error('Failed to parse response');
                        error.details = data;
                        reject(error);
                    }
                }
                else {
                    const error = new Error(`Request failed with status ${response.status}`);
                    error.statusCode = response.status;
                    error.details = data;
                    reject(error);
                }
            })
                .catch((fetchError) => {
                clearTimeout(timeoutId);
                if (fetchError.name === 'AbortError') {
                    const error = new Error('Request timeout');
                    reject(error);
                }
                else {
                    const error = new Error(`Network error: ${fetchError.message}`);
                    reject(error);
                }
            });
        });
    }
    validateInputs(baseUrl, token, projectId, environment) {
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
    async getConfig(baseUrl, token, projectId, environment) {
        try {
            this.validateInputs(baseUrl, token, projectId, environment);
            const url = `${baseUrl.replace(/\/$/, '')}/api/projects/${projectId}/environments/${environment}/configs`;
            const response = await this.makeRequest(url, token);
            return response.configs || {};
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to fetch configs: ${error.message}`);
            }
            throw new Error('Failed to fetch configs: Unknown error');
        }
    }
    async getSecrets(baseUrl, token, projectId, environment) {
        try {
            this.validateInputs(baseUrl, token, projectId, environment);
            const url = `${baseUrl.replace(/\/$/, '')}/api/projects/${projectId}/environments/${environment}/secrets`;
            const response = await this.makeRequest(url, token);
            return response.secrets || {};
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to fetch secrets: ${error.message}`);
            }
            throw new Error('Failed to fetch secrets: Unknown error');
        }
    }
    async getAllDetails(baseUrl, token, projectId, environment) {
        try {
            this.validateInputs(baseUrl, token, projectId, environment);
            const url = `${baseUrl.replace(/\/$/, '')}/api/all/${projectId}/${environment}`;
            const response = await this.makeRequest(url, token);
            return {
                configs: response.configs || {},
                secrets: response.secrets || {}
            };
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to fetch all details: ${error.message}`);
            }
            throw new Error('Failed to fetch all details: Unknown error');
        }
    }
}
const client = new ConfigLakeClient();
exports.getConfig = client.getConfig.bind(client);
exports.getSecrets = client.getSecrets.bind(client);
exports.getAllDetails = client.getAllDetails.bind(client);
exports.default = {
    getConfig: exports.getConfig,
    getSecrets: exports.getSecrets,
    getAllDetails: exports.getAllDetails
};
//# sourceMappingURL=index.js.map