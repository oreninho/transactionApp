import {IDBService} from "./types";
import {ITransaction, TransactionMetadata} from "./model/transactions";

export  class TransactionDB {

    private dbService?:IDBService;


    async initialize(dbService:IDBService): Promise<void> {
        this.dbService = dbService;
        const fields = Object.entries(TransactionMetadata).map(([key, metadata]) => `${key} ${metadata.type} ${metadata.otherData??''}`).join(', ');
        //await this.dbService.execute('DROP TABLE IF EXISTS transactions');//todo remove this line
        const createTableQuery = `CREATE TABLE IF NOT EXISTS transactions (${fields}, PRIMARY KEY (referenceNumber));`
        console.log("createTableQuery",createTableQuery);
        await this.dbService.execute(createTableQuery);

    }

    async addTransaction(transaction: ITransaction): Promise<void> {
        const insertQuery = `
      INSERT INTO transactions (
        accountMask, postedDate, description, details, amount, balance, 
        referenceNumber, currency, type, createdTime, updatedTime
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(referenceNumber) DO UPDATE SET 
    updatedTime = strftime('%Y-%m-%d', 'now')`;
        const now = new Date().toISOString();
        try {
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
        catch(err){
            console.log("insertQuery",insertQuery);
            console.log("err",err);
            throw err;
        }

    }

    async getTransactions(): Promise<ITransaction[]> {
        try {
            const selectQuery = 'SELECT * FROM transactions';
            return await this.dbService!.query<ITransaction[],undefined>(selectQuery);
        }
        catch(err){
            throw err;
        }

    }

}
const transactionDb = new TransactionDB();
export default transactionDb;