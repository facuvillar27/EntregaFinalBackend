import DAO from "../dao/index.js";
import { cartService } from "../repository/index.js";

const userServices = new DAO.User();
const productServices = new DAO.Product();

const getUsersAndRender = async (req, res) => {
    let users = await userServices.getUsers();
    console.log(users)
    res.render('users', { users });
}

const getProductsAndRender = async (req, res) => {
    let products = await productServices.getAll();
    res.render('products', { products });
}

const getProfileUser = async (req,res,next) => {
    try {
        const user = await userServices.getById(req.user.email);
        const first_name = user.first_name;
        const last_name = user.last_name;
        const email = user.email;
        const role = user.role;
        const products = await productServices.getAll()
        res.render("perfil", {
            first_name,
            last_name,
            email,
            role,
            products,
        })
    } catch (error) {
        next(error);
    }
}

const getCart = async (req,res) => {
    const user = await userServices.getById(req.user.email );
    const cid = user.carts[0]._id;
    const populateCart = await cartService.populateCart(cid);
    const cartProductTotal = populateCart.products
    const cartProducts = populateCart.products.map(product => {
        const subtotal = product.product.price * product.quantity
        return {
            title: product.product.title,
            price: product.product.price,
            quantity: product.quantity,
            subtotal,
        }
    }
    );
    let total = 0;
    cartProductTotal.forEach(product => {
        total += product.product.price * product.quantity;
    });
    res.render("cart", {
        cartProducts,
        total,
        cid: cid.toString(),
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

const renderAdminView = async (req, res, next) => {
    try {
        const users = await userServices.getAll();
        const userRender = users.map(user => {
            return {
                id: user._id.toString(),
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role,
            }
        })
        res.render('adminManager', { userRender });
    } catch (error) {
        next(error);
    }
}

export { getUsersAndRender, getProductsAndRender, getProfileUser, getCart, getMockingProducts, loggerTester, getForgotPassword, renderAdminView};