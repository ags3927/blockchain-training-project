const bankInterface = require('./bankInterface.js');

const handleGETBankDetails = async (req, res) => {
    try {
        let username = res.locals.middlewareResponse.user.username;
        let result = await bankInterface.findBankByQuery({username}, {name: 1, address: 1, contact: 1, bdtTokens: 1});

        if (result.status === 'OK') {
            let bank = result.data;
            return res.status(200).send({
                status: 'OK',
                bank: {
                    name: bank.name,
                    address: bank.address,
                    contact: bank.contact,
                    bdtTokens: bank.bdtTokens
                }
            });
        } else {
            return res.status(400).send({
                status: result.status,
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

const handlePOSTSettlement = async (req, res) => {
    try {
        let settlementObject = req.body.settlementObject;

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