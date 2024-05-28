import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import config from './config/config.js';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import CustomError from './services/errors/CustomError.js';
import EErrors from './services/errors/enum.js';
import { generateAuthErrorInfo } from './services/errors/info.js';

const JWT_SECRET = config.jwt.SECRET;

const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword = (savedPassword, password) => {
    return bcrypt.compareSync(password, savedPassword);
}

const generateToken = (user) => {
    const token = jwt.sign({user}, JWT_SECRET, {expiresIn: "1h"});
    return token;
}

// const verifyToken = (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     console.log("Request headers:", req.headers);

//     if (!authHeader) {
//         const err = new Error("La cabecera de autorización no está presente.");
//         req.logger.error(err.message);
//         return next(err);
//     }

//     const token = authHeader.split(" ")[1];
//     console.log("Extracted token:", token);
//     jwt.verify(token, JWT_SECRET, (err, user) => {
//         if (err) {
//             req.logger.error("Error de autenticación. El token no pudo ser verificado.");
//             const customErr = new CustomError({
//                 name: "Error de autenticación",
//                 cause: generateAuthErrorInfo(token, EErrors.AUTH_ERROR),
//                 message: "El token no pudo ser verificado",
//                 code: EErrors.AUTH_ERROR,
//             });
//             return next(customErr); // Pasar el error personalizado al middleware de errores
//         } else {
//             req.user = user;
//             next();
//         }
//     });
// };
    

const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        req.logger.error("Authentication error. Fail to authenticate user.");
        CustomError.createError({
            name: "Authentication error",
            cause: generateAuthErrorInfo(authHeader, EErrors.AUTH_ERROR),
            message: "Failed to authenticate user",
            code: EErrors.AUTH_ERROR,
        });
        return next(new Error("Authentication error"));
    } else {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, JWT_SECRET, (error, credentials) => {
            if (error) {
                console.log("Have an error", err);
                req.logger.error(
                    "Authentication error. Fail to verify the token."
                );
                CustomError.createError({
                    name: "Authentication error",
                    cause: generateAuthErrorInfo(token, EErrors.AUTH_ERROR),
                    message: "Failed to verify the token",
                    code: EErrors.AUTH_ERROR,
                });
                return next(new Error("Authentication error"));
            } else {
                req.user = credentials.user;
                next();
            }
        });
    }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const passportCall = (strategy) => {
    return async (req,res,next) => {
        passport.authenticate(strategy, function(error, user, info) {
            if (error) {
                req.logger.error(
                    "Authentication error. User not authorized."
                )
                CustomError.createError({
                    name: "Authentication error",
                    cause: generateAuthErrorInfo(error, EErrors.AUTH_ERROR),
                    message: "User not authorized.",
                    code: EErrors.AUTH_ERROR,
                })
                return next(error)
            }
            if (!user) {
                req.logger.error(
                    "Authentication error. User not authenticated."
                )
                CustomError.createError({
                    name: "Authentication error",
                    cause: generateAuthErrorInfo(user, EErrors.AUTH_ERROR),
                    message: "User not authenticated",
                    code: EErrors.AUTH_ERROR,
                })
                return res.status(401).json({
                    error: info.message ? info.message : info.toString()
                })
            } else {
                req.user = user;
            }
            next();
        })(req, res, next);
    }
}



const authorization = (...roles) => {
    return async (req,res,next) => {
        console.log(req.body);
        const userRole = req.body.user.role;
        try {
            if (!userRole) {
                req.logger.error(
                    "Autenhtication error. User not authorized."
                )
                CustomError.createError({
                    name: "Authentication error",
                    cause: generateAuthErrorInfo(req.user, EErrors.AUTH_ERROR),
                    message: "User not authorized.",
                    code: EErrors.AUTH_ERROR,
                })
                return res.status(401).send({error: "Unauthorized"})
            }
            if (!roles.includes(userRole)) {
                req.logger.error(
                    "Authorization error. User not authorized."
                )
                CustomError.createError({
                    name: "Authorization error",
                    cause: generateAuthErrorInfo(req.user, EErrors.AUTH_ERROR),
                    message: "User not authorized.",
                    code: EErrors.AUTH_ERROR,
                })
                return res.status(403).send({error: "No permissions"})
            }
            next();
        } catch (error) {
            next(error);
        }
    }
}

const generateProducts = () => {
    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        price: faker.commerce.price(),
        description: faker.commerce.productDescription(),
        code: faker.commerce.product(),
        thumbnail: faker.image.image.url(),
        stock: faker.number.int(20),
        status: true,
        category: faker.commerce.department(),
    }
}

export {
    createHash,
    isValidPassword,
    generateToken,
    // // verifyToken,
    authToken,
    passportCall,
    authorization,
    generateProducts,
    __dirname
}