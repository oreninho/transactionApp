import {ITransaction} from "./db/model/transactions";
import csv from "csv-parser";
import * as fs from "fs";
import transactionDb from "./db/transactionDB";
import {mapTransactionFields} from "../utils";
const { v4: uuidv4 } = require('uuid'); // make sure to install the 'uuid' package


class Transactions {

    private map = new Map<string,ITransaction>

   async loadTransactionFile(file: string){
        fs.createReadStream(file).pipe(csv()).on("data",(row:ITransaction)=>{
            const adjustedRow = mapTransactionFields<ITransaction>(row);
            if (!this.verifyTransaction(adjustedRow)){
                console.log("invalid transaction",adjustedRow);
            }
            else{
                try{
                    let {referenceNumber} = adjustedRow;
                    if (!referenceNumber){
                        referenceNumber = uuidv4();
                        adjustedRow.referenceNumber = referenceNumber;
                    }
                    transactionDb.addTransaction(adjustedRow).then(()=>{
                        console.log("added transaction!",adjustedRow)
                    });
                }
                catch (err){
                    console.log("error adding transaction",err);
                }

            }

        })
   }

   async getAllTransactions():Promise<ITransaction[]>{
        return await transactionDb.getTransactions();
   }

   private verifyTransaction(transaction:ITransaction):boolean{
        const keys = Object.keys(transaction);
        const requiredKeys = ["accountMask","postedDate","description","details","amount","balance","currency","type"];
        for (let key of requiredKeys){
            if (!keys.includes(key)){
                console.log("missing key",key);
                return false;
            }
        }
        return true;
   }

}
const transactions = new Transactions();
export default transactions;