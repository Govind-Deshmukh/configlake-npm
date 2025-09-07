interface ConfigLakeResponse {
    configs: Record<string, string>;
    secrets: Record<string, string>;
}
export declare function getConfig(baseUrl: string, token: string, projectId: number, environment: string): Promise<Record<string, string>>;
export declare function getSecrets(baseUrl: string, token: string, projectId: number, environment: string): Promise<Record<string, string>>;
export declare function getAllDetails(baseUrl: string, token: string, projectId: number, environment: string): Promise<ConfigLakeResponse>;
declare const _default: {
    getConfig: typeof getConfig;
    getSecrets: typeof getSecrets;
    getAllDetails: typeof getAllDetails;
};
export default _default;
//# sourceMappingURL=index.d.ts.map