import express from 'express';
import session from "./services/session";
import transactions from "./services/transactions";
import {eventsHandler} from "./services/events/eventsHandler";
import cors from 'cors';
//import jwtMiddleware from 'express-jwt';
import {GLOBAL_CONSTS} from "./consts";
import transactionsRouter from "./routes/transaction";

const port  = process.env.port || 3000;
const app = express();

app.use(cors());
app.use(express.json())
app.use("/transactions",transactionsRouter)

app.get("/",(req,res)=>{
    res.send("hello!")
})



app.listen(port,async ()=>{
    await session.initAll();
    console.log("session initialized");
    console.log("listening on port",port);
    eventsHandler.on(GLOBAL_CONSTS.EVENT_TRANSACTION_ADDED,async ()=>{
        console.log("event received");
    });

})
// app.on('error', (err) => {
//     eventsHandler.unsubscribeAll(GLOBAL_CONSTS.EVENT_TRANSACTION_ADDED);
//     eventsHandler.unsubscribeAll(GLOBAL_CONSTS.EVENT_TRANSACTION_ADDED);
// });
// app.on("close",()=>{
//     eventsHandler.unsubscribeAll(GLOBAL_CONSTS.EVENT_TRANSACTION_ADDED);
// })