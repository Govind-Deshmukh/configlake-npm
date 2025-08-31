interface ConfigLakeResponse {
    configs: Record<string, string>;
    secrets: Record<string, string>;
}
export declare const getConfig: (baseUrl: string, token: string, projectId: number, environment: string) => Promise<Record<string, string>>;
export declare const getSecrets: (baseUrl: string, token: string, projectId: number, environment: string) => Promise<Record<string, string>>;
export declare const getAllDetails: (baseUrl: string, token: string, projectId: number, environment: string) => Promise<ConfigLakeResponse>;
declare const _default: {
    getConfig: (baseUrl: string, token: string, projectId: number, environment: string) => Promise<Record<string, string>>;
    getSecrets: (baseUrl: string, token: string, projectId: number, environment: string) => Promise<Record<string, string>>;
    getAllDetails: (baseUrl: string, token: string, projectId: number, environment: string) => Promise<ConfigLakeResponse>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map