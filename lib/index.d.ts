/**
 * Config Lake - Node.js Client
 * Simple functions to fetch and decrypt configurations and secrets
 */
declare const version = "1.0.0";
/**
 * Get plain-text configurations
 */
export declare function getConfig(apiUrl: string, token: string, projectId: number, environment: string): Promise<Record<string, string>>;
/**
 * Get decrypted secrets
 */
export declare function getSecrets(apiUrl: string, token: string, projectId: number, environment: string): Promise<Record<string, string>>;
/**
 * Get both configurations and decrypted secrets
 */
export declare function getAllDetails(apiUrl: string, token: string, projectId: number, environment: string): Promise<{
    configs: Record<string, string>;
    secrets: Record<string, string>;
    project_id: number;
    environment: string;
}>;
export { version };
//# sourceMappingURL=index.d.ts.map