import { orderService } from '../repository/index.js';
import { productService } from '../repository/index.js';
import { cartService } from '../repository/index.js';
import CustomError from '../services/errors/CustomError.js';
import EErrors from '../services/errors/enum.js';
import { generateOrderErrorInfo } from '../services/errors/info.js';

const getOrders = async (req, res) => {
    try {
        const orders = await orderService.getOrders();
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', error: "Error al obtener ordenes" });
    }
}

const getOrderById = async (req, res) => {
    const oid = req.params.oid

    try {
        const order = await orderService.getOrderById(oid)

        if (!order) {
            return res.status(404).json({ error: "Orden no encontrada" })
        }

        const response = {
            message: "Orden encontrada",
            data: order
        }
        res.json(response)
    } catch (error) {
        res.status(500).json({ error: "Error al obtener la orden" })
    }
}

const createOrder = async (req, res) => {
    let user = await userServices.getBy({ "email": req.user.email });
    let cartProducts = user.cart.products;
    let total = 0;
    let productsToOrder = []

    await Promise.all(cartProducts.map(async (product) => {
        const productInDb = await productService.getProductById(product._id)
        

        if (productInDb.stock < product.quantity) {
            console.log(`No hay stock suficiente para el producto ${product._id}`)
        } else {
            productInDb.stock -= product.quantity
            await productInDb.save()
            total += product.product.price * product.quantity;
            productsToOrder.push(product)
        }
    }));
    
    const order = {
        amount: total,
        purchaser: user.email,
    };
    const result = await orderService.createOrder(order);
    res.json(result);
}

const resolveOrder = async (req, res) => {
    const oid = req.params.oid;
    const newOrder = req.body;
    const order = await orderService.resolveOrder(oid, newOrder);
    if (order === null) {
        return res.status(404).json({ error: "Orden no encontrada" });
    }
    res.json({
        status: "Order modified",
        order,
    });
}

const getPurchase = async (req, res) => {
    const cid = req.params.cid
    const cart = await cartService.getById(cid).populate("products")

    if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" })
    }

    const purchaseItems = cart.products.map(async (product) => {
        const productInDb = await productService.getProductById(product._id)

        if (productInDb.stock < product.quantity) {
            return {success: false, message: 'No hay stock suficiente para el producto', productId: product._id}
        }

        productInDb.stock -= product.quantity
        await productInDb.save()

        return {success: true, message: 'Producto comprado', productId: product._id}
    })
    const result = await Promise.all(purchaseItems)

    res.send({message: "Compra realizada", result})
}

export { getOrders, getOrderById, createOrder, resolveOrder, getPurchase };