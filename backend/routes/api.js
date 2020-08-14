const express = require('express');
const router = express.Router();

const bankController = require('../db/bank/bankController.js');
const authenticate = require('../middlewares/authenticate.js');

/* POST home page. */
router.post('/login',
    authenticate.handlePOSTLogIn
);

router.post('/logout',
    authenticate.handleAuthentication,
    authenticate.handlePOSTLogOut
);

module.exports = router;
