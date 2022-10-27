"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = __importDefault(require("../../infra/conf/env"));
const controller = {
    welcome(req, res) {
        return res.status(200).json(`API ${env_1.default.API_NAME} version ${env_1.default.API_VER} running.`);
    },
};
exports.default = controller;
