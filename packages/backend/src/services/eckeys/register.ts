import fs from "fs";
import { generateECPrivateKey } from "../utils/util";
import path from "path";

import { Web3asyAPI } from "@custonomy/oneclickcheckout";

require("dotenv").config();

const registerKey = async () => {
  let ecPrivateKey: string;

  // Generate EC Key
  ecPrivateKey = generateECPrivateKey();

  // Initialize Custonomy
  const custonomy = new Web3asyAPI(
    process.env.API_KEY as string,
    process.env.API_SECRET as string,
    process.env.DEFAULT_ENDPOINT as string,
  );

  // Register EC Key
  await custonomy
    .registerECKey(ecPrivateKey, 'exhibit-api')
    .then((res) => {

      // The following is just for demo purpose!!!! 
      // Please key your ecPrivateKey securely in your production environment
      const envDataToAppend = `EC_KEY=${ecPrivateKey}\n`;

      fs.writeFileSync(
        path.join(__dirname, "../../.ec_key"),
        `${envDataToAppend}`,
        { flag: "a+"}
      );

      console.log("EC key registration successful. appended to .ec_key");
    })
    .catch((ex) => {
      console.error({ ex });
      throw ex;
    });
};

registerKey();
