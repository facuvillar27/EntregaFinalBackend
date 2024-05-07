import mongoose from 'mongoose';
import { expect } from 'chai';
import Products from '../src/dao/classes/product.dao.js';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGO_URL);

describe("Testing de Products", () => {
    let productsDao;

    before( function () {
        productsDao = new Products();
    });

    beforeEach(function () {
        this.timeout(5000);
    });

    it("Get all products", async function () {
        const products = await productsDao.getAllProducts();
        expect(products).to.be.an('array');
    });

    it("Create a new product", async function () {
        const newProduct = {
            title: "Test",
            description: "Test",
            price: 100,
            thumbnail: "test.jpg",
            code: "TST",
            stock: 10,
            status: "active",
            category: "test"
        };
        const product = await productsDao.createProduct(newProduct);
        expect(product).to.have.property('title', newProduct.title);
    });

    it("Modify a product", async function () {
        const productId = "661b1ae981900ec2fdb026b5";
        const updatedProduct = {
            title: "Updated Test Product"
        };
        const product = await productsDao.modifyProduct(productId, updatedProduct);
        expect(product).to.have.property('title', updatedProduct.title);
    });

    it("Delete a product", async function () {
        const productId = "661b1ae981900ec2fdb026b5";
        const result = await productsDao.deleteProduct(productId);
        expect(result).to.be.ok;
    });

    it("Get product by id", async function () {
        const productId = "661b1ae981900ec2fdb026b5";
        const product = await productsDao.getProductById(productId);
        expect(product).to.have.property('_id', productId);
    });

    it("Get product by code", async function () {
        const code = "abc123";
        const product = await productsDao.getByCode(code);
        expect(product).to.have.property('code', code);
    });

});
