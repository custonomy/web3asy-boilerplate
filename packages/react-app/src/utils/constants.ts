import { SelectedProvider } from "../providers/SelectedProvider";
import LuckyCat from "../assets/lucky_cat.png";
import LuckyCrab from "../assets/lucky_crab.png";
import LuckyChipmunk from "../assets/lucky_chipmunk.png";
import { config } from "../config/env";
import { CustonomyProvider } from "@custonomy/custonomy-wallet-provider";
import { INFT } from "./types";

export const { ALCHEMY_API_KEY, CUSTONOMY_PROJECT_ID, API_BASE_URL, CUSTONOMY_WIDGET_URL, CUSTONOMY_END_POINT, CUSTONOMY_API_KEY, CHAIN_ID, INFURA_LINK } = config;
const custonomyConfig = {
  chainId: config.CHAIN_ID,
  projectId: CUSTONOMY_PROJECT_ID,
  session: "", // to be updated after user logins in
  endPoint: CUSTONOMY_END_POINT,
  apiKey: CUSTONOMY_API_KEY,
  infuraURL: INFURA_LINK,
};
export const custonomyProvider = new CustonomyProvider(custonomyConfig);
export const Web3Provider = new SelectedProvider(); // an object for switching between different web3 provider and being used across different pages

export const SUPPORTED_CHAINS = {
  "0x89": "polygon",
  "0x13881": "mumbai",
};
export const NETWORK = SUPPORTED_CHAINS[CHAIN_ID as ESupportedChains];
export const NFTs: INFT[] = [
  {
    asset: "LUCKY_CAT",
    name: "Lucky Cat",
    image: LuckyCat,
    // polygon
    contractAddress: config.CONTRACT["LUCKY_CAT"],
    // file path is rooted from components/
    model: "../assets/lucky_cat.gltf",
  },
  {
    asset: "LUCKY_CHIPMUNK",
    name: "Lucky Chipmunk",
    image: LuckyChipmunk,
    contractAddress: config.CONTRACT["LUCKY_CHIPMUNK"],
    model: "../assets/lucky_chipmunk.gltf",
  },
  {
    asset: "LUCKY_CRAB",
    name: "Lucky Crab",
    image: LuckyCrab,
    contractAddress: config.CONTRACT["LUCKY_CRAB"],
    model: "../assets/lucky_crab.gltf",
  },
];

export const INIT_STRENGTH = { contains: [], length: 0, value: "" };
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
