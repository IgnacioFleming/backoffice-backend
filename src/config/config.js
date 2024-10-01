import dotenv from "dotenv";

dotenv.config();

export default {
  urls: {
    local_client_url: process.env.LOCAL_CLIENT_URL,
    develop_client_url: process.env.DEVELOP_CLIENT_URL,
  },
  db: {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGHPORT,
    database: process.env.PGDATABASE,
  },
};
