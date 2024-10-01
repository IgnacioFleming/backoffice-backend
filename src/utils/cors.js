import config from "../config/config.js";
const whitelist = [config.urls.local_client_url, config.urls.develop_client_url];
export const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
