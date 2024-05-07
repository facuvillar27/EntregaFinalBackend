import supertest from "supertest";
import { expect } from "chai";

const requester = supertest("http://localhost:8080");

describe("Testing de Ecommerce", () => {
    describe("Testing de Products", () => {
        // it("Endpoint GET /api/products debe obtener todo los productos", async () => {

        // });

        // it("Endpoint POST /api/products/6612f3f0d1a4001d67fe5167 debe crear un nuevo producto", async () => {
        //     const newProduct = {
        //         title: "Test",
        //         description: "Test",
        //         price: 100,
        //         thumbnail: "test.jpg",
        //         code: "TST",
        //         stock: 10,
        //         status: "true",
        //         category: "test"
        //     };
        //     const result = await requester.post("/api/products/6612f3f0d1a4001d67fe5167").send(newProduct);
        //     expect(result.ok).to.be.true;

        //     console.log("**********RESULTADO**********")
        //     console.log(result._body);
        //     console.log(result.statusCode);
        //     console.log(result.ok);
        //     console.log("**********RESULTADO**********")
        // });

    });
    
    describe("Testing de Carts", () => {
        it("Endpoint POST /api/carts/cid/purchase debe realizar una compra", async () => {
            const cartId = "6612e975e0fdb1a3ebcfffc5";
            const result = await requester.post(`/api/carts/${cartId}/purchase`)
            console.log("Response Status:", result.status);
        console.log("Response Body:", result.body);

        expect(result.status).to.equal(200);
        expect(result.body).to.include.key('message');
        expect(result.body.message).to.equal('Compra realizada');
        });
    });
});