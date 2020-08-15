const { User } = require('./user.js');

const insertUser = async (userObject) => {
    try {
        let user = new User(userObject);
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

const deleteUser = async (username) => {
    try {

        let data = await User.findOneAndDelete({ username });

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

const findUserByQuery = async (query, option) => {
    try {
        let data = await User.findOne(query, option);

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

const findAllUsers = async () => {
    try {
        let data = await User.find({}, {
            __v: 0,
            _id: 0,
            name: 1,
            username: 1,
            bank: 1
        });

        return {
            data,
            status: 'OK'
        }

    } catch (e) {
        return {
            data: null,
            message: e.message,
            status: 'ERROR'
        };
    }
};

const findUserByIDAndUpdate = async (id, update) => {
    try {
        let data = await User.findByIdAndUpdate(id, update);

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
    insertUser,
    deleteUser,
    findUserByIDAndUpdate,
    findUserByQuery,
    findAllUsers
}