import { orderService } from '../repository/index.js';
import { productService } from '../repository/index.js';
import { userService } from '../repository/index.js';
import { cartService } from '../repository/index.js';
import CustomError from '../services/errors/CustomError.js';
import EErrors from '../services/errors/enum.js';
import { generateOrderErrorInfo } from '../services/errors/info.js';
import MailingService from "../services/mailing.js";

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
    const user = await userService.getUserById(req.user.email)
    const populatedCart = await cartService.populateCart(cid)
    let productsToOrder = []
    let total = 0;


    if (!populatedCart) {
        return res.status(404).json({ error: "Carrito no encontrado" })
    }

    const purchaseItems = populatedCart.products.map(async (item) => {
        const product = item.product
        const productInDb = await productService.getProductById(product._id)
        console.log(productInDb)

        if (productInDb.stock < item.quantity) {
            return {success: false, message: 'No hay stock suficiente para el producto', productId: product._id}
        }

        productInDb.stock -= item.quantity
        await productInDb.save()
        total += product.price * item.quantity
        productsToOrder.push(item)

    })

    try {
        await Promise.all(purchaseItems)

        const order = {
            amount: total,
            purchaser: user.email,
        };

        const result = await orderService.createOrder(order);
        await sendOrderMail(result._id.toString(), user)
        emptyCart(cid)
        req.logger.info(`Order created: ${JSON.stringify(result)}`);
        res.json({ message: "Compra realizada", result });
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Error al realizar la compra" })
    }
}

const emptyCart = async (cid) => {
    try {
        if (!cid) {
            req.logger.error("Invalid types error: Valid cart id is required");
            CustomError.createError({
                name: "Invalid types error",
                cause: generateCartErrorInfo(cid, EErrors.INVALID_TYPES_ERROR),
                message: "Error emptying cart",
                code: EErrors.INVALID_TYPES_ERROR,
            });
        }
        const cart = await cartService.getCartById(cid);

        if (!cart) {
            req.logger.error("Base date error: Error getting cart");
            CustomError.createError({
                name: "Database error",
                cause: generateCartErrorInfo(cart, EErrors.DATABASE_ERROR),
                message: "Error getting cart",
                code: EErrors.DATABASE_ERROR,
            });
        } else {
            cart.products = [];
            const result = await cartService.updateCart(cid, cart);
            if (!result) {
                req.logger.error("Base date error: Error empting cart");
                CustomError.createError({
                    name: "Database error",
                    cause: generateCartErrorInfo(cart, EErrors.DATABASE_ERROR),
                    message: "Error empting cart",
                    code: EErrors.DATABASE_ERROR,
                });
            } else {
                console.log("Cart emptied");
            }
        } 
    } catch (err) {
        console.log(err);
    }
}

const sendOrderMail = async (oid, user) => {
    const order = await orderService.getOrderById(oid);
    if (!order) {
        return res.status(404).json({ error: "Orden no encontrada" });
    }

    const mailer = new MailingService();
            await mailer.sendSimpleMail({
                from: "Ecommmerce",
                to: user.email,
                subject: "Orden finalizada",

                html:`
                <div style="background-color: #ffffff; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);">
                    <h2 style="text-align: center; color: #333;">Orden finalizada</h2>
                    <p>Estimado/a ${user.first_name},</p>
                    <p>La orden con id ${oid} ha sido finalizada con éxito.</p>
                    <p>El monto total de la orden es de $${order.amount}</p>
                    <p>Si tienes alguna pregunta o necesitas más información, por favor contacta con nuestro soporte.</p>
                    <p>Atentamente,</p>
                    <p><strong>Ecommerce</strong><br>
                </div>
                `,
            });
}

export { getOrders, getOrderById, createOrder, resolveOrder, getPurchase };