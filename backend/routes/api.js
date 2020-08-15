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

router.post('/issuesettlement',
    authenticate.handleAuthentication,
    userController.handlePOSTIssueSettlement
);

router.post('/approvesettlement',
    authenticate.handleAuthentication,
    userController.handlePOSTApproveSettlement
);

router.post('/finalizesettlement',
    authenticate.handleAdminAuthentication,
    userController.handlePOSTFinalizeSettlement
);

module.exports = router;
