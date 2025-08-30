"use strict";
/**
 * Config Lake - Node.js Client
 * Simple functions to fetch and decrypt configurations and secrets
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.version = void 0;
exports.getConfig = getConfig;
exports.getSecrets = getSecrets;
exports.getAllDetails = getAllDetails;
const axios_1 = __importDefault(require("axios"));
const version = '1.0.0';
exports.version = version;
function decryptSecret(encryptedValue, environmentKey) {
    try {
        // Simple base64 decode for now - works with current encryption
        const decoded = Buffer.from(encryptedValue, 'base64').toString('utf8');
        return decoded;
    }
    catch (error) {
        throw new Error(`Decryption failed: ${error.message}`);
    }
}
async function makeRequest(apiUrl, token, endpoint) {
    const url = `${apiUrl.replace(/\/$/, '')}${endpoint}`;
    try {
        const response = await axios_1.default.get(url, {
            headers: { 'Authorization': `Bearer ${token}` },
            timeout: 30000
        });
        return response.data;
    }
    catch (error) {
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
        }
        else if (error.code === 'ECONNABORTED') {
            throw new Error('Request timeout');
        }
        else {
            throw new Error(`Request failed: ${error.message}`);
        }
    }
}
/**
 * Get plain-text configurations
 */
async function getConfig(apiUrl, token, projectId, environment) {
    const endpoint = `/api/config/${projectId}/${environment}`;
    const data = await makeRequest(apiUrl, token, endpoint);
    return data.configs || {};
}
/**
 * Get decrypted secrets
 */
async function getSecrets(apiUrl, token, projectId, environment) {
    const endpoint = `/api/secrets/${projectId}/${environment}`;
    const data = await makeRequest(apiUrl, token, endpoint);
    const environmentKey = data.environment_key;
    const encryptedSecrets = data.secrets || {};
    if (!environmentKey) {
        throw new Error('Environment key not found in API response');
    }
    // Decrypt all secrets
    const decryptedSecrets = {};
    for (const [key, encryptedValue] of Object.entries(encryptedSecrets)) {
        decryptedSecrets[key] = decryptSecret(encryptedValue, environmentKey);
    }
    return decryptedSecrets;
}
/**
 * Get both configurations and decrypted secrets
 */
async function getAllDetails(apiUrl, token, projectId, environment) {
    const endpoint = `/api/all/${projectId}/${environment}`;
    const data = await makeRequest(apiUrl, token, endpoint);
    const configs = data.configs || {};
    const environmentKey = data.environment_key;
    const encryptedSecrets = data.secrets || {};
    if (!environmentKey) {
        throw new Error('Environment key not found in API response');
    }
    // Decrypt all secrets
    const decryptedSecrets = {};
    for (const [key, encryptedValue] of Object.entries(encryptedSecrets)) {
        decryptedSecrets[key] = decryptSecret(encryptedValue, environmentKey);
    }
    return {
        configs,
        secrets: decryptedSecrets,
        project_id: data.project_id,
        environment: data.environment
    };
}
//# sourceMappingURL=index.js.map