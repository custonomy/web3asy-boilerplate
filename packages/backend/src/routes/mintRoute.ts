const router = require("express").Router();

import { mintNFT } from "../controllers/testController";

// This path is for testing purchase
router.post('/', mintNFT);

module.exports = router;
