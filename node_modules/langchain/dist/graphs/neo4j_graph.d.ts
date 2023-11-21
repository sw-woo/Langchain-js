interface Neo4jGraphConfig {
    url: string;
    username: string;
    password: string;
    database?: string;
}
/**
 * @security *Security note*: Make sure that the database connection uses credentials
 * that are narrowly-scoped to only include necessary permissions.
 * Failure to do so may result in data corruption or loss, since the calling
 * code may attempt commands that would result in deletion, mutation
 * of data if appropriately prompted or reading sensitive data if such
 * data is present in the database.
 * The best way to guard against such negative outcomes is to (as appropriate)
 * limit the permissions granted to the credentials used with this tool.
 * For example, creating read only users for the database is a good way to
 * ensure that the calling code cannot mutate or delete data.
 *
 * @link See https://js.langchain.com/docs/security for more information.
 */
export declare class Neo4jGraph {
    private driver;
    private database;
    private schema;
    constructor({ url, username, password, database, }: Neo4jGraphConfig);
    static initialize(config: Neo4jGraphConfig): Promise<Neo4jGraph>;
    getSchema(): string;
    query(query: string, params?: any): Promise<any[] | undefined>;
    verifyConnectivity(): Promise<void>;
    refreshSchema(): Promise<void>;
    close(): Promise<void>;
}
export {};
