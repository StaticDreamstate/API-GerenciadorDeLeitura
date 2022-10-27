"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mySqlConnection = void 0;
const Connection_1 = __importDefault(require("./Connection"));
const env_1 = __importDefault(require("../infra/conf/env"));
const mySqlConnection = new Connection_1.default(env_1.default.DB_NAME, env_1.default.DB_USER, env_1.default.DB_PASS, {
    dialect: "mysql",
    port: env_1.default.DB_PORT,
    host: env_1.default.DB_HOST
});
exports.mySqlConnection = mySqlConnection;
