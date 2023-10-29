import { createLogger, Logger, transports, format } from 'winston'

export class LoggerService {
  private _logger: Logger

  constructor() {
    this._logger = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
          return `${timestamp} ${level}: ${message}`
        })
      ),
      transports: [new transports.Console()]
    })
  }

  logInfo(message: string) {
    this._logger.info(message)
  }

  logError(message: string) {
    this._logger.error(message)
  }
}
