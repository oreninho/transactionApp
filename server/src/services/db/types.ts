export interface IDBService {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    query<T,R>(queryString: string, params?: R[]): Promise<T>;
    execute<T>(queryString: string, params?: T[]): Promise<void>;

}

