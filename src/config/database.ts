import { Sequelize } from "sequelize";
import { env } from "./env.js";

export const sequelize = new Sequelize(env.DATABASE_URL, {
    dialect: "postgres",

    logging:
      env.NODE_ENV === "development"
        ? console.log
        : false,
  
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
})