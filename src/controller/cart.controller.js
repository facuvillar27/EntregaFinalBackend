import { cartService } from "../repository/index.js";
import { productService } from "../repository/index.js";
import { userService } from "../repository/index.js";
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

const createCart = async (user) => {
    try {
        if (user.carts.length > 0) {

        } else {
            const newCart = await cartService.createCart({ products: [] });
            const result = await userService.updateUserCart(user._id, { carts: newCart._id });
                if (!result) {
                    CustomError.createError({
                        name: "Database error",
                        cause: generateCartErrorInfo(newCart, EErrors.DATABASE_ERROR),
                        message: "Error creating cart",
                        code: EErrors.DATABASE_ERROR,
                    });
                }
            return newCart;
        }
    } catch (err) {
        console.log(err);
    }
}

const manageCartProducts = async (req, res, next) => {
    const user = await userService.getUserById(req.user.email);
    const pid = req.params.pid;
    createCart(user);
    try {
        if (!pid) {
            req.logger.error("Invalid types error: Valid cart and product id are required");
            CustomError.createError({
                name: "Invalid types error",
                cause: generateCartErrorInfo(cid, EErrors.INVALID_TYPES_ERROR),
                message: "Error adding product to cart",
                code: EErrors.INVALID_TYPES_ERROR,
            });
        }
        const product = await productService.getProductById(pid);
        const cid = user.carts[0]._id;

        if (product.owner === user.email) {
            req.logger.error("Authentication error: User cannot add own product to cart");
            res.json({ status: "error", message: "User cannot add own product to cart" });
        } else {
            const cart = await cartService.getCartById(cid);
            const productExist = cart.products.findIndex((product) => product.product.toString() === pid);
            if (productExist == -1) {
                cart.products.push({ product: pid, quantity: 1 });
            } else {
                cart.products[productExist].quantity += 1;
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
                const updatedCart = await cartService.populateCart(cid);
                req.logger.info("Product added to cart");
                res.json({ message: "Product added to cart", data: updatedCart });
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
            res.json({ status: success, message: "Product removed from cart", data: cart });
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
                req.logger.info("Cart emptied");
                res.json({ message: "Cart emptied", data: cart });
            }
        } 
    } catch (err) {
            next(err);
    }
}

export { getAll, getById, populatedCart, createCart, manageCartProducts, removeProductFromCart, emptyCart };