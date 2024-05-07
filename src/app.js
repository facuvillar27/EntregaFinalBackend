import express from 'express';
import { __dirname } from './utils.js';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

import UserCart from './routes/userCart.router.js';
import CartsRouter from './routes/carts.router.js';
import SessionsRouter from './routes/sessions.router.js';
import ViewsRouter from './routes/views.router.js'
import ProductsRouter from './routes/products.router.js';
import OrdersRouter from './routes/orders.router.js';
import UsersRouter from './routes/users.router.js';
import errorHandler from './middleware/errors/index.js';
import { addLogger } from './logger.js';

import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import passport from 'passport';
import { initializeJwtStrategy, initializeRegisterStrategy, initializeGithubStrategy } from './config/passport.config.js';
import { authToken, authorization } from './utils.js';
import cookieParser from 'cookie-parser';
import config from './config/config.js';

const app = express();
const PORT = config.app.PORT;
const MONGO_URL = config.mongo.URL;

/**
 * Template engine
 */
app.engine('handlebars',handlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine','handlebars');

/**
 * Swagger Options
 */

const swaggerOptions = {
    definition:{
        openapi: '3.0.1',
        info:{
            title: 'Documentacion Ecommerce API',
            version: '1.0.0',
            description: 'Api de Ecommerce creada para el curso de backend de Coderhouse',
            contact: {
                name: 'Facundo Villar'
            },
            servers: ['http://localhost:8080']
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`],
}



/**
 * Middlewares
*/
const specs = swaggerJsDoc(swaggerOptions);
app.use(express.static(__dirname+'/public'))
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(addLogger);
app.use('/apidocs',swaggerUiExpress.serve,swaggerUiExpress.setup(specs));

async function enviroment() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log('Database connected');
    } catch (error) {
        console.log(error);
    }
}

enviroment();


initializeGithubStrategy();
initializeRegisterStrategy();
// initializeJwtStrategy();
app.use(passport.initialize());
app.use(cookieParser());

app.use('/', ViewsRouter)
app.use('/api/userCart', authToken, authorization("user", "premium"), UserCart);
app.use('/api/carts', authToken, authorization("user", "premium"), CartsRouter);
app.use('/api/products', ProductsRouter);
app.use('/api/sessions', SessionsRouter);
app.use('/api/orders', OrdersRouter);
app.use('/api/users', UsersRouter);
app.use(errorHandler);

const server = app.listen(PORT,()=>console.log(`Listening on PORT ${PORT}`));
