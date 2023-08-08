export type TUserType = "GOOGLE" | "FACEBOOK" | "INTERNAL";
export type TWalletType = "METAMASK" | "CUSTONOMY";
export interface IMap {
  [key: string]: string;
}
export interface INavItem {
  name: string;
  permission: string;
  link: string;
}
export interface IErrorResponse {
  error: string;
}

export interface ICustonomyError {
  code: number;
  message: string;
  data?: object;
}

export interface IAccount {
  projectId: string;
  chainId: string;
  user: IUser | null;
}
export interface IWallet {
  type: string;
  address: string;
}
export interface INFT {
  name: string;
  image: string;
  contractAddress: string;
  model: string;
  asset: string;
  usage: string;
  requirements: string | null;
  expiryDate: string | null;
}

export interface IUser {
  id: string;
  email: string;
  session: string;
  externalId: string | null;
  firstTimeLogin: boolean;
  type: TUserType | null;
}

export interface IUpdateUser {
  id: string;
  password: string;
}

export interface IOwnedNFT {
  contract: { address: string };
  id: { tokenId: string; tokenMetadata: object };
  balance: string;
  title: string;
  description: string;
  tokenUri: { raw: string; gateway: string };
  media: { raw: string; gateway: string; thumbnail: string; format: string; bytes: number };
  metadata: { image: string; external_url: string; name: string; description: string; attributes: object[]; media: object };
  timeLastUpdated: string;
  error: string;
  contractMetadata: { name: string; symbol: string; totalSupply: string; tokenType: string; opensea: object };
  spamInfo: { isSpam: string; classifications: string[] };
}

export interface IStrength {
  contains: string[];
  length: number;
  type?: string;
  value: string;
}
