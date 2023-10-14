import express from 'express';
import multer from 'multer';
import {eventsHandler} from "../services/events/eventsHandler";
import transactions from "../services/transactions";
import {GLOBAL_CONSTS} from "../consts";
import * as os from "os";
import logger from "../services/logger/logger";
const router = express.Router();

//const storage = multer.memoryStorage();
const upload = multer({ dest: os.tmpdir() });

router.post('/upload', upload.single('file'), (req, res) => {
    const currentTime = new Date().toISOString();
    const file = req.file;
    if (!file) {
        res.status(400).send('No file uploaded.');
        return;
    }
    else {
        eventsHandler.subscribe(GLOBAL_CONSTS.EVENT_TRANSACTION_ADDED,async ()=>{
            await transactions.loadTransactionFile(file.path);
            logger.log("listener notified",eventsHandler.listenerCount(GLOBAL_CONSTS.EVENT_TRANSACTION_ADDED));
        });
    }
    eventsHandler.triggerEvent(GLOBAL_CONSTS.EVENT_TRANSACTION_ADDED);
    res.send(`File uploaded to queue ${currentTime}`);

});

router.get("/all",async (req,res)=>{
    try{
        const transactionsData = await transactions.getAllTransactions();
        logger.log("transactionsData",transactionsData);
        res.send(transactionsData);
    }
    catch(err){
        logger.error("error when fetching transactions",err);
        res.status(500).send("internal server error");
    }
    finally {
        res.end();
    }

});


export default router ;