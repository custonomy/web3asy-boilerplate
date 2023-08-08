const router = require("express").Router();

import { createOneClickIntent, webhookHandler, getOrder } from "../controllers/orderController";

router.get('/:id', getOrder);
router.post('/oneclickintent', createOneClickIntent);
router.post('/webhook', webhookHandler)

module.exports = router;
