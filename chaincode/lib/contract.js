'use strict';

// Fabric smart contract class
const { Contract } = require('fabric-contract-api');

// The Product model
const Product = require('./product.js');

/**
 * The e-store smart contract
 */
class EStoreContract extends Contract {

    /**
     * Initialize the ledger with a few products to start with.
     * @param {Context} ctx the transaction context.
     */
    async initLedger(ctx) {
        const products = [
            {
                vendor: 'apple',
                name: 'airpods',
                price: '1000',
                owner: 'apple',
                bought: false
            },
            {
                vendor: 'microsoft',
                name: 'office-suite',
                price: '500',
                owner: 'microsoft',
                bought: false
            }
        ];

        for (let i = 0; i < products.length; i++) {
            await this.releaseProduct(ctx, products[i].vendor, products[i].name, products[i].price, 
                products[i].owner, products[i].bought);
        }

        return products;
    }

    /**
     * Release a new product into the store.
     * @param {Context} ctx The transaction context
     * @param {String} vendor The vendor for this product.
     * @param {String} name The name of this product.
     * @param {String} price The product price
     * @param {String} owner The owner of the product. If unbought, this field should be the same as the vendor.
     * @param {Boolean} bought Whether this product has been bought yet.
     */
    async releaseProduct(ctx, vendor, name, price, owner, bought) {
        // Create a composite key 'PROD{vendor}{name}' for this product.
        let key = ctx.stub.createCompositeKey('PROD', [vendor, name]);
        // Create a new product object with the input data.
        const product = new Product(vendor, name, price, owner, bought);

        // Save the product in the datastore.
        await ctx.stub.putState(key, Buffer.from(JSON.stringify(product)));

        return product;
    }

    /**
     * Buy a product from the store. The product must exist in the store first
     * and be unbought.
     * @param {String} ctx The transaction context.
     * @param {String} vendor The product vendor.
     * @param {String} name The product name.
     * @param {String} newOwner The new owner for the product.
     */
    async buyProduct(ctx, vendor, name, newOwner) {
        // Retrieve the product from the store based on its vendor and name.
        const key = ctx.stub.createCompositeKey('PROD', [vendor, name]);
        const productAsBytes = await ctx.stub.getState(key);
        
        // Check whether the corresponding document in the data store exists.
        if (!productAsBytes || productAsBytes.length === 0) {
            throw new Error(`${key} does not exist`);
        }

        // Deserialize the document into a product object.
        const product = Product.deserialize(JSON.parse(productAsBytes.toString()));

        // Check whether the product has already been bought.
        if (product.getIsBought()) {
            throw new Error(`${key} is not available for purchase`);
        }

        // Update the product in the data store.
        product.setOwner(newOwner);
        product.setIsBought();
        await ctx.stub.putState(key, Buffer.from(JSON.stringify(product)));

        return product;
    }

    /**
     * Retrieve information about a product.
     * @param {String} ctx The transaction context.
     * @param {String} vendor The product vendor.
     * @param {String} name The product name.
     */
    async viewProduct(ctx, vendor, name) {
        // Retrieve the product document from the data store based on its vendor and name.
        const key = ctx.stub.createCompositeKey('PROD', [vendor, name]);
        const productAsBytes = await ctx.stub.getState(key);
        
        // Check whether the product exists.
        if (!productAsBytes || productAsBytes.length === 0) {
            throw new Error(`${key} does not exist`);
        }

        // Return the product information.
        return productAsBytes.toString();
    }

    /**
     * View all unsold products in the store.
     * @param {String} ctx The transaction context.
     */
    async viewUnsoldProducts(ctx) {
        // Retrieve all products stored in the data store.
        const results = [];
        for await (const result of ctx.stub.getStateByPartialCompositeKey('PROD', [])) {
            const strValue = Buffer.from(result.value).toString('utf8');            
            try {
                let product = Product.deserialize(JSON.parse(strValue));

                // Only include those products that haven't been bought yet.
                if (!product.getIsBought()) {
                    results.push(product);
                }
            } catch (error) {
                throw error;
            }
        }

        return results;
    }
}

module.exports = EStoreContract;