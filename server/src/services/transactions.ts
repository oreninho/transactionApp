import {ITransaction} from "./db/model/transactions";
import csv from "csv-parser";
import * as fs from "fs";
import transactionDb from "./db/transactionDB";
import {mapTransactionFields} from "../utils";

class Transactions {

    private map = new Map<string,ITransaction>

   async loadTransactionFile(file:string){
        fs.createReadStream(file).pipe(csv()).on("data",(row:ITransaction)=>{
            const adjustedRow = mapTransactionFields<ITransaction>(row);
            transactionDb.addTransaction(adjustedRow).then(()=>{
                console.log("added transaction!",adjustedRow)
            })
        })
   }

   async getAllTransactions():Promise<ITransaction[]>{
        return await transactionDb.getTransactions();
   }


}
const transactions = new Transactions();
export default transactions;