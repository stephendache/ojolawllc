const express = require("express");
const { homePage } = require('../controllers/indexCtrl');

const router = express.Router();

router.get('/', homePage)

module.exports = router;