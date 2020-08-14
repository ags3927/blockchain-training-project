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
        let issuedSettlement = await runtime.issueSettlement(payer, payee, value, bank);



        let settlement = {
            payer: res.locals.middlewareResponse.user.username,
            payee: settlementObject.payee,
            value: settlementObject.value
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
    handlePOSTIssueSettlement
}