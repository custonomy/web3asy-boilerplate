export const config = {
  ALCHEMY_API_KEY: process.env.REACT_APP_ALCHEMY_API_KEY ?? "",
  INFURA_LINK: process.env.REACT_APP_INFURA_LINK ?? "",
  CUSTONOMY_PROJECT_ID: process.env.REACT_APP_CUSTONOMY_PROJECT_ID ?? "",
  CUSTONOMY_API_KEY: process.env.REACT_APP_CUSTONOMY_API_KEY ?? "",
  CUSTONOMY_END_POINT: process.env.REACT_APP_CUSTONOMY_END_POINT ?? "",
  CUSTONOMY_WIDGET_URL: process.env.REACT_APP_CUSTONOMY_WIDGET_URL ?? "",
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL ?? "",
  CHAIN_ID: process.env.REACT_APP_CHAIN_ID ?? '0x13881',
  CONTRACT: {
    LUCKY_CAT: process.env.REACT_APP_CONTRACT_LUCKY_CAT ?? "0x2D20Bc1042f4D413312d97927644Df57EabD4F9a",
    LUCKY_CHIPMUNK: process.env.REACT_APP_CONTRACT_LUCKY_CHIPMUNK ?? "0x2D20Bc1042f4D413312d97927644Df57EabD4F9a",
    LUCKY_CRAB: process.env.REACT_APP_CONTRACT_LUCKY_CRAB ?? "0x2D20Bc1042f4D413312d97927644Df57EabD4F9a",
  },
};
