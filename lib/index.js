"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = getConfig;
exports.getSecrets = getSecrets;
exports.getAllDetails = getAllDetails;
async function makeRequest(url, token) {
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
async function getConfig(baseUrl, token, projectId, environment) {
    const url = `${baseUrl.replace(/\/$/, '')}/api/config/${projectId}/${environment}`;
    const response = await makeRequest(url, token);
    return response.configs || {};
}
async function getSecrets(baseUrl, token, projectId, environment) {
    const url = `${baseUrl.replace(/\/$/, '')}/api/secrets/${projectId}/${environment}`;
    const response = await makeRequest(url, token);
    return response.secrets || {};
}
async function getAllDetails(baseUrl, token, projectId, environment) {
    const url = `${baseUrl.replace(/\/$/, '')}/api/all/${projectId}/${environment}`;
    const response = await makeRequest(url, token);
    return {
        configs: response.configs || {},
        secrets: response.secrets || {}
    };
}
exports.default = {
    getConfig,
    getSecrets,
    getAllDetails
};
//# sourceMappingURL=index.js.map