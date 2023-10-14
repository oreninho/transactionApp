import {ILoggerBehavior} from "./types";

class Logger implements ILoggerBehavior {
    private _loggerBehavior?: ILoggerBehavior;

    init(loggerBehavior: ILoggerBehavior) {
        this._loggerBehavior = loggerBehavior;
    }

    log(message: string,...args:any[]): void {
        this._loggerBehavior!.log(message, ...args);
    }

    error(message: string,...args:any[]): void {
        this._loggerBehavior!.error(message, ...args);
    }

    info(message: string,...args:any[]): void {
        this._loggerBehavior!.info(message, ...args);
    }

    warn(message: string,...args:any[]): void {
        this._loggerBehavior!.warn(message, ...args);
    }
}
const logger = new Logger();
export default logger;