import mysql from "serverless-mysql";

export const pool = mysql({
  config: {
    host: "localhost",
    user: "davi",
    password: "catarino",
    port: 3306,
    database: "nextdb",
  },
});
