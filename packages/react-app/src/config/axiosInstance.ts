import axios from "axios";
import { EStorageKey, EUserType } from "../utils/constants";
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
    const token = localStorage.getItem(EStorageKey.TOKEN) ?? "";
    const prefix = token.substring(0, token.indexOf(":"));
    const jwt = getJWT(token);
    if (prefix === EUserType.CUSTOM) {
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
