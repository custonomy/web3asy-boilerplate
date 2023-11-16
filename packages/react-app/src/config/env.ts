import {config as envconfig} from 'dotenv';
envconfig()

export const config = {
  ALCHEMY_API_KEY: process.env.REACT_APP_ALCHEMY_API_KEY ?? "",
  INFURA_LINK: process.env.REACT_APP_INFURA_LINK ?? "https://polygon-mainnet.infura.io/v3/",
  CUSTONOMY_PROJECT_ID: process.env.REACT_APP_CUSTONOMY_PROJECT_ID ?? "",
  CUSTONOMY_API_KEY: process.env.REACT_APP_CUSTONOMY_API_KEY ?? "",
  CUSTONOMY_END_POINT: process.env.REACT_APP_CUSTONOMY_END_POINT ?? "https://apip.custonomy.io",
  CUSTONOMY_WIDGET_URL: process.env.REACT_APP_CUSTONOMY_WIDGET_URL ?? "https://cwidget2.custonomy.io/index.js",
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL ?? "https://exhibit-api.custonomy.io/api",
  CHAIN_ID: process.env.REACT_APP_CHAIN_ID ?? '0x89',
  CONTRACT: {
    COOL_BEAR:
      process.env.REACT_APP_CONTRACT_COOL_BEAR ?? "0xb02Ae478826a366cE045036afDa531f5577a36b3",
    LUCKY_CAT:
      process.env.REACT_APP_CONTRACT_LUCKY_CAT ?? "0x5846Ad84c95f1886C08407a32e7B4864243264df",
    LUCKY_CHIPMUNK:
      process.env.REACT_APP_CONTRACT_LUCKY_CHIPMUNK ?? "0xA17CDB459baf43f1ed573594f1d4532cB1f5291f",
    LUCKY_CRAB:
      process.env.REACT_APP_CONTRACT_LUCKY_CRAB ?? "0xcb39c9013eEf12743fE87eD4468D3e4Cea58cBAd",
  },
  
  STRIPE_PKEY: process.env.REACT_APP_STRIPE_PKEY ?? ""
};
