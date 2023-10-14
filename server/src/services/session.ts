/*
meant for initialization all other services and managing some in memory data
this is the services that knows all the app components
 */

import SQLiteService from "./db/sqlite/dbSqliteBehaviour";
import {config} from "./db/config";
import transactionDB from "./db/transactionDB";
import logger from "./logger/logger";
import winstonLogger from "./logger/winstonLogger";
import dbService from "./db/dbService";

class Session {

    async initAll(){
        logger.init(winstonLogger);
        dbService.init(new SQLiteService(config.filename))
        await dbService.connect();
        await transactionDB.initialize(dbService)

    }

}
const session = new Session()
export default session;