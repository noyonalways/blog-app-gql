import dotenv from "dotenv";

const envFile = `.env.${process.env.NODE_ENV || "development"}.local`;
dotenv.config({ path: envFile });

export default {
  JWT_SECRET: process.env.JWT_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
};
