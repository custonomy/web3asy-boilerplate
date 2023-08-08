export const config = {
  ALCHEMY_API_KEY:
    process.env.REACT_APP_ALCHEMY_API_KEY ?? "m-orjwcwblrtcK1sKB3-meEbFQuJsAlW",
  INFURA_LINK:
    process.env.REACT_APP_INFURA_LINK ??
    "https://polygon-mumbai.infura.io/v3/1ea71c51dd35447cb60912a1603b8a35",
  CUSTONOMY_PROJECT_ID:
    process.env.REACT_APP_CUSTONOMY_PROJECT_ID ??
    "ea1f784c-bab0-44da-b350-ca9fac5081aa",
  CUSTONOMY_API_KEY:
    process.env.REACT_APP_CUSTONOMY_API_KEY ??
    "custonomy_api.YFEISXYKZKUTYASJ5OWUQNNDC4TA",
  CUSTONOMY_END_POINT:
    process.env.REACT_APP_CUSTONOMY_END_POINT ??
    "https://api-uat.custonomy.io:8000",
  CUSTONOMY_WIDGET_URL:
    process.env.REACT_APP_CUSTONOMY_WIDGET_URL ??
    "https://cwidget-uat.custonomy.io/index.js",
  API_BASE_URL:
    process.env.REACT_APP_API_BASE_URL ??
    "https://exhibit-api-uat.custonomy.io/api",
  CHAIN_ID: process.env.REACT_APP_CHAIN_ID ?? "0x13881",
  STRIPE_PKEY:
    process.env.REACT_APP_STRIPE_PKEY ??
    "pk_test_51Mo0xhFru9EnmKnFRC5tjXOqNfMPuL5ATwrLccWi6Kk6eRgggoEqKPy13mzr3CnqksIZTqNy36S4DKJ1cBOhFMbg00kQpG2nIL",
  CONTRACT: {
    COOL_BEAR:
      process.env.REACT_APP_CONTRACT_COOL_BEAR ??
      "0xb02Ae478826a366cE045036afDa531f5577a36b3",
    LUCKY_CAT:
      process.env.REACT_APP_CONTRACT_LUCKY_CAT ??
      "0x5846Ad84c95f1886C08407a32e7B4864243264df",
    LUCKY_CHIPMUNK:
      process.env.REACT_APP_CONTRACT_LUCKY_CHIPMUNK ??
      "0xA17CDB459baf43f1ed573594f1d4532cB1f5291f",
    LUCKY_CRAB:
      process.env.REACT_APP_CONTRACT_LUCKY_CRAB ??
      "0xcb39c9013eEf12743fE87eD4468D3e4Cea58cBAd",
  },
  WINTER_PROJECT_ID: {
    LUCKY_CAT: process.env.REACT_APP_WINTER_PROJECT_ID_LUCKY_CAT ?? 7106,
    LUCKY_CHIPMUNK:
      process.env.REACT_APP_WINTER_PROJECT_ID_LUCKY_CHIPMUNK ?? 7108,
    LUCKY_CRAB: process.env.REACT_APP_WINTER_PROJECT_ID_LUCKY_CRAB ?? 7110,
  },
};
