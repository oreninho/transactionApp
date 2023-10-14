import {ITransaction} from "./db/model/transactions";
import csv from "csv-parser";
import * as fs from "fs";
import transactionDb from "./db/transactionDB";
import {mapTransactionFields} from "../utils";
import logger from "./logger/logger";
const { v4: uuidv4 } = require('uuid'); // make sure to install the 'uuid' package


class Transactions {

    private map = new Map<string,ITransaction>

   async loadTransactionFile(file: string){
        fs.createReadStream(file).pipe(csv()).on("data",(row:ITransaction)=>{
            const adjustedRow = mapTransactionFields<ITransaction>(row);
            if (!this.verifyTransaction(adjustedRow)){
                logger.error("invalid transaction",adjustedRow);
            }
            else{
                try{
                    let {referenceNumber} = adjustedRow;
                    if (!referenceNumber){
                        referenceNumber = uuidv4();
                        adjustedRow.referenceNumber = referenceNumber;
                    }
                    transactionDb.addTransaction(adjustedRow).then(()=>{
                        logger.log("added transaction!",adjustedRow)
                    });
                }
                catch (err){
                    logger.error("error adding transaction",err);
                }

            }

        })
   }

   async getAllTransactions():Promise<ITransaction[]>{
        return await transactionDb.getAllTransactions();
   }

   private verifyTransaction(transaction:any):boolean{
        const keys = Object.keys(transaction);

        const requiredKeys = ["accountMask","postedDate","description","details","amount","balance","currency","type","referenceNumber"];
        for (let key of requiredKeys){
            if (!keys.includes(key) ){
                logger.error("missing key",key);
                return false;
            }
            else if (key === "amount" || key === "balance"){
                if (isNaN(transaction[key])){
                    logger.error("invalid amount or balance",transaction[key]);
                    return false;
                }
            }
            else if (key === "referenceNumber"){
                logger.log("checking referenceNumber",transaction[key]);
                logger.log("checking referenceNumber",transaction[key].match(/[^a-zA-Z0-9]/));
                if (transaction[key].match(/[^a-zA-Z0-9]/)){
                    logger.error("invalid referenceNumber",transaction[key]);
                    return false;
                }
            }
            //can add more checks here
        }
        return true;
   }

}
const transactions = new Transactions();
export default transactions;