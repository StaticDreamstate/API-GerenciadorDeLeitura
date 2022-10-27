"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const env = {
    API_NAME: process.env.API_NAME,
    API_VER: process.env.API_VER,
    DB_NAME: process.env.DB_NAME,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: Number(process.env.DB_PORT),
    KEY: process.env.KEY,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS
};
exports.default = env;
