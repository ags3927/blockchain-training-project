'use strict'

/**
 * The Settlement Entity
 */
class Settlement {

    constructor(payer, payee, timestamp, value) {
        this.payer = payer;
        this.payee = payee;
        this.issueTimestamp = timestamp;
        this.value = value;
        this.approvalTimestamp = null;
        this.finalizationTimestamp = null;
        this.isApproved = false;
        this.isFinalized = false;
    }

    getPayer() {
        return this.payer;
    }

    getPayee() {
        return this.payee;
    }

    getIssueTimestamp() {
        return this.issueTimestamp;
    }

    getApprovalTimestamp() {
        return this.approvalTimestamp;
    }

    getFinalizationTimestamp() {
        return this.finalizationTimestamp;
    }

    getValue() {
        return this.value;
    }

    getIsFinalized() {
        return this.isFinalized;
    }

    getIsApproved() {
        return this.isApproved;
    }

    setApprovalTimestamp(timestamp) {
        this.approvalTimestamp = new Date(timestamp);
    }

    setFinalizationTimestamp(timestamp) {
        this.finalizationTimestamp = new Date(timestamp);
    }

    setIsFinalized() {
        this.isFinalized = true;
    }

    setIsApproved() {
        this.isApproved = true;
    }
}

module.exports = Settlement;