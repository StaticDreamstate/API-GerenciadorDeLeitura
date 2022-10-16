import "dotenv/config";

const env = {
    API_NAME: process.env.API_NAME as string,
    API_VER: process.env.API_VER as string,
    DB_NAME: process.env.DB_NAME as string,
    DB_HOST: process.env.DB_HOST as string,
    DB_PORT: Number(process.env.DB_PORT),
    DB_USER: process.env.DB_USER as string,
    DB_PASS: process.env.DB_PASS as string
};

export default env;