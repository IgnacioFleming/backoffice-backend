import dotenv from "dotenv";

// const enviroment = process.argv[2] === "dev" ? "develop" : "production";

dotenv.config({ path: process.env.NODE_ENV === "production" ? ".env" : ".env.develop" });

export default {
  urls: {
    local_client_url: process.env.LOCAL_CLIENT_URL,
    develop_client_url: process.env.DEVELOP_CLIENT_URL,
  },
  db: {
    pg: {
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      host: process.env.PGHOST,
      port: process.env.PGPORT,
      database: process.env.PGDATABASE,
    },
    mysql: {
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      database: process.env.NODE_ENV === "test" ? process.env.TEST_DB : process.env.MYSQL_DATABASE,
      test_database: process.env.TEST_DB,
    },
  },
  admin_keys: {
    admin_username: process.env.ADMIN_USERNAME,
    admin_pwd: process.env.ADMIN_PASSWORD,
    admin_id: process.env.ADMIN_ID,
  },
  email_service: {
    user: process.env.EMAIL_SERVICE_USER,
    password: process.env.EMAIL_SERVICE_PASSWORD,
  },
  session: {
    secret: process.env.SESSION_SECRET,
  },
  uploads: {
    cloudinary: {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    },
  },
  enviroment: process.env.NODE_ENV,
  auth: { jwt_secret_key: process.env.JWT_SECRET_KEY },
};
