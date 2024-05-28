// import productsDao from "../dao/mongo/index.js";
// import DAO from "../dao/index.js";

// import Products from "../dao/dbManagers/products.js"
import { productService, userService } from "../repository/index.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enum.js";
import { generateProductErrorInfo } from "../services/errors/info.js";
import MailingService from "../services/mailing.js";

// const productService = new DAO.Product();
// const userService = new DAO.User();

const getAllProducts = async (req, res, next) => {
    try {
        const products = await productService.getProductsList(req.query);
        const message = "Productos encontrados";
        const errorMessage = `Error de base de datos: Error al obtener productos`;
        const error = generateError(products, message, errorMessage);
        res.json({ message, products });
    } catch (err) {
        next(err);
    }
};

const getProductById = async (req, res, next) => {
    const pid = req.params.pid

    try {
        const product = await productService.getProductById(pid)
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" })
        }
        const message = "Producto encontrado";
        const errorMessage = `Error de base de datos: Error al obtener el producto`;
        const error = generateError(product, message, errorMessage);
        res.json({ message, product });
    } catch (err) {
        next(err);
    }
}

const createProduct = async (req, res, next) => {
    const { title, description, code, price, stock, category, owner, thumbnail } = req.body;
    try {
        const product = await productService.createProduct({
            title,
            description,
            code,
            price,
            stock,
            category,
            owner,
            thumbnail
        });
        const message = "Producto creado";
        const errorMessage = `Error de base de datos: Error al crear el producto`;
        const error = generateError(product, message, errorMessage);
        res.json({ message, product });
    } catch (err) {
        next(err);
    }
};

const modifyProduct = async (req, res, next) => { 
    const pid = req.params.pid
    const product = req.body
    try {
        const existingProduct = await productService.getProductById(pid)
        if (!existingProduct) {
            return res.status(404).json({ error: "Producto no encontrado" })
        }
        const response = await productService.modifyProduct(pid, product)
        const message = "Producto actualizado";
        const errorMessage = `Error de base de datos: Error al actualizar el producto`;
        const error = generateError(response, message, errorMessage);
        res.json({ message, product });
    } catch (err) {
        next(err);
    }
}

const deleteProduct = async (req, res, next) => {
    const pid = req.params.pid
    try {
        const existingProduct = await productService.getProductById(pid)
        if (!existingProduct) {
            return res.status(404).json({ error: "Producto no encontrado" })
        }

        const user = await userService.getUserById(existingProduct.owner)
        if (user && user.role === "premium") {
            const mailer = new MailingService();
            await mailer.sendSimpleMail({
                from: "Ecommmerce",
                to: user.email,

                html:`
                <div style="background-color: #ffffff; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);">
                    <h2 style="text-align: center; color: #333;">Producto Eliminado</h2>
                    <p>Estimado/a ${user.first_name},</p>
                    <p>Te informamos que tu producto "${existingProduct.title}" ha sido eliminado de nuestro catálogo.</p>
                    <p>Si tienes alguna pregunta o necesitas más información, por favor contacta con nuestro soporte.</p>
                    <p>Atentamente,</p>
                    <p><strong>Ecommerce</strong><br>
                </div>
                `,
            });
        }
        
        const response = await productService.deleteProduct(pid)
        const message = "Producto eliminado";
        const errorMessage = `Error de base de datos: Error al eliminar el producto`;
        const error = generateError(response, message, errorMessage);
        res.json({ message });
    } catch (err) {
        next(err);
    }
}

function generateError(products, message, errorMessage) {
    if (products.length === 0) {
        req.logger.error(errorMessage);
        return CustomError.createError({
            name: "Error de base de datos",
            cause: generateProductErrorInfo(products, EErrors.DATABASE_ERROR),
            message,
            code: EErrors.DATABASE_ERROR
        });
    }
}


export { getAllProducts, getProductById, createProduct, modifyProduct, deleteProduct}