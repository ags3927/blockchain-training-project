const {Gateway, Wallets} = require('fabric-network');
const path = require('path');
const fs = require('fs');

let ccp;
let wallet;

function resolveOrganization(bank) {
    let orgDir, connectionDir;

    // load the network configuration
    if (bank === 'BANK-001') {
        orgDir = 'org1.example.com';
        connectionDir = 'connection-org1.json';
    } else if (bank === 'BANK-002') {
        orgDir = 'org2.example.com';
        connectionDir = 'connection-org2.json';
    } else if (bank === 'CENTRAL-BANK') {
        orgDir = 'org3.example.com';
        connectionDir = 'connection-org3.json';
    }

    return {orgDir, connectionDir};
}

/**
 * Issuing of a settlement by the payer to the payee
 * @param {String} payer The payer of this settlement.
 * @param {String} payee The payee of this settlement.
 * @param {String} value The payable value of this settlement.
 * @param {String} bank The bank to which the payer belongs.
 * @returns {JSON} The settlement that has been issued.
 */
let issueSettlement = async (payer, payee, value, bank) => {
    try {
        let {orgDir, connectionDir} = resolveOrganization(bank);

        const ccpPath = path.resolve('/home/ags/Projects/fabric-samples/test-network/organizations/peerOrganizations', orgDir, connectionDir);
        ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(payer + bank);

        if (!identity) {
            console.log(`An identity for the user ${payer + bank} does not exist in the wallet`);
            return {
                status: 'ERROR',
                message: `An identity for the user ${payer + bank} does not exist in the wallet`
            };
        }

        // create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {wallet, identity: payer + bank, discovery: {enabled: true, asLocalhost: true}});

        // get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // get the contract from the network.
        const contract = network.getContract('rtgs');

        // submit the specified transaction.
        const result = await contract.submitTransaction('issueSettlement', payer, payee, value);
        console.log(`Transaction has been submitted. Result is: ${result.toString()}`);

        await gateway.disconnect();

        return {
            status: 'OK',
            result
        };

    } catch (error) {
        console.error(`issueSettlement: Failed to evaluate or invoke transaction: ${error}`);
        return {
            status: 'ERROR',
            message: error.message
        };
    }
}

let approveSettlement = async (payer, payee, timestamp, bank) => {
    try {
        let {orgDir, connectionDir} = resolveOrganization(bank);

        const ccpPath = path.resolve('/home/ags/Projects/fabric-samples/test-network/organizations/peerOrganizations', orgDir, connectionDir);
        ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(payee + bank);

        if (!identity) {
            console.log(`An identity for the user ${payee + bank} does not exist in the wallet`);
            return {
                status: 'ERROR',
                message: `An identity for the user ${payee + bank} does not exist in the wallet`
            };
        }

        // create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {wallet, identity: payee + bank, discovery: {enabled: true, asLocalhost: true}});

        // get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // get the contract from the network.
        const contract = network.getContract('rtgs');

        // submit the specified transaction.
        const result = await contract.submitTransaction('approveSettlement', payer, payee, timestamp);
        console.log(`Transaction has been submitted. Result is: ${result.toString()}`);

        await gateway.disconnect();

        return {
            status: 'OK',
            result
        };

    } catch (error) {
        console.error(`approveSettlement: Failed to evaluate or invoke transaction: ${error}`);
        return {
            status: 'ERROR',
            message: error.message
        };
    }


}

let finalizeSettlement = async (payer, payee, timestamp) => {
    try {

        const ccpPath = path.resolve('/home/ags/Projects/fabric-samples/test-network/organizations/peerOrganizations/org3.example.com/connection-org1.json');
        ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('central-bank');

        if (!identity) {
            console.log(`An identity for the user "central-bank" does not exist in the wallet`);
            return {
                status: 'ERROR',
                message: `An identity for the user "central-bank" does not exist in the wallet`
            };
        }

        // create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {wallet, identity: 'central-bank', discovery: {enabled: true, asLocalhost: true}});

        // get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // get the contract from the network.
        const contract = network.getContract('rtgs');

        // submit the specified transaction.
        const result = await contract.submitTransaction('finalizeSettlement', payer, payee, timestamp);
        console.log(`Transaction has been submitted. Result is: ${result.toString()}`);

        await gateway.disconnect();

        return {
            status: 'OK',
            result
        };

    } catch (error) {
        console.error(`finalizeSettlement: Failed to evaluate or invoke transaction: ${error}`);
        return {
            status: 'ERROR',
            message: error.message
        };
    }


}

let viewSettlement = async (payer, payee, timestamp, viewer, bank) => {
    try {
        if (payer !== viewer && payee !== viewer && viewer !== 'central-bank') return {
            status: 'ERROR',
            message: 'You are not authorized to view this settlement'
        }

        let {orgDir, connectionDir} = resolveOrganization(bank);

        const ccpPath = path.resolve('/home/ags/Projects/fabric-samples/test-network/organizations/peerOrganizations', orgDir, connectionDir);
        ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        let identityKey;

        // Check to see if we've already enrolled the user.
        if (bank === 'CENTRAL-BANK') identityKey = viewer;
        else identityKey = viewer + bank;

        const identity = await wallet.get(identityKey);

        if (!identity) {
            console.log(`An identity for the user ${identityKey} does not exist in the wallet`);
            return {
                status: 'ERROR',
                message: `An identity for the user ${identityKey} does not exist in the wallet`
            };
        }

        // create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {wallet, identity: identityKey, discovery: {enabled: true, asLocalhost: true}});

        // get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // get the contract from the network.
        const contract = network.getContract('rtgs');

        // submit the specified transaction.
        const result = await contract.submitTransaction('viewSettlement', payer, payee, timestamp);
        console.log(`Transaction has been evaluated. Result is: ${result.toString()}`);

        await gateway.disconnect();

        return {
            status: 'OK',
            result
        };

    } catch (error) {
        console.error(`viewSettlement: Failed to evaluate or invoke transaction: ${error}`);
        return {
            status: 'ERROR',
            message: error.message
        };
    }
}

let viewAllSettlements = async (payer, payee, viewer, bank) => {
    try {
        if (payer !== viewer && payee !== viewer && viewer !== 'central-bank') return {
            status: 'ERROR',
            message: 'You are not authorized to view this settlement'
        }

        let {orgDir, connectionDir} = resolveOrganization(bank);

        const ccpPath = path.resolve('/home/ags/Projects/fabric-samples/test-network/organizations/peerOrganizations', orgDir, connectionDir);
        ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        let identityKey;

        // Check to see if we've already enrolled the user.
        if (bank === 'CENTRAL-BANK') identityKey = viewer;
        else identityKey = viewer + bank;

        const identity = await wallet.get(identityKey);

        if (!identity) {
            console.log(`An identity for the user ${identityKey} does not exist in the wallet`);
            return {
                status: 'ERROR',
                message: `An identity for the user ${identityKey} does not exist in the wallet`
            };
        }

        // create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {wallet, identity: identityKey, discovery: {enabled: true, asLocalhost: true}});

        // get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // get the contract from the network.
        const contract = network.getContract('rtgs');

        // submit the specified transaction.
        const result = await contract.submitTransaction('viewAllSettlements', payer, payee);
        console.log(`Transaction has been evaluated. Result is: ${result.toString()}`);

        await gateway.disconnect();

        return {
            status: 'OK',
            result
        };

    } catch (error) {
        console.error(`viewAllSettlements: Failed to evaluate or invoke transaction: ${error}`);
        return {
            status: 'ERROR',
            message: error.message
        };
    }
}

let cashTransaction = async (transactor, value, bank, transactionType) => {
    try {
        let {orgDir, connectionDir} = resolveOrganization(bank);

        const ccpPath = path.resolve('/home/ags/Projects/fabric-samples/test-network/organizations/peerOrganizations', orgDir, connectionDir);
        ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(transactor + bank);

        if (!identity) {
            console.log(`An identity for the user ${transactor + bank} does not exist in the wallet`);
            return {
                status: 'ERROR',
                message: `An identity for the user ${transactor + bank} does not exist in the wallet`
            };
        }

        // create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: transactor + bank,
            discovery: {enabled: true, asLocalhost: true}
        });

        // get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // get the contract from the network.
        const contract = network.getContract('rtgs');

        // submit the specified transaction.
        const result = await contract.submitTransaction(transactionType, transactor, value);
        console.log(`Transaction has been submitted. Result is: ${result.toString()}`);

        await gateway.disconnect();

        return {
            status: 'OK',
            result
        };

    } catch (error) {
        console.error(`deposit: Failed to evaluate or invoke transaction: ${error}`);
        return {
            status: 'ERROR',
            message: error.message
        };
    }
}

let viewAllCashTransactions = async (transactor, viewer, bank, transactionType) => {

    let transactionName = (transactionType === 'deposit') ? 'viewAllDeposits' : 'viewAllWithdrawals';

    try {
        if (transactor !== viewer) return {
            status: 'ERROR',
            message: 'You are not authorized view this transaction'
        };

        let {orgDir, connectionDir} = resolveOrganization(bank);

        const ccpPath = path.resolve('/home/ags/Projects/fabric-samples/test-network/organizations/peerOrganizations', orgDir, connectionDir);
        ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(viewer + bank);

        if (!identity) {
            console.log(`An identity for the user ${viewer + bank} does not exist in the wallet`);
            return {
                status: 'ERROR',
                message: `An identity for the user ${viewer + bank} does not exist in the wallet`
            };
        }

        // create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {wallet, identity: viewer + bank, discovery: {enabled: true, asLocalhost: true}});

        // get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // get the contract from the network.
        const contract = network.getContract('rtgs');

        // submit the specified transaction.
        const result = await contract.submitTransaction(transactionName, transactor);
        console.log(`Transaction has been submitted. Result is: ${result.toString()}`);

        await gateway.disconnect();

        return {
            status: 'OK',
            result
        };

    } catch (error) {
        console.error(`${transactionName}: Failed to evaluate or invoke transaction: ${error}`);
        return {
            status: 'ERROR',
            message: error.message
        };
    }
}

module.exports = {
    issueSettlement,
    approveSettlement,
    finalizeSettlement,
    viewSettlement,
    viewAllSettlements,
    cashTransaction,
    viewAllCashTransactions
}