import {IDBService} from "./types";
import {ITransaction, TransactionMetadata} from "./model/transactions";
import logger from "../logger/logger";

//Can add more methods to this class, like updateTransaction, deleteTransaction, etc. kept it simple for according to the requirements
export  class TransactionDB {

    private dbService?:IDBService;
    private wasChanged = true;
    private cachedTransactions = new Set<ITransaction>(); //can use a better caching mechanism like redis, but for now this will do

    async initialize(dbService:IDBService): Promise<void> {
        this.dbService = dbService;
        const fields = Object.entries(TransactionMetadata).map(([key, metadata]) => `${key} ${metadata.type} ${metadata.otherData??''}`).join(', ');
        //await this.dbService.execute('DROP TABLE IF EXISTS transactions');//todo remove this line
        const createTableQuery = `CREATE TABLE IF NOT EXISTS transactions (${fields}, PRIMARY KEY (referenceNumber));`
        logger.log("createTableQuery",createTableQuery);
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
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
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
            this.wasChanged = true;
            transaction.createdTime = new Date(now);
            transaction.updatedTime = new Date(now);
            this.cachedTransactions.add(transaction);
        }
        catch(err){
            logger.error("insertQuery Failed",insertQuery);
            throw err;
        }

    }
    async getAllTransactions(): Promise<ITransaction[]> {
        try {
            if(this.wasChanged){
                const selectQuery = 'SELECT * FROM transactions';
                const transactions = await this.dbService!.query<ITransaction[],undefined>(selectQuery);
                this.cachedTransactions = new Set(transactions);
                this.wasChanged = false;
                return transactions;
            }
            else{
                logger.log("returning cached transactions");
                return Array.from(this.cachedTransactions);
            }
        }
        catch(err){
            throw err;
        }

    }

}
const transactionDb = new TransactionDB();
export default transactionDb;