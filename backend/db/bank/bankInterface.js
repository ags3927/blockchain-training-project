const { Bank } = require('./bank.js');

let insertBank = async (userObject) => {
    try {
        let user = new Bank(userObject);
        let data = await user.save();

        if (data.nInserted === 0){
            return {
                data,
                message: 'User Insertion Failed',
                status: "ERROR"
            }
        } else {
            return {
                data,
                message: 'User Insertion Successful',
                status: "OK"
            };
        }
    } catch (e) {
        return {
            data: null,
            message: e.message,
            status: "ERROR"
        };
    }
};

let deleteBank = async (username) => {
    try {

        let data = await Bank.findOneAndDelete({ username });

        if (data){
            return {
                data,
                message: 'User Deletion Successful',
                status: 'OK'
            }
        } else {
            return {
                data: null,
                message: 'User Deletion Failed',
                status: 'ERROR'
            };
        }
    } catch (e) {
        return {
            data: null,
            message: e.message,
            status: 'ERROR'
        };
    }
};


let findBankByQuery = async (query, option) => {
    try {
        let data = await Bank.findOne(query, option);

        if (data){
            return {
                data,
                message: 'User Found',
                status: 'OK'
            }
        } else {
            return {
                data: null,
                message: 'User Not Found',
                status: 'ERROR'
            };
        }

    } catch (e) {
        return {
            data: null,
            message: e.message,
            status: 'ERROR'
        };
    }
};

let findBankByIDAndUpdate = async (id, update) => {
    try {
        let data = await Bank.findByIdAndUpdate(id, update);

        if (data){
            return {
                data,
                message: 'User Update Successful',
                status: 'OK'
            }
        } else {
            return {
                data: null,
                message: 'User Update Failed',
                status: 'ERROR'
            };
        }

    } catch (e) {
        return {
            data: null,
            message: e.message,
            status: 'ERROR'
        };
    }
};

module.exports = {
    insertBank,
    deleteBank,
    findBankByIDAndUpdate,
    findBankByQuery
}