// Create PostgreSQL Connection Pool here !
import dns from "dns";
import * as pg from "pg";

dns.setDefaultResultOrder("ipv4first");

const { Pool } = pg.default;

const connectionPool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default connectionPool;
