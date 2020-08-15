const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

let enrollCentralBank = async () => {
    try {
        // load the network configuration
        const ccpPath = path.resolve('/home/ags/Projects/fabric-samples/test-network/organizations/peerOrganizations/org3.example.com/connection-org3.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        // console.log(JSON.stringify(ccp, undefined, 2));

        // Create a new CA client for interacting with the CA.
        const caInfo = ccp.certificateAuthorities['ca.org3.example.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        // console.log(`Wallet path: ${walletPath}`);

        const identity = await wallet.get('central-bank');

        if (identity) {
            // console.log('An identity for the admin user "central-bank" already exists in the wallet.');
            return {
                status: 'ERROR',
                message: 'An identity for the admin user "central-bank" already exists in the wallet.'
            };
        }
        console.log('WAT');
        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        console.log('WAT2');
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org3MSP',
            type: 'X.509'
        };
        await wallet.put('central-bank', x509Identity);
        // console.log('Successfully enrolled admin user "central-bank" and imported it into the wallet.');
        return {
            status: 'OK',
            message: 'Successfully enrolled admin user "central-bank" and imported it into the wallet.'
        };

    } catch (error) {
        // console.error(`Failed to enroll admin user "central-bank": ${error}`);
        return {
            status: 'ERROR',
            message: error.message
        };
    }
}

let enrollBank001 = async () => {
    try {
        // load the network configuration
        const ccpPath = path.resolve('/home/ags/Projects/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        // console.log(JSON.stringify(ccp, undefined, 2));

        // Create a new CA client for interacting with the CA.
        const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        // console.log(`Wallet path: ${walletPath}`);

        const identity = await wallet.get('bank-001');
        if (identity) {
            // console.log('An identity for the admin user "bank-001" already exists in the wallet.');
            return {
                status: 'ERROR',
                message: 'An identity for the admin user "bank-001" already exists in the wallet.'
            };
        }

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509'
        };
        await wallet.put('bank-001', x509Identity);

        // console.log('Successfully enrolled admin user "bank-001" and imported it into the wallet.');

        return {
            status: 'OK',
            message: 'Successfully enrolled admin user "bank-001" and imported it into the wallet.'
        };

    } catch (error) {
        // console.error(`Failed to enroll admin user "bank-001": ${error}`);
        return {
            status: 'ERROR',
            message: error.message
        };
    }
}

let enrollBank002 = async () => {
    try {
        // load the network configuration
        const ccpPath = path.resolve('/home/ags/Projects/fabric-samples/test-network/organizations/peerOrganizations/org2.example.com/connection-org2.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        // console.log(JSON.stringify(ccp, undefined, 2));

        // Create a new CA client for interacting with the CA.
        const caInfo = ccp.certificateAuthorities['ca.org2.example.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        // console.log(`Wallet path: ${walletPath}`);

        const identity = await wallet.get('bank-002');
        if (identity) {
            // console.log('An identity for the admin user "bank-002" already exists in the wallet.');
            return {
                status: 'ERROR',
                message: 'An identity for the admin user "bank-002" already exists in the wallet.'
            };
        }

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org2MSP',
            type: 'X.509'
        };
        await wallet.put('bank-002', x509Identity);

        // console.log('Successfully enrolled admin user "bank-002" and imported it into the wallet.');

        return {
            status: 'OK',
            message: 'Successfully enrolled admin user "bank-002" and imported it into the wallet.'
        };

    } catch (error) {
        // console.error(`Failed to enroll admin user "bank-002": ${error}`);
        return {
            status: 'ERROR',
            message: error.message
        };
    }
}

let enrollUser = async (user, bank) => {
    try {
        let orgDir, connectionDir, caAuthority, adminName, mspName, affiliation;

        // Load the network configuration.
        if (bank === 'BANK-001') {
            orgDir = 'org1.example.com';
            connectionDir = 'connection-org1.json';
            caAuthority = 'ca.org1.example.com';
            adminName = 'bank-001';
            mspName = 'Org1MSP';
            affiliation = 'org1.department1';
        } else {
            orgDir = 'org2.example.com';
            connectionDir = 'connection-org2.json';
            caAuthority = 'ca.org2.example.com';
            adminName = 'bank-002';
            mspName = 'Org2MSP';
            affiliation = 'org2.department1';
        }

        const ccpPath = path.resolve('/home/ags/Projects/fabric-samples/test-network/organizations/peerOrganizations', orgDir, connectionDir);
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for interacting with the CA.
        const caURL = ccp.certificateAuthorities[caAuthority].url;
        const ca = new FabricCAServices(caURL);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userIdentity = await wallet.get(user + bank);
        if (userIdentity) {
            console.log(`An identity for the user "${user + bank}" already exists in the wallet`);
            return false;
        }

        // Check to see if we've already enrolled the admin user.
        const adminIdentity = await wallet.get(adminName);
        if (!adminIdentity) {
            console.log(`An identity for the admin user "${adminName}" does not exist in the wallet`);
            return false;
        }

        // build a user object for authenticating with the CA
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, adminName);

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register({
            affiliation: affiliation,
            enrollmentID: user + bank,
            role: 'client'
        }, adminUser);

        const enrollment = await ca.enroll({
            enrollmentID: user + bank,
            enrollmentSecret: secret
        });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: mspName,
            type: 'X.509',
        };
        await wallet.put(user + bank, x509Identity);
        console.log(`Successfully registered and enrolled client user "${user + bank}" and imported it into the wallet`);
        return true;

    } catch (error) {
        console.error(`Failed to register user: ${error}`);
        return false;
    }
}

module.exports = {
    enrollBank001,
    enrollBank002,
    enrollCentralBank,
    enrollUser
}