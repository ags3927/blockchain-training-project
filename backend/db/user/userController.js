const userInterface = require('./userInterface.js');
const initial = require('../../invoke/initial.js');
const runtime = require('../../invoke/runtime.js');

const handleGETUserDetails = async (req, res) => {
    try {
        let user = res.locals.middlewareResponse.user;

        return res.status(200).send({
            status: 'OK',
            bank: {
                name: user.name,
                address: user.address,
                contact: user.contact,
                bdtTokens: user.bdtTokens
            }
        });

    } catch (e) {
        return res.status(400).send({
            status: 'ERROR',
            message: e.message
        });
    }
}

const handlePOSTRegister = async (req, res) => {
    try {
        let userObject = req.body.userObject;

        let enrollResult = await initial.enrollUser(userObject.username, userObject.bank);

        if (enrollResult) {

            let userResult = await userInterface.insertUser(req.body.userObject);

            if (userResult.status === 'OK') {
                return res.status(200).send({
                    message: userResult.message
                });
            } else {
                return res.status(400).send({
                    message: 'Unable to register'
                })
            }

        } else {
            return res.status(400).send({
                message: 'User enrollment failed'
            });
        }
    } catch (e) {
        return res.status(400).send({
            message: e.message
        });
    }
}

const handlePOSTIssueSettlement = async (req, res) => {
    try {

        let settlementObject = req.body.settlementObject;
        let payer = res.locals.middlewareResponse.user.username;
        let payee = settlementObject.payee;
        let value = settlementObject.value;
        let bank = res.locals.middlewareResponse.user.bank;

        let result = await runtime.issueSettlement(payer, payee, value, bank);

        if (result.status === 'OK') {
            return res.status(200).send({
                message: 'Settlement issued successfully',
                issuedSettlement: result.issuedSettlement
            });
        } else {
            return res.status(400).send({
                message: 'Settlement could not be issued'
            });
        }

    } catch (e) {
        return res.status(400).send({
            status: 'ERROR',
            message: e.message
        });
    }
}

const handlePOSTApproveSettlement = async (req, res) => {
    try {
        let settlementObject = req.body.settlementObject;
        let payee = res.locals.middlewareResponse.user.username;
        let payer = settlementObject.payer;
        let timestamp = settlementObject.timestamp;
        let bank = res.locals.middlewareResponse.user.bank;

        let result = await runtime.approveSettlement(payer, payee, timestamp, bank);

        if (result.status === 'OK') {
            return res.status(200).send({
                message: 'Settlement approved successfully',
                approvedSettlement: result.approvedSettlement
            });
        } else {
            return res.status(400).send({
                message: 'Settlement could not be approved'
            });
        }

    } catch (e) {
        return res.status(400).send({
            status: 'ERROR',
            message: e.message
        });
    }
}

const handlePOSTFinalizeSettlement = async (req, res) => {
    try {
        let settlementObject = req.body.settlementObject;
        let payer = settlementObject.payer;
        let payee = settlementObject.payee;
        let timestamp = settlementObject.timestamp;

        let result = await runtime.finalizeSettlement(payer, payee, timestamp);

        if (result.status === 'OK') {
            return res.status(200).send({
                message: 'Settlement finalized successfully',
                finalizedSettlement: result.finalizedSettlement
            });
        } else {
            return res.status(400).send({
                message: 'Settlement could not be finalized'
            });
        }

    } catch (e) {
        return res.status(400).send({
            status: 'ERROR',
            message: e.message
        });
    }
}

const handlePOSTViewSettlement = async (req, res) => {
    try {
        let settlementObject = req.body.settlementObject;
        let payer = settlementObject.payer;
        let payee = settlementObject.payee;
        let timestamp = settlementObject.timestamp;
        let viewer = res.locals.middlewareResponse.user.username;
        let bank = res.locals.middlewareResponse.user.bank;

        let result = await runtime.viewSettlement(payer, payee, timestamp, viewer, bank);

        if (result.status === 'OK') {
            return res.status(200).send({
                message: 'Settlement fetched successfully',
                settlement: result.settlement
            });
        } else {
            return res.status(400).send({
                message: 'Settlement could not be fetched'
            });
        }

    } catch (e) {
        return res.status(400).send({
            status: 'ERROR',
            message: e.message
        });
    }
}

const handlePOSTViewAllSettlements = async (req, res) => {
    try {
        let settlementObject = req.body.settlementObject;
        let payer = settlementObject.payer;
        let payee = settlementObject.payee;
        let viewer = res.locals.middlewareResponse.user.username;
        let bank = res.locals.middlewareResponse.user.bank;

        let result = await runtime.viewAllSettlements(payer, payee, viewer, bank);

        if (result.status === 'OK') {
            return res.status(200).send({
                message: 'Settlements fetched successfully',
                settlements: result.settlements
            });
        } else {
            return res.status(400).send({
                message: 'Settlements could not be fetched'
            });
        }

    } catch (e) {
        return res.status(400).send({
            status: 'ERROR',
            message: e.message
        });
    }
}

const handlePOSTCashTransaction = async (req, res) => {
    try {
        let transactionObject = req.body.transactionObject;
        let transactor = res.locals.middlewareResponse.user.username;
        let value = transactionObject.value;
        let bank = res.locals.middlewareResponse.user.bank;
        let transactionType = transactionObject.transactionType;

        let result = await runtime.cashTransaction(transactor, value, bank, transactionType);

        if (result.status === 'OK') {
            return res.status(200).send({
                message: 'Cash transaction committed successfully',
                cashTransaction: result.cashTransaction
            });
        } else {
            return res.status(400).send({
                message: 'Cash transaction could not be committed'
            });
        }

    } catch (e) {
        return res.status(400).send({
            status: 'ERROR',
            message: e.message
        });
    }
}

const handlePOSTViewAllCashTransactions = async (req, res) => {
    try {
        let transactionObject = req.body.transactionObject;
        let transactor = res.locals.middlewareResponse.user.username;
        let bank = res.locals.middlewareResponse.user.bank;
        let transactionType = transactionObject.transactionType;

        let result = await runtime.viewAllCashTransactions(transactor, bank, transactionType);

        if (result.status === 'OK') {
            return res.status(200).send({
                message: 'Cash transactions fetched successfully',
                cashTransactions: result.cashTransactions
            });
        } else {
            return res.status(400).send({
                message: 'Cash transactions could not be fetched'
            });
        }

    } catch (e) {
        return res.status(400).send({
            status: 'ERROR',
            message: e.message
        });
    }
}

const handlePOSTViewAllUsers = async (req, res) => {
    try {
        let result = await userInterface.findAllUsers();

        if (result.status === 'OK') {
            return res.status(200).send({
                users: result.data
            });
        } else {
            return res.status(400).send({
                message: result.message
            });
        }
    } catch (e) {
        return res.status(400).send({
            status: 'ERROR',
            message: e.message
        });
    }
}

module.exports = {
    handleGETUserDetails,
    handlePOSTRegister,
    handlePOSTIssueSettlement,
    handlePOSTApproveSettlement,
    handlePOSTFinalizeSettlement,
    handlePOSTViewSettlement,
    handlePOSTViewAllSettlements,
    handlePOSTCashTransaction,
    handlePOSTViewAllCashTransactions,
    handlePOSTViewAllUsers
}