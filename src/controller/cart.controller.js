import { cartService } from "../repository/index.js";
import { productService } from "../repository/index.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enum.js";
import { generateCartErrorInfo, generateAuthErrorInfo } from "../services/errors/info.js";

const getAll = async (req, res, next) => {
    try {
        const carts = await cartService.getAllCarts();
        if (carts.length === 0) {
            req.logger.error("Base date error: Error getting carts");
            CustomError.createError({
                name: "Database error",
                cause: generateCartErrorInfo(carts, EErrors.DATABASE_ERROR),
                message: "Error getting carts",
                code: EErrors.DATABASE_ERROR,
            });
        } else {
            req.logger.info("Carts retrieved");
            res.json({ message: "Carts retrieved", data: carts });
        }
    } catch (err) {
        next(err);
    }
};

const getById = async (req, res, next) => {
    const cid = req.params.cid;
    try {
        if (!cid) {
            req.logger.error("Invalid types error: Valid cart id is required");
            CustomError.createError({
                name: "Invalid types error",
                cause: generateCartErrorInfo(cid, EErrors.INVALID_TYPES_ERROR),
                message: "Error getting cart",
                code: EErrors.INVALID_TYPES_ERROR,
            });
        }
        const cart = await cartService.getCartById(cid);
        if (cart.length === 0) {
            req.logger.error("Base date error: Error getting cart");
            CustomError.createError({
                name: "Database error",
                cause: generateCartErrorInfo(cart, EErrors.DATABASE_ERROR),
                message: "Error getting cart",
                code: EErrors.DATABASE_ERROR,
            });
        } else {
            req.logger.info("Cart retrieved");
            res.json({ message: "Cart retrieved", data: cart });
        }
    } catch (err) {
        next(err);
    }
}

const populatedCart = async (req, res, next) => {
    const cid = req.params.cid;
    try {
        if (!cid) {
            req.logger.error("Invalid types error: Valid cart id is required");
            CustomError.createError({
                name: "Invalid types error",
                cause: generateCartErrorInfo(cid, EErrors.INVALID_TYPES_ERROR),
                message: "Error getting cart",
                code: EErrors.INVALID_TYPES_ERROR,
            });
        }
        const cart = await cartService.populateCart(cid);
        if (!cart) {
            req.logger.error("Base date error: Error populating cart");
            CustomError.createError({
                name: "Database error",
                cause: generateCartErrorInfo(cart, EErrors.DATABASE_ERROR),
                message: "Error populating cart",
                code: EErrors.DATABASE_ERROR,
            });
        } else {
            req.logger.info("Cart populated");
            res.json({ message: "Cart populated", data: cart });
        }
    } catch (err) {
        next(err);
    }
}

const createCart = async (req, res, next) => {
    const newCart = req.body;
    try {
        if (!newCart) {
            req.logger.error("Invalid types error: Valid cart is required");
            CustomError.createError({
                name: "Invalid types error",
                cause: generateCartErrorInfo(newCart, EErrors.INVALID_TYPES_ERROR),
                message: "Error creating cart",
                code: EErrors.INVALID_TYPES_ERROR,
            });
        }
        const result = await cartService.createCart(newCart);
        if(!result.products) {
            req.logger.error("Base date error: Error creating cart");
            CustomError.createError({
                name: "Database error",
                cause: generateCartErrorInfo(result, EErrors.DATABASE_ERROR),
                message: "Error creating cart",
                code: EErrors.DATABASE_ERROR,
            });
        } else {
            req.logger.info("Cart created");
            res.json({ message: "Cart created", data: newCart });
        }
    } catch (err) {
        next(err);
    }
}

const manageCartProducts = async (req, res, next) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const { op } = req.body;
    try {
        if (!cid || !pid || !op) {
            req.logger.error("Invalid types error: Valid cart and product id are required");
            CustomError.createError({
                name: "Invalid types error",
                cause: generateCartErrorInfo(cid, EErrors.INVALID_TYPES_ERROR),
                message: "Error adding product to cart",
                code: EErrors.INVALID_TYPES_ERROR,
            });
        }
        const cart = await cartService.getCartById(cid);
        if (!cart.products) {
            req.logger.error("Base date error: Error getting cart");
            CustomError.createError({
                name: "Database error",
                cause: generateCartErrorInfo(cart, EErrors.DATABASE_ERROR),
                message: "Error getting cart",
                code: EErrors.DATABASE_ERROR,
            });
        } else {
            const product = await productService.getProductById(pid);
            console.log(product.owner);

            if (product.owner === role) {
                req.logger.error("Authentication error: User cannot add own product to cart");
                CustomError.createError({
                    name: "Authentication error",
                    cause: generateAuthErrorInfo(cart, EErrors.AUTH_ERROR),
                    message: "User cannot add own product to cart",
                    code: EErrors.AUTH_ERROR,
                });
                res.json({ status: "error", message: "User cannot add own product to cart" });
            } else {
                const productExist = cart.products.findIndex((product) => product.product === pid);
                if (productExist == -1) {
                    cart.products.push({ product: pid, quantity: 1 });
                } else {
                    if (op === "add") {
                        cart.products[productExist].quantity += 1;
                    } else if (op === "remove") {
                        cart.products[productExist].quantity -= 1;
                    }
                }
                const result = await cartService.updateCart(cid, cart);
                if (!result) {
                    CustomError.createError({
                        name: "Database error",
                        cause: generateCartErrorInfo(cart, EErrors.DATABASE_ERROR),
                        message: "Error updating cart",
                        code: EErrors.DATABASE_ERROR,
                    });
                } else {
                    req.logger.info("Product added to cart");
                    res.json({ message: "Product added to cart", data: cart });
                }
            }
        }
    } catch (err) {
        next(err);
    }
}

const removeProductFromCart = async (req, res, next) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    try {
        if (!cid || !pid) {
            req.logger.error("Invalid types error: Valid cart and product id are required");
            CustomError.createError({
                name: "Invalid types error",
                cause: generateCartErrorInfo(cid, EErrors.INVALID_TYPES_ERROR),
                message: "Error removing product from cart",
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
        }
        let productExistsInCart = cart.products.findIndex((product) => product.product === pid);

        cart.products.splice(productExistsInCart, 1);

        const result = await cartService.updateCart(cid, cart);
        if (!result) {
            req.logger.error("Base date error: Error updating cart");
            CustomError.createError({
                name: "Database error",
                cause: generateCartErrorInfo(cart, EErrors.DATABASE_ERROR),
                message: "Error updating cart",
                code: EErrors.DATABASE_ERROR,
            });
        } else {
            req.logger.info("Product removed from cart");
            res.json({ message: "Product removed from cart", data: cart });
        }
    } catch (err) {
        next(err);
    }
}

const emptyCart = async (req, res, next) => {
    const cid = req.params.cid;
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
        if (cart.length === 0) {
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
                req.logger.info("Cart emptied");
                res.json({ message: "Cart emptied", data: cart });
            }
        } 
    } catch (err) {
            next(err);
    }
}

export { getAll, getById, populatedCart, createCart, manageCartProducts, removeProductFromCart, emptyCart };