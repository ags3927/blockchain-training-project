const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const bankInterface = require('../db/bank/bankInterface.js');

let handlePOSTLogIn = async (req, res) => {
    try{
        // console.log(req.body);
        let body = req.body;
        let username = body.username;
        let password = body.password;
        let userData = await bankInterface.findBankByQuery({ username }, {});
        let user = userData.data;

        if (user === null){
            res.status(401).send({
                message: "User does not exist"
            })
        }

        let matched = await bcrypt.compare(password, user.password);

        if (matched) {
            let access = 'auth';
            let token = await jwt.sign({_id: user._id.toString(), access}, 'lekhaporakorejegarighorachoreshey').toString();
            user.tokens.push({access,token});
            user.save();
            res.status(200).send({token})
        } else {
            res.status(401).send({
                message: "Incorrect password"
            })
        }
    } catch (e) {
        res.status(401).send({
            message: "ERROR in POST /api/login\\Could not login",
            error: e.message
        })
    }
};

let handleAuthentication = async (req, res, next) => {
    try {
        let token = req.header('x-auth');
        let decodedUser =  await jwt.verify(token,'lekhaporakorejegarighorachoreshey');
        let userData = await bankInterface.findBankByQuery({ _id: decodedUser._id }, { username: 1, userType: 1});
        let user = userData.data;

        if (user){
            res.locals.middlewareResponse = {
                user,
                token
            };
            return next();
        } else {
            res.status(401).send({
                message: 'Authentication failed'
            })
        }
    } catch (e) {
        res.status(401).send({
            message: e.message
        })
    }
};

let handlePOSTLogOut = async (req, res) => {
    try {
        let user = res.locals.middlewareResponse.user;
        let token = res.locals.middlewareResponse.token;

        await bankInterface.findBankByIDAndUpdate(user._id, {
            $pull: {
                tokens: {token}
            }
        });

        res.status(200).send({
            message: "Successfully Logged Out"
        });
    } catch (e) {
        res.status(401).send({
            message: e.message
        });
    }
};

module.exports = {
    handlePOSTLogIn,
    handleAuthentication,
    handlePOSTLogOut
}