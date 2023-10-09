/*
meant for initialization all other services and managing some in memory data
this is the services that knows all the app components
 */

import SQLiteService from "./db/sqlite/dbSqliteBehaviour";
import {config} from "./db/config";
import transactionDB from "./db/transactionDB";

class Session {


    async initAll(){
        const dbService = new SQLiteService(config.filename);
        await dbService.connect();

        await transactionDB.initialize(dbService)

    }



}
const session = new Session()
export default session;