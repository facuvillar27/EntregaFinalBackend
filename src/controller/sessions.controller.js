import { userService } from '../repository/index.js';
import UsersDto from '../dao/DTO/users.dto.js';
import { generateToken, createHash, isValidPassword } from '../utils.js';
import CustomError from '../services/errors/CustomError.js';
import EErrors from '../services/errors/enum.js';
import { generateSessionErrorInfo } from '../services/errors/info.js';
import MailingService from '../services/mailing.js';

// import jwt from 'jsonwebtoken';
// import MailingService from '../services/mailing.js';
// import UserDTO from '../dao/DTO/userDTO.js';
// import crypto from 'crypto';
// import { createHash, isValidPassword } from "../utils.js";
// import DAO from '../dao/index.js';

// const userService = new DAO.User();
// const productService = new DAO.Product();

const signupUser = async (req, res) => {
    console.log(req.body);
    req.logger.info("Signup user");
    res.status(200).json({ message: "Signup user" });
}

const failRegister = (req, res, next) => {
    const result = [];
    req.logger.error("Error on database");
    CustomError.createError({
        name: generateSessionErrorInfo(result, EErrors.DATABASE_ERROR).name,
        message: "Error creating user",
        code: EErrors.DATABASE_ERROR,
    });
    next();
}

const loginUser = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            const result = [username, password];
            req.logger.error("Type data error");
            CustomError.createError({
                name: "Invalid type of data",
                cause: generateSessionErrorInfo(result, EErrors.INVALID_TYPES_ERROR),
                message: "Error logging in",
                code: EErrors.INVALID_TYPES_ERROR,
            });
        } else {
            const result = await userService.getUserById(username);
            if (result.length === 0 || !isValidPassword(result[0], password)) {
                req.logger.error("User not found");
                CustomError.createError({
                    name: "Error on database",
                    cause: generateSessionErrorInfo(result, EErrors.DATABASE_ERROR),
                    message: "User not found",
                    code: EErrors.DATABASE_ERROR,
                });
            } else {
                const myToken = generateToken({
                    first_name: result[0].first_name,
                    username,
                    password,
                    role: result[0].role,
                });
                req.logger.info("User logged in");
                res.json({ message: "User logged in", token: myToken });
                }
            }
    } catch (error) {
        next(error);
    }
}

const failLogin = (req, res, next) => {
    const result = [];
    req.logger.error("Error on database");
    CustomError.createError({
        name: "Error on database",
        cause: generateSessionErrorInfo(result, EErrors.DATABASE_ERROR),
        message: "Error logging in",
        code: EErrors.DATABASE_ERROR,
    });
    return next();
}

const forgotPassword = async (req, res, next) => {
    const { username } = req.body;
    try {
        if (!username) {
            const result = [username];
            req.logger.error("Type data error");
            CustomError.createError({
                name: "Invalid type of data",
                cause: generateSessionErrorInfo(result, EErrors.INVALID_TYPES_ERROR),
                message: "Error sending email",
                code: EErrors.INVALID_TYPES_ERROR,
            });
        }

        const user = await userService.getUserById(username);

        if (user.length === 0) {
            req.logger.error("User not found");
            CustomError.createError({
                name: "Error on database",
                cause: generateSessionErrorInfo(user, EErrors.DATABASE_ERROR),
                message: "User not found",
                code: EErrors.DATABASE_ERROR,
            });
        } else {
            const passwordToken = generateToken({ username });
            const mailer = new MailingService();
            const sendEmail = await mailer.sendSimpleMail({
                from: "Ecommerce",
                to: username,
                subject: "Password reset",
                html: ` 
                <div style="background-color: #ffffff; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);">
                    <h2 style="text-align: center; color: #333;">Recuperación de Contraseña</h2>
                    <p>Estimado/a ${user[0].first_name},</p>
                    <p>Te enviamos este correo electrónico porque solicitaste restablecer tu contraseña. Para completar el proceso por favor sigue las instrucciones:</p>
                    <p><strong>Paso 1:</strong> Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                    <p><a href="http://127.0.0.1:5500/html/newPassword.html?token=${passwordToken}" style="text-decoration: none; background-color: #4caf50; color: white; padding: 10px 20px; border-radius: 5px; display: inline-block; margin-top: 10px;">Restablecer Contraseña</a></p>
                    <p><strong>Paso 2:</strong> Una vez que hagas clic en el enlace, serás redirigido/a a una página donde podrás crear una nueva contraseña segura para tu cuenta.</p>
                    <p>Si no solicitaste restablecer tu contraseña, por favor ignora este mensaje. Tu información de cuenta sigue siendo segura y no se ha visto comprometida.</p>
                    <p>Atentamente,</p>
                    <p><strong>Ecommerce</strong><br>
                </div>
                  `,
            });
            req.logger.info("Email sent");
            res.status(200).json({ response: "Email sent" });
        }
    } catch (error) {
        next(error);
    }
}

const updatePassword = async (req, res, next) => {
    const { newPasswordData } = req.body;
    const password = newPasswordData;
    const username = req.user.username;

    try {
        if (!password || !username) {
            const result = [password, username];
            req.logger.error("Type data error");
            CustomError.createError({
                name: "Invalid type of data",
                cause: generateSessionErrorInfo(result, EErrors.INVALID_TYPES_ERROR),
                message: "Error updating password",
                code: EErrors.INVALID_TYPES_ERROR,
            });
        }

        const user = await userService.getUserById(username);
        const passwordExist = isValidPassword(user[0].password, password);

        if (user.length === 0) {
            req.logger.error("Error on database");
            CustomError.createError({
                name: "Error on database",
                cause: generateSessionErrorInfo(user, EErrors.DATABASE_ERROR),
                message: "User not found",
                code: EErrors.DATABASE_ERROR,
            });
        } else if (passwordExist) {
            req.logger.error("Password must be different");
            CustomError.createError({
                name: "Authentication error",
                cause: generateSessionErrorInfo(user, EErrors.AUTH_ERROR),
                message: "Password must be different",
                code: EErrors.AUTH_ERROR,
            });
            res.status(400).json({ message: "Password must be different" });
        } else {
            const uid = user[0]._id;
            const newPassword = createHash(password);
            const result = await userService.updateUserPassword(uid, newPassword);
            req.logger.info("Password updated");
            res.status(200).json({ message: "Password updated" });
        }
    } catch (error) {
        next(error);
    }
}

const currentUser = async (req, res) => {
    const user = new UsersDto(req.user);
    res.status(200).json({ data: user });
}

const githubCallback = async (req, res) => {
    req.user = req.user._json;
    res.redirect('/api/products?page=1')
}

export { signupUser, failRegister, loginUser, failLogin, forgotPassword, updatePassword, currentUser, githubCallback };



// const createTokenAndUserDTO = (req) => {
//     const userDTO = new UserDTO(
//         req.user._id,
//         `${req.user.first_name} ${req.user.last_name}`,
//         req.user.role,
//         req.user.email
//     );
//     const serializedUser = {
//         id: userDTO.id,
//         name: userDTO.name,
//         role: userDTO.role,
//         email: userDTO.email
//     }
//     const token = jwt.sign(serializedUser, 'CoderKeyQueNadieDebeSaber', { expiresIn: "1h" });
//     return { token, serializedUser };
// }

// const getProfile = async (req, res) => {
//     let user = await userService.getBy({ "email": req.user.email });
//     let product = await productService.getProducts();
//     let cartProducts = user.cart.products;
//     res.render("current", {
//         user,
//         product,
//         cartProducts,
//     })
// }

// const sendEmail = async (req, res) => {
//     const mailer = new MailingService();
//     const result = await mailer.sendSimpleMail({
//         from: "facuvillar27@gmail.com",
//         to: req.user.email,
//         subject: "Cuenta creada con éxito",
//         html: "<h1>¡Bienvenido!</h1><p>Tu cuenta ha sido creada con éxito.</p>"
//     });
// }

// const passwordReset = async (req, res) => {
//     try {
//         const user = await userService.getBy({ email: req.body.email });
//         if (!user) return res.status(404).json({ error: "User not found" });
//         user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
//         user.resetPasswordExpires = Date.now() + 20000;

//         await userService.update(user._id, user);

//         const resetURL = `http://localhost:${process.env.PORT}/api/sessions/reset/${user.resetPasswordToken}`;

//         const mailer = new MailingService();
//         const result = await mailer.sendSimpleMail({
//             from: "facuvillar27@gmail.com",
//             to: user.email,
//             subject: "Password Reset",
//             html: `<p>Click <a href="${resetURL}">here</a> to reset your password</p>`
//         });
//         res.json({ status: "success", message: "Email sent" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ status: "error", error: "Error sending email" });
//     }
// }

// const resetUserPassword = async (req, res) => {
//     const { rid } = req.params;
//     const user = await userService.getBy({ resetPasswordToken: rid });
//     if (!user) return res.status(404).json({ error: "User not found" });
//     if (user.resetPasswordExpires < Date.now()) {
//         return res.render('newToken', { error: "Token expired" });
//     }
//     res.render('reset', { rid });
// }

// const updateUser = async (req, res) => {
//     const { rid } = req.params;
//     const { password } = req.body;
//     try {
//         const user = await userService.getBy({ resetPasswordToken: rid });
//         if (!user) return res.status(404).json({ status: "error", error: "User not found" });

//         if (user.resetPasswordExpires < Date.now()) {
//             return res.status(404).json({ status: "error", error: "Token expired" });
//         }

//         const isSamePassword = await isValidPassword(user, password);
//         if (isSamePassword) return res.status(400).json({ status: "error", error: "Password must be different" });

//         const hashedPassword = await createHash(password);
//         const updatedUser = await userService.update(user._id, { password: hashedPassword, resetPasswordToken: null, resetPasswordExpires: null});
//         res.json(updatedUser);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ status: 'error', error: "Error al actualizar usuario" });
//     }
// }

// export { createTokenAndUserDTO, getProfile, sendEmail, passwordReset, resetUserPassword, updateUser};