import { db_config } from "../config/knexfile";
import { TUserType } from "./types";

export const USER_TYPE: { [key: string]: TUserType } = {
  GOOGLE: "GOOGLE",
  FACEBOOK: "FACEBOOK",
  TWITTER: "TWITTER",
  INTERNAL: "INTERNAL",
  CUSTOM: "CUSTOM",
};

// const sqlite3 = require("sqlite3");
// const fs = require("fs");
// const dbFile = "./database.sqlite";
// const dbExists = fs.existsSync(dbFile);
export const knex = require("knex")(
  process.env.RUNTIME_ENV === "PRODUCTION" ? db_config.production : process.env.RUNTIME_ENV === "TESTING" ? db_config.testing : db_config.development
);

// if (!dbExists) {
//   fs.openSync(dbFile, "w");
// }

// export const db = new sqlite3.Database(dbFile);

// if (!dbExists) {
//   const query =
//     "CREATE TABLE IF NOT EXISTS users (id TEXT UNIQUE NOT NULL, email TEXT NOT NULL, external_id TEXT, type TEXT NOT NULL, password TEXT, first_time_login BOOLEAN DEFAULT TRUE, PRIMARY KEY (email, external_id, type))";
//   db.run(query, (err: any) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("User table created");
//     }
//   });
// }

export const SECRET = "secret";
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? "";
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ?? "";
export const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID ?? "";
export const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET ?? "";
export const FACEBOOK_APP_ACCESS_TOKEN = process.env.FACEBOOK_APP_ACCESS_TOKEN ?? "";
export const TWITTER_API_KEY = process.env.TWITTER_API_KEY ?? "";
export const TWITTER_API_KEY_SECRET = process.env.TWITTER_API_KEY_SECRET ?? "";
export const GOOGLE_USER_PROFILE_URL = "https://www.googleapis.com/oauth2/v3/userinfo";
export const CLIENT_BASE_URL = process.env.CLIENT_BASE_URL ?? "";
export const REDIRECT_BASE_URL = process.env.REDIRECT_BASE_URL ?? "";
export const REDIRECT_URL = `${CLIENT_BASE_URL}/redirect`;
export const PORT = process.env.PORT ?? 5001;

export const SECRET_KEY = process.env.SECRET_KEY;
export const INFURA_LINK = process.env.INFURA_LINK ?? "https://polygon-mumbai.infura.io/v3/1ea71c51dd35447cb60912a1603b8a35";

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

export const CONTRACT: { [key: string]: string } = {
  COOL_BEAR: process.env.CONTRACT_COOL_BEAR ?? "0xb02Ae478826a366cE045036afDa531f5577a36b3",
  LUCKY_CAT: process.env.CONTRACT_LUCKY_CAT ?? "0x5846Ad84c95f1886C08407a32e7B4864243264df",
  LUCKY_CHIPMUNK: process.env.CONTRACT_LUCKY_CHIPMUNK ?? "0xA17CDB459baf43f1ed573594f1d4532cB1f5291f",
  LUCKY_CRAB: process.env.CONTRACT_LUCKY_CRAB ?? "0xcb39c9013eEf12743fE87eD4468D3e4Cea58cBAd",
};
export const CHAIN_ID = process.env.CHAIN_ID ?? "80001";

export const CONTRACT_ABI = [
  {
    inputs: [
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "string", name: "_symbol", type: "string" },
      { internalType: "string", name: "_initBaseURI", type: "string" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "owner", type: "address" },
      { indexed: true, internalType: "address", name: "approved", type: "address" },
      { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "owner", type: "address" },
      { indexed: true, internalType: "address", name: "operator", type: "address" },
      { indexed: false, internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "previousOwner", type: "address" },
      { indexed: true, internalType: "address", name: "newOwner", type: "address" },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  { inputs: [], name: "baseExtension", outputs: [{ internalType: "string", name: "", type: "string" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "cost", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getApproved",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "operator", type: "address" },
    ],
    name: "isApprovedForAll",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  { inputs: [], name: "maxMintAmount", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "maxSupply", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  {
    inputs: [
      { internalType: "address", name: "_address", type: "address" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  { inputs: [], name: "name", outputs: [{ internalType: "string", name: "", type: "string" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "owner", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function" },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  { inputs: [], name: "renounceOwnership", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [], name: "reveal", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [], name: "revealed", outputs: [{ internalType: "bool", name: "", type: "bool" }], stateMutability: "view", type: "function" },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "bytes", name: "_data", type: "bytes" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "operator", type: "address" },
      { internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  { inputs: [{ internalType: "string", name: "_newBaseExtension", type: "string" }], name: "setBaseExtension", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ internalType: "string", name: "_newBaseURI", type: "string" }], name: "setBaseURI", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ internalType: "uint256", name: "_newCost", type: "uint256" }], name: "setCost", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ internalType: "uint256", name: "_newmaxMintAmount", type: "uint256" }], name: "setmaxMintAmount", outputs: [], stateMutability: "nonpayable", type: "function" },
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  { inputs: [], name: "symbol", outputs: [{ internalType: "string", name: "", type: "string" }], stateMutability: "view", type: "function" },
  {
    inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
    name: "tokenByIndex",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "uint256", name: "index", type: "uint256" },
    ],
    name: "tokenOfOwnerByIndex",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  { inputs: [], name: "totalSupply", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  { inputs: [{ internalType: "address", name: "newOwner", type: "address" }], name: "transferOwnership", outputs: [], stateMutability: "nonpayable", type: "function" },
  {
    inputs: [{ internalType: "address", name: "_owner", type: "address" }],
    name: "walletOfOwner",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  { inputs: [], name: "withdraw", outputs: [], stateMutability: "payable", type: "function" },
];
