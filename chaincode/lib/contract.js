'use strict';

// Fabric smart contract class and client identity classes
const { Contract } = require('fabric-contract-api');

// The Settlement model
const Settlement = require('./settlement.js');

/**
 * The rtgs smart contract
 */
class RTGSContract extends Contract {
    /**
     * Initialize the ledger.
     * @param {Context} ctx the transaction context.
     */
    async initLedger(ctx) {
        const settlements = [];
        return settlements;
    }

    /**
     * Issue a new settlement into the store.
     * @param {Context} ctx The transaction context
     * @param {String} payer The payer of this settlement.
     * @param {String} payee The payee of this settlement.
     * @param {Number} value The payable value of the settlement.
     */
    async issueSettlement(ctx, payer, payee, value) {
        let timestamp = new Date();

        // Create a composite key 'SM{payer}{payee}{timestamp}' for this settlement.
        let key = ctx.stub.createCompositeKey('SM', [payer, payee, timestamp]);

        // Create a new settlement object with the input data.
        const settlement = new Settlement(payer, payee, timestamp, value);

        // Save the settlement in the datastore.
        await ctx.stub.putState(key, Buffer.from(JSON.stringify(settlement)));

        return settlement;
    }

    /**
     * 
     * @param {Context} ctx The transaction context.
     * @param {String} payer The payer of this settlement.
     * @param {String} payee The payee of this settlement.
     * @param {String} timestamp The timestamp when this settlement was issued.
     */
    async approveSettlement(ctx, payer, payee, timestamp) {

        // Retrieve the settlement from the store based on its payer, payee and timestamp.
        const key = ctx.stub.createCompositeKey('SM', [payer, payee, timestamp]);
        const settlementAsBytes = await ctx.stub.getState(key);

        // Check whether the corresponding data in the data store exists.
        if (!settlementAsBytes || settlementAsBytes.length === 0) {
            throw new Error(`${key} does not exist.`);
        }

        // Deserialize the document into a settlement object.
        const settlement = new Settlement(JSON.parse(settlementAsBytes.toString()));

        // Check whether the settlement has already been approved.
        if (settlement.getIsApproved()) {
            throw new Error(`${key} is not available for approval.`);
        }
        
        // Update the settlement in the data store.
        settlement.setIsApproved();
        settlement.setApprovalTimestamp(new Date());

        await ctx.stub.putState(key, Buffer.from(JSON.stringify(settlement)));

        return settlement;
    }

    /**
     * Finalize a settlement.
     * @param {Context} ctx The transaction context.
     * @param {String} payer The payer of this settlement.
     * @param {String} payee The payee of this settlement.
     * @param {String} timestamp The time of issuing the settlement.
     */
    async finalizeSettlement(ctx, payer, payee, timestamp) {

        // Retrieve the settlement from the store based on its payer, payee and timestamp.
        const key = ctx.stub.createCompositeKey('SM', [payer, payee, timestamp]);
        const settlementAsBytes = await ctx.stub.getState(key);

        // Check whether the corresponding data in the data store exists.
        if (!settlementAsBytes || settlementAsBytes.length === 0) {
            throw new Error(`${key} does not exist.`);
        }

        // Deserialize the document into a settlement object.
        const settlement = new Settlement(JSON.parse(settlementAsBytes.toString()));

        // Check whether the settlement has already been finalized.
        if (settlement.getIsFinalized()) {
            throw new Error(`${key} is not available for finalization.`);
        }

        // Update the settlement in the data store.
        settlement.setIsFinalized();
        settlement.setFinalizationTimestamp(new Date());

        await ctx.stub.putState(key, Buffer.from(JSON.stringify(settlement)));

        return settlement;
    }

    /**
     * Retrieve information about a product.
     * @param {Context} ctx The transaction context.
     * @param {String} payer The payer of this settlement.
     * @param {String} payee The payee of this settlement.
     * @param {String} timestamp The time of issuing the settlement.
     */
    async viewSettlement(ctx, payer, payee, timestamp) {

        // Retrieve the settlement from the store based on its payer, payee and timestamp.
        const key = ctx.stub.createCompositeKey('SM', [payer, payee, timestamp]);
        const settlementAsBytes = await ctx.stub.getState(key);

        // Check whether the corresponding data in the data store exists.
        if (!settlementAsBytes || settlementAsBytes.length === 0) {
            throw new Error(`${key} does not exist`);
        }

        // Return the settlement information.
        return settlementAsBytes.toString();
    }

    /**
     * View all settlements in the store.
     * @param {Context} ctx The transaction context.
     */
    async viewAllSettlements(ctx) {
        // Retrieve all settlements stored in the data store.
        const settlements = [];
        for await (const result of ctx.stub.getStateByPartialCompositeKey('SM', [])) {
            const strValue = Buffer.from(result.value).toString('utf8');
            try {
                let settlement = new Settlement(JSON.parse(strValue));
                settlements.push(settlement);
            } catch (error) {
                throw error;
            }
        }

        return settlements;
    }

    /**
     * View all settlements in the store before or after a certain time.
     * @param {Context} ctx The transaction context.
     * @param {String} timestamp The time of issuing the settlement.
     */
    async viewSettlementsByTime(ctx, before, timestamp) {
        // Retrieve all settlements stored in the data store before or after a certain time.
        const settlements = [];
        for await (const result of ctx.stub.getStateByPartialCompositeKey('SM', [])) {
            const strValue = Buffer.from(result.value).toString('utf8');
            try {
                let settlement = new Settlement(JSON.parse(strValue));
                settlements.push(settlement);
            } catch (error) {
                throw error;
            }
        }

        return settlements;
    }
}

module.exports = RTGSContract;