"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = void 0;
var winston_1 = require("winston");
var LoggerService = /** @class */ (function () {
    function LoggerService() {
        this._logger = (0, winston_1.createLogger)({
            level: 'info',
            format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.printf(function (_a) {
                var timestamp = _a.timestamp, level = _a.level, message = _a.message;
                return "".concat(timestamp, " ").concat(level, ": ").concat(message);
            })),
            transports: [new winston_1.transports.Console()]
        });
    }
    LoggerService.prototype.logInfo = function (message) {
        this._logger.info(message);
    };
    LoggerService.prototype.logError = function (message) {
        this._logger.error(message);
    };
    return LoggerService;
}());
exports.LoggerService = LoggerService;
