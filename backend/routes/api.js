const express = require('express');
const router = express.Router();

const userController = require('../db/user/userController.js');
const authenticate = require('../middlewares/authenticate.js');

/* POST home page. */
router.post('/login',
    authenticate.handlePOSTLogIn
);

router.post('/logout',
    authenticate.handleAuthentication,
    authenticate.handlePOSTLogOut
);

router.post('/userdetails',
    authenticate.handleAuthentication,
    userController.handleGETUserDetails
);

module.exports = router;
