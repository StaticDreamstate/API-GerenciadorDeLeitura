"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const erros = path_1.default.resolve("development", "infra", "logs", "erros.log");
const avisos = path_1.default.resolve("development", "infra", "logs", "avisos.log");
const info = path_1.default.resolve("development", "infra", "logs", "info.log");
const http = path_1.default.resolve("development", "infra", "logs", "http.log");
const verbose = path_1.default.resolve("development", "infra", "logs", "verbose.log");
const depuracao = path_1.default.resolve("development", "infra", "logs", "debug.log");
const logger = winston_1.default.createLogger({
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json(), winston_1.default.format.errors({ stack: true })),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston_1.default.transports.File({ filename: erros, level: 'error' }),
        new winston_1.default.transports.File({ filename: avisos, level: 'warn' }),
        new winston_1.default.transports.File({ filename: info, level: 'info' }),
        new winston_1.default.transports.File({ filename: http, level: 'http' }),
        new winston_1.default.transports.File({ filename: verbose, level: 'verbose' }),
        new winston_1.default.transports.File({ filename: depuracao, level: 'debug' }),
    ],
});
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.simple(),
    }));
}
exports.default = logger;
