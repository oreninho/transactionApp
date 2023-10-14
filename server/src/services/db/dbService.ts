import {IDBService} from "./types";

class DbService implements IDBService {
    private _dbService?: IDBService;

    init(dbService: IDBService) {
        this._dbService = dbService;
    }

    connect(): Promise<void> {
        return this._dbService!.connect();
    }

    disconnect(): Promise<void> {
        return this._dbService!.disconnect();
    }

    query<T>(queryString: string, params: any[] = []): Promise<T> {
        return this._dbService!.query(queryString, params);
    }

    execute(queryString: string, params: any[] = []): Promise<void> {
        return this._dbService!.execute(queryString, params);
    }
}
const dbService = new DbService();
export default dbService;