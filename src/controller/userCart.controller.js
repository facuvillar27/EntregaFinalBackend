import { userService } from "../repository/index.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enum.js";
import { generateUserCartErrorInfo } from "../services/errors/info.js";

const userCart = async (req, res, next) => {
    const { cartId, email } = req.body;
    console.log(req.body);
    try {
        if  (!cartId || !email) {
            const error = new CustomError({
                name: "Invalid types",
                cause: generateUserCartErrorInfo([cartId, email], EErrors.INVALID_TYPES_ERROR),
                message: "Error getting user cart",
                code: EErrors.INVALID_TYPES_ERROR
            })
            req.logger.error(error.message);
            throw error;
        }

        const user = await userService.getUserById(email);
        if (user.length === 0) {
            const error = new CustomError({
                name: "Database error",
                cause: generateUserCartErrorInfo(user, EErrors.DATABASE_ERROR),
                message: "Error getting user cart",
                code: EErrors.DATABASE_ERROR
            })
            req.logger.error(error.message);
            throw error;
        }
        console.log(user);

        const userId = user[0]._id;
        console.log(userId);
        if (user.carts == []) {
            user.cart = userId;
            const result = await userService.updateUserCart(userId, user);
            res.status(200).json(result);
        }
    } catch (err) {
        next(err);
    }
}

export default userCart;