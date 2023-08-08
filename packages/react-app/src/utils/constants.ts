import { SelectedProvider } from "../providers/SelectedProvider";
import CoolBear from "../assets/cool_bear.png";
import LuckyCat from "../assets/lucky_cat.png";
import LuckyCrab from "../assets/lucky_crab.png";
import LuckyChipmunk from "../assets/lucky_chipmunk.png";
import { config } from "../config/env";
// import { CustonomyProvider } from "../providers/custonomy-wallet-provider/src";
import { CustonomyProvider } from "@custonomy/custonomy-wallet-provider";
import { INFT, TWalletType } from "./types";

export const ALCHEMY_API_KEY = config.ALCHEMY_API_KEY;
export const CUSTONOMY_PROJECT_ID = config.CUSTONOMY_PROJECT_ID;
export const Web3Provider = new SelectedProvider();
export const API_BASE_URL = config.API_BASE_URL;
// export const INFURA_PROJECT_ID = config.INFURA_PROJECT_ID;
export const CUSTONOMY_WIDGET_URL = config.CUSTONOMY_WIDGET_URL;
export const CUSTONOMY_END_POINT = config.CUSTONOMY_END_POINT;
export const CUSTONOMY_API_KEY = config.CUSTONOMY_API_KEY;
export const CHAIN_ID = config.CHAIN_ID;
export const INFURA_LINK = config.INFURA_LINK;
const custonomyConfig = {
  chainId: config.CHAIN_ID,
  projectId: CUSTONOMY_PROJECT_ID,
  session: "",
  endPoint: CUSTONOMY_END_POINT,
  apiKey: CUSTONOMY_API_KEY,
  infuraURL: INFURA_LINK,
  // callback: (result: any) => console.log({ result }),
};
export const custonomyProvider = new CustonomyProvider(custonomyConfig);

// export const INFURA_LINK: { [key: number]: string } = {
//   1: "https://mainnet.infura.io/v3/" + INFURA_PROJECT_ID,
// };
export const USER_TYPE = {
  GOOGLE: "GOOGLE",
  FACEBOOK: "FACEBOOK",
  TWITTER: "TWITTER",
  INTERNAL: "INTERNAL",
  CUSTOM: "CUSTOM",
};
export const STORAGE_KEY: { [key: string]: string } = {
  TOKEN: "demo-token",
  WALLET: "demo-wallet",
  USER: "demo-user",
  ADDRESS: "demo-address",
};
export const WALLET_TYPE: { [key: string]: TWalletType } = {
  METAMASK: "METAMASK",
  CUSTONOMY: "CUSTONOMY",
};

export const SUPPORTED_CHAINS: { [chainId: string]: { name: string } } = {
  "0x89": {
    name: "polygon",
  },
  "0x13881": {
    name: "mumbai",
  },
  "0x42": {
    name: "OKX",
  },
  "0x5": {
    name: "goerli",
  },
};
export const NETWORK = SUPPORTED_CHAINS[CHAIN_ID]?.name;

// const POLYGON_TESTING_CONTRACT = "0x2D20Bc1042f4D413312d97927644Df57EabD4F9a";
export const SHOP_PARAM =
  "ITrq9mPYhPeo8fr9X8Bl3cKzesa3Wwl2FsSCV29ZmS8yxAx2vtKsM42i4cGaXZXs8EKOUC7VA1SqyiQMyVreJNGfCRtrXMFWLLKBFz2pi8vMKOtbSLCKv3pLu9alBhbIpI0hUmAlLS0Zp1sUVM41xAdpcgHl9E4NBrDd34KJfT1rFt2RlYNrUaMpsaqXEiYU3O9ihWr92Y9TN3W46l0ao1J1yfT9hHJANzkIZlABlI75haj0EwLTWDkkB2JdpUfZzjItwZtDYFR8ZHMQF17IEqHNMdRfCfFDFeFd7WlorhmOvG6JTg2frSoYgISykDVpiXsSLw1qWmoHkmkWVH7Nm5JBIURid0u2fzGKPch8JNvPDBZyQKI0bA9XZDWUHsEElviv9sAGteFTDsi2BKGaIq2BIQDtmsIpBTDaOVPDVQDwSABYaV97D2EnWsHnCl7bpBav61n0FtJl5GXS6PgNTdwu4UaeTiMMOxBSPkJYxJe4LNjcrHdNNTiDZTlDEqV856MWjQIDmuzQrDvbM9qxFszmHynGAZEr0tUUb8zUlCkMUX5WrT18DJJt2u8BLnhRrqmbRXAK0OZzhxWxxhgjABuW6PvEkjl5prmtS2Xov0KsvS9x3JRpp6ncXIwgLfi9h9haUhVvgBakMzgA8g2qFJA9f4WWDNKt7zKtY1iF1SSRInc0TAYVn728jcpSlctwv1sfcCcP53LhkwdO1JaxaY7PQcsEzEBrbO9wKW8kri5VRkqWjQcC7gLV1ck5J8URpWrI60td4HEP0wZJfO1DFRt5aakgzi864xhmlvbmKrV9Y4A0qlK2HkefcxQDU0GJs9Y489giRQFjahnTPQYJEIQzDQKhfZn4z64nQjz9eoWPY0qfxqYGpUHZbugq4FNxBui1BYFkvcSaScGvYRISZuah4Yad92QMW7WQthcQNGLp81skkzecPoiAlXtsZdSR2lVaCMUGxor1cAGxpB2jHF40luRsgbLXMmTmHXxE";
export const NFTs: INFT[] = [
  {
    asset: "COOL_BEAR",
    name: "Cool Bear",
    image: CoolBear,
    // polygon
    contractAddress: config.CONTRACT["COOL_BEAR"],
    // file path is rooted from components/
    model: "../assets/cool_bear.gltf",
    usage: "Demonstrate the process of minting an NFT with Custonomy Web3asy platform",
    requirements: null,
    expiryDate: null,
    // projectId: Number(config.WINTER_PROJECT_ID["LUCKY_CAT"]),
  },
  // {
  //   asset: "LUCKY_CAT",
  //   name: "Lucky Cat",
  //   image: LuckyCat,
  //   // polygon
  //   contractAddress: config.CONTRACT["LUCKY_CAT"],
  //   // file path is rooted from components/
  //   model: "../assets/lucky_cat.gltf",
  //   usage: "Have a chance to get a two-month advertisement on sandbox 6x6 estate for corporate promotion",
  //   requirements: "Only for corporates who have filled up the free trial form",
  //   expiryDate: "The collection of lucky game entries will be closed on 1st November",
  //   projectId: Number(config.WINTER_PROJECT_ID["LUCKY_CAT"]),
  // },
  {
    asset: "LUCKY_CHIPMUNK",
    name: "Lucky Chipmunk",
    image: LuckyChipmunk,
    contractAddress: config.CONTRACT["LUCKY_CHIPMUNK"],
    model: "../assets/lucky_chipmunk.gltf",
    usage: "Six-months free trial of Custonomy custody platform",
    requirements: "Subscribe our social media (Linkedln and/or YouTube)",
    expiryDate: "In six months",
    // projectId: Number(config.WINTER_PROJECT_ID["LUCKY_CHIPMUNK"]),
  },
  {
    asset: "LUCKY_CRAB",
    name: "Lucky Crab",
    image: LuckyCrab,
    contractAddress: config.CONTRACT["LUCKY_CRAB"],
    model: "../assets/lucky_crab.gltf",
    usage: "Subscription discount coupon (50% off)",
    requirements: "Subscribe our social media (Linkedln and/or YouTube)",
    expiryDate: "In six months",
    // projectId: Number(config.WINTER_PROJECT_ID["LUCKY_CRAB"]),
  },
];

export const DEFAULT_OPTIONS = [
  {
    id: 0,
    value: "Too weak",
    minDiversity: 0,
    minLength: 0,
    type: "error",
  },
  {
    id: 1,
    value: "Weak",
    minDiversity: 2,
    minLength: 6,
    type: "error",
  },
  {
    id: 2,
    value: "Medium",
    minDiversity: 4,
    minLength: 8,
    type: "warning",
  },
  {
    id: 3,
    value: "Strong",
    minDiversity: 4,
    minLength: 10,
    type: "success",
  },
];

export enum EFormType {
  REGISTER = "REGISTER",
  LOGIN = "LOGIN",
  FORGOT_PASSWORD = "FORGOT_PASSWORD",
  CHANGE_PASSWORD = "CHANGE_PASSWORD",
}

export enum EUserType {
  GOOGLE = "GOOGLE",
  FACEBOOK = "FACEBOOK",
  INTERNAL = "INTERNAL",
  CUSTOM = "CUSTOM",
}

export enum EStorageKey {
  TOKEN = "demo-token",
  WALLET_TYPE = "demo-wallet-type",
  USER = "demo-user",
  ACCOUNT = "demo-account",
}

export enum EWalletType {
  METAMASK = "METAMASK",
  CUSTONOMY = "CUSTONOMY",
}

export enum ESupportedChains {
  "0x89" = "0x89",
  "0x13881" = "0x13881",
}
