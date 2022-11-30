import { mintNFT } from "../controllers/txnController";

const router = require("express").Router();

// NOTE: THIS APPROACH OF MINTING IS FOR DEMO ONLY, NOT A RECOMMENDED WAY
router.post('/', mintNFT);

module.exports = router;
