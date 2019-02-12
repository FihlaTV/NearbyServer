const express = require('express');
const router = express.Router();

router.use('/facebook', require('./facebook'));
router.use('/account_kit', require('./account_kit'));

module.exports = router;
