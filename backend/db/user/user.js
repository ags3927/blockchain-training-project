const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const Schema = mongoose.Schema;

const userSchema = new Schema({
    bank: {
        type: String,
        required: true,
        enum: ['BANK-001', 'BANK-002', 'CENTRAL-BANK']
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    address: {
        type: String,
        trim: true,
        minlength: 1
    },
    contact: {
        type: String,
        trim: true,
        minlength: 1
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        minlength: 1
    },
    password: {
        type: String,
        required: true
    },
    lastUpdated: {
        type: Date,
        required: true,
        default: new Date()
    },
    bdtTokens: {
        type: Number,
        required: true
    },
    tokens: [{
        _id: false,
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

userSchema.pre('save', function (next) {
    let bank = this;
    if (bank.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(bank.password, salt, (err, hash) => {
                bank.password = hash;
                bank.lastUpdated = new Date();
                next();
            })
        })
    } else {
        next();
    }
});


const User = new mongoose.model('Bank', userSchema);

module.exports = { User };

