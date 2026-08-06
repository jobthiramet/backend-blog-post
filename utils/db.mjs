// utils/db.mjs
import dns from "dns";
import pg from "pg";

dns.setDefaultResultOrder("ipv4first");

const { Pool } = pg;

const connectionPool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default connectionPool;
