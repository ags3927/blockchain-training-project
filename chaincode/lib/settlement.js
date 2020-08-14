'use strict'

/**
 * The Settlement Entity
 */
class Settlement {
    
    constructor(payer, payee, timestamp, value) {
        this.payer = payer;
        this.payee = payee;
        this.timestamp = timestamp;
        this.value = value;
        this.isFinalized = false;
    }

    getPayer() {
        return this.payer;
    }

    getPayee() {
        return this.payee;
    }

    getTimestamp () {
        return this.timestamp;
    }

    getValue() {
        return this.value;
    }

    getIsFinalized() {
        return this.isFinalized;
    }
    
    setIsFinalized() {
        this.isFinalized = true;
    }

    static deserialize(data) {
        return new Product(data.payer, data.payee, data.timestamp, data.value);
    }
}

module.exports = Settlement;