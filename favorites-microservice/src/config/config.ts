import dotenv from 'dotenv';

dotenv.config();

// Detect environment in use
const NODE_ENV = process.env.NODE_ENV || 'development';


//Select variables depending on environment
const MONGODB_URL =
    NODE_ENV === 'production'
        ? process.env.PROD_MONGODB_URL
        : process.env.DEV_MONGODB_URL;

const CLIENT_URL =
    NODE_ENV === 'production'
        ? process.env.PROD_CLIENT_URL
        : process.env.DEV_CLIENT_URL;

//Server Port
const PORT = process.env.PORT ? Number(process.env.PORT) : 5001;

//centralized config
const config = {
    env: NODE_ENV,
    server: {
        port: PORT,
    },
    mongo: {
        url: MONGODB_URL || '',
    },
    client: {
        url: CLIENT_URL || '',
    },
};

export default config;