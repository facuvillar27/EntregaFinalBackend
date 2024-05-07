import DAO from "../dao/index.js";
import { generateProducts } from "../utils.js";

const userServices = new DAO.User();
const productServices = new DAO.Product();

const getUsersAndRender = async (req, res) => {
    let users = await userServices.getUsers();
    console.log(users)
    res.render('users', { users });
}

const getProductsAndRender = async (req, res) => {
    let products = await productServices.getAllProducts();
    res.render('products', { products });
}

const getProfile = async (req,res) => {
    let user = await userServices.getBy({ "email": req.user.email });
    let product = await productServices.getAllProducts();
    let cartProducts = user.cart.products;
    res.render("perfil", {
        user,
        product,
        cartProducts,
    })
}

const getCart = async (req,res) => {
    let user = await userServices.getBy({ "email": req.user.email });
    let cartProducts = user.cart.products;
    let total = 0;
    cartProducts.forEach(product => {
        total += product.product.price * product.quantity;
    });
    res.render("cart", {
        cartProducts,
        total
    })
}

const getMockingProducts = async (req,res) => {
        const products = Array.from({ length: 100 }, generateProduct);
        console.log(products);
        res.render('mockingproducts', { products });
}

const getForgotPassword = async (req,res) => {
    res.render('resetPassword');
}

const loggerTester = (req, res) => {
    // Utiliza los detalles del log almacenados en req.logDetails para generar logs adicionales
    req.logger.fatal(`${req.logDetails.method} - ${req.logDetails.url} - ${req.logDetails.date} - Fatal error`);
    req.logger.error(`${req.logDetails.method} - ${req.logDetails.url} - ${req.logDetails.date} - Error`);
    req.logger.warn(`${req.logDetails.method} - ${req.logDetails.url} - ${req.logDetails.date} - Warning`);
    req.logger.info(`${req.logDetails.method} - ${req.logDetails.url} - ${req.logDetails.date} - Info`);
    req.logger.http(`${req.logDetails.method} - ${req.logDetails.url} - ${req.logDetails.date} - HTTP`);
    req.logger.debug(`${req.logDetails.method} - ${req.logDetails.url} - ${req.logDetails.date} - Debug`);
}

export { getUsersAndRender, getProductsAndRender, getProfile, getCart, getMockingProducts, loggerTester, getForgotPassword};