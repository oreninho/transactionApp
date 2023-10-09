import * as os from "os";

export const config = {
    user: 'your_user',
    host: 'localhost',
    database: 'transaction',
    password: '1234',
    port: 5432,
    filename:`${os.tmpdir()}/transactions.db`
};
