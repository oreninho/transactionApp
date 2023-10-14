import { createLogger, format, transports, Logger } from 'winston';
import { ILoggerBehavior } from './types';
class WinstonLogger implements ILoggerBehavior {
    private logger: Logger;

    constructor() {
        const customFormat = format.printf((info) => {
            let formatted = `${info.timestamp} ${info.level}: ${info.message}`;

            // If there are additional arguments, stringify them and add to the output
            if (info[Symbol.for('splat')]) {
                formatted += ` ${info[Symbol.for('splat')].map((arg: any) => { // Explicitly set type here
                    // Stringify objects, leave other types as-is
                    return typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg;
                }).join(' ')}`;
            }

            return formatted;
        });
        let today = new Date().toISOString().slice(0, 10);
        this.logger = createLogger({
            level: 'info',
            format: format.combine(
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                format.errors({ stack: true }),
                format.splat(),
                format.json(),
                customFormat
            ),
            defaultMeta: { service: 'user-service' },
            transports: [
                new transports.File({ filename: `error${today}.log`, level: 'error' || 'warn' }),
                new transports.File({ filename: `info${today}.log`, level: 'info' }),
            ],
        });

        if (process.env.NODE_ENV !== 'production') {
            this.logger.add(new transports.Console({
                format: format.combine(
                    format.colorize(),
                    customFormat
                ),
            }));
        }
    }

    log(message: string, ...args: any[]): void {
        this.logger.log('info', message, { additionalInfo: args });
    }

    error(message: string, ...args: any[]): void {
        this.logger.error(message, { additionalInfo: args });
    }

    info(message: string, ...args: any[]): void {
        this.logger.info(message, { additionalInfo: args });
    }

    warn(message: string, ...args: any[]): void {
        this.logger.warn(message, { additionalInfo: args });
    }
}

export default new WinstonLogger();
