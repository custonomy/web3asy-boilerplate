export const CHAIN_ID: string = process.env.CHAIN_ID ?? "80001";
export const DEFAULT_ENDPOINT: string = process.env.DEFAULT_ENDPOINT ?? "";

const GAS_ENDPOINT_SET: any = {
  137: process.env.MAINNET_GAS ?? "https://gasstation.polygon.technology/v2",
  80001: process.env.TESTNET_GAS ?? "https://gasstation-testnet.polygon.technology/v2",
};

export const GAS_ENDPOINT = GAS_ENDPOINT_SET[parseInt(CHAIN_ID)];

// For Web3say API
export const API_KEY: string = process.env.API_KEY ?? "";
export const API_SECRET: string = process.env.API_SECRET ?? "";
export const PROJECT_API_SECRET: string = process.env.PROJECT_API_SECRET ?? "";
export const MINTER_ADDRESS: string = process.env.MINTER_ADDRESS ?? "";
export const EC_KEY: string = process.env.EC_KEY ?? "";
