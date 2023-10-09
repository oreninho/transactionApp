import { Database } from 'sqlite3';
import {IDBService} from "../types";

export default class SQLiteService implements IDBService {
    private db?: Database;

    constructor(private dbPath: string) {}

    async connect(): Promise<void> {
        this.db = new Database(this.dbPath);
    }

    async disconnect(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db!.close((err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }

    async query<T>(queryString: string, params: any[] = []): Promise<T> {
        return new Promise((resolve, reject) => {
            this.db!.all(queryString, params, (err, rows) => {
                if (err) reject(err);
                resolve(rows as unknown as T);
            });
        });
    }

    async execute(queryString: string, params: any[] = []): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db!.run(queryString, params, (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }
}
