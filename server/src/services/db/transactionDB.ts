import {IDBService} from "./types";
import {ITransaction, TransactionMetadata} from "./model/transactions";

export  class TransactionDB {

    private dbService?:IDBService;


    async initialize(dbService:IDBService): Promise<void> {
        this.dbService = dbService;
        const fields = Object.entries(TransactionMetadata).map(([key, metadata]) => `${key} ${metadata.type}`).join(', ');
        const createTableQuery = `CREATE TABLE IF NOT EXISTS transactions (${fields})`;
        await this.dbService.execute(createTableQuery);

    }

    async addTransaction(transaction: ITransaction): Promise<void> {
        const insertQuery = `
      INSERT OR REPLACE INTO transactions (
        accountMask, postedDate, description, details, amount, balance, 
        referenceNumber, currency, type, createdTime, updatedTime
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

        const now = new Date().toISOString();

        await this.dbService!.execute(insertQuery, [
            transaction.accountMask,
            transaction.postedDate,
            transaction.description,
            transaction.details,
            transaction.amount,
            transaction.balance,
            transaction.referenceNumber,
            transaction.currency,
            transaction.type,
            now, // createdTime
            now  // updatedTime
        ]);
    }

    async getTransactions(): Promise<ITransaction[]> {
        const selectQuery = 'SELECT * FROM transactions';
        return await this.dbService!.query<ITransaction[],undefined>(selectQuery);
    }

}
const transactionDb = new TransactionDB();
export default transactionDb;