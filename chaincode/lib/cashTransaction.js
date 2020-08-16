'use strict'

/**
 * The Settlement Entity
 */
class CashTransaction {

    constructor(transactor, timestamp, value, type) {
        this.transactor = transactor;
        this.timestamp = timestamp;
        this.value = value;
        this.type = type;
    }

    getTransactor() {
        return this.transactor;
    }

    getTimestamp() {
        return this.timestamp;
    }

    getValue() {
        return this.value;
    }

    getType() {
        return this.type;
    }

    static deserialize(data) {
        return new CashTransaction(data.transactor, data.timestamp, data.value, data.type);
    }
}

module.exports = CashTransaction;