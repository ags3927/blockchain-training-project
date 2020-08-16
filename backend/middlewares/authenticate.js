const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userInterface = require('../db/user/userInterface.js');

const handlePOSTLogIn = async (req, res) => {
    try{
        let userObject = req.body.userObject;
        let username = userObject.username;
        let password = userObject.password;

        let userData = await userInterface.findUserByQuery({ username }, {});
        let user = userData.data;

        if (user === null){
            return res.status(401).send({
                message: "User does not exist"
            });
        }

        let matched = await bcrypt.compare(password, user.password);

        if (matched) {
            let access = 'auth';
            let token = await jwt.sign({_id: user._id.toString(), access}, 'lekhaporakorejegarighorachoreshey').toString();
            user.tokens.push({access,token});
            user.save();
            return res.status(200).send({
                token,
                user: {
                    name: user.name,
                    username: user.username,
                    address: user.address,
                    contact: user.contact,
                    bank: user.bank,
                    bdtTokens: user.bdtTokens
                }
            });
        } else {
            return res.status(401).send({
                message: "Incorrect password"
            })
        }
    } catch (e) {
        return res.status(401).send({
            message: "ERROR in POST /api/login\\Could not login",
            error: e.message
        })
    }
};

const handleAuthentication = async (req, res, next) => {
    try {
        let token = req.header('x-auth');
        let decodedUser =  await jwt.verify(token,'lekhaporakorejegarighorachoreshey');

        let userData = await userInterface.findUserByQuery({ _id: decodedUser._id }, {
            name: 1,
            username: 1,
            address: 1,
            contact: 1,
            bank: 1,
            bdtTokens: 1
        });

        let user = userData.data;

        if (user){
            res.locals.middlewareResponse = {
                user,
                token
            };
            return next();
        } else {
            return res.status(401).send({
                message: 'Authentication failed'
            });
        }
    } catch (e) {
        return res.status(401).send({
            message: e.message
        });
    }
};

const handleAdminAuthentication = async (req, res, next) => {
    try {
        let token = req.header('x-auth');
        let decodedUser =  await jwt.verify(token,'lekhaporakorejegarighorachoreshey');

        let userData = await userInterface.findUserByQuery({ _id: decodedUser._id }, {
            username: 1,
            name: 1,
            address: 1,
            contact: 1,
            bdtTokens: 1,
            bank: 1
        });

        let user = userData.data;

        if (user && user.bank === 'CENTRAL-BANK'){
            res.locals.middlewareResponse = {
                user,
                token
            };
            return next();
        } else {
            return res.status(401).send({
                message: 'Authentication failed'
            });
        }
    } catch (e) {
        return res.status(401).send({
            message: e.message
        });
    }
};

const handlePOSTLogOut = async (req, res) => {
    try {
        let user = res.locals.middlewareResponse.user;
        let token = res.locals.middlewareResponse.token;

        await userInterface.findUserByIDAndUpdate(user._id, {
            $pull: {
                tokens: {token}
            }
        });

        return res.status(200).send({
            message: "Successfully Logged Out"
        });
    } catch (e) {
        return res.status(401).send({
            message: e.message
        });
    }
};

module.exports = {
    handlePOSTLogIn,
    handleAuthentication,
    handlePOSTLogOut,
    handleAdminAuthentication
}