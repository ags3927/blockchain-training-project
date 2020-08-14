'use strict'

/**
 * The Settlement Entity
 */
class CashTransaction {

    constructor(transactor, timestamp, value) {
        this.transactor = transactor;
        this.timestamp = timestamp;
        this.value = value;
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
}

module.exports = CashTransaction;