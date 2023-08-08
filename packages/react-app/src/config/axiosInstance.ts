import axios from "axios";
import { STORAGE_KEY, USER_TYPE } from "../utils/constants";
import { getJWT } from "../utils/helpers";
import { config } from "./env";

const instance = axios.create({
  baseURL: config.API_BASE_URL,
});

instance.defaults.headers.common["Content-Type"] = "application/json";
instance.defaults.headers.common["Accept"] = "application/json";
instance.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

instance.interceptors.request.use(
  async (config) => {
    // Do something before request is sent
    // config.headers!["x-api-key"] = process.env.REACT_APP_API_KEY ?? "";
    const token = localStorage.getItem(STORAGE_KEY.TOKEN) ?? "";
    const prefix = token.substring(0, token.indexOf(":"));
    const jwt = getJWT(token);
    if (prefix === USER_TYPE.CUSTOM) {
      config.headers!["authorization"] = `JWT ${jwt}`;
    } else {
      config.headers!["authorization"] = token;
    }

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export default instance;
