'use strict'

/**
 * The Settlement Entity
 */
class Settlement {

    constructor(payer, payee, timestamp, value) {
        this.payer = payer;
        this.payee = payee;
        this.value = value;
        this.issueTimestamp = timestamp;
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

    static deserialize(data) {
        let smnt = new Settlement(data.payer, data.payee, data.issueTimestamp, data.value);
        if (data.isApproved) {
            smnt.setIsApproved();
            smnt.setApprovalTimestamp(data.approvalTimestamp);
        }
        if (data.isFinalized) {
            smnt.setIsFinalized();
            smnt.setFinalizationTimestamp(data.finalizationTimestamp);
        }
        return smnt;
    }
}

module.exports = Settlement;