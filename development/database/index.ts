import Connection from "./Connection";
import env from "../infra/conf/env";

const mySqlConnection = new Connection(env.DB_NAME, env.DB_USER, env.DB_PASS, {
    dialect: "mysql",
    port: env.DB_PORT,
    host: env.DB_HOST
});

export { mySqlConnection };