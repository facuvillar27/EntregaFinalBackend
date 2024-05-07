import { userService } from "../repository/index.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enum.js";
import { generateSessionErrorInfo } from "../services/errors/info.js";

async function updateUserRole(req, res, next){
    const { role } = req.body;
    const { uid } = req.params;
    const username = uid;
    try {
        if (!role || !username) {
            const result = [role, username]
            req.logger.error(`type of data error: Error updating user role`);
            CustomError.createError({
                name: "Type of data error",
                cause: generateSessionErrorInfo(result, EErrors.INVALID_TYPES_ERROR),
                message: "Error updating user role",
                code: EErrors.INVALID_TYPES_ERROR,
            })
        }
        const user = await userService.getUserById(username);
        if (user.length === 0) {
            req.logger.error(`Error on database: User not found`);
            CustomError.createError({
                name: "Error on database",
                cause: generateSessionErrorInfo(user, EErrors.DATABASE_ERROR),
                message: "User not found",
                code: EErrors.DATABASE_ERROR,
            })
        }

        if (role === "premium" && user.role !== "premium") {
            const requiredDocs = ["Identificacion", "Comprobante de domicilio", "Comprobante de estado de cuenta"];
            const userDocs = user.documents.map(doc => doc.name);
            const hasAllDocs = requiredDocs.every(doc => userDocs.includes(doc));

            if (!hasAllDocs) {
                req.logger.error(`Error updating user role: Missing documents`);
                CustomError.createError({
                    name: "Error updating user role",
                    cause: generateSessionErrorInfo(userDocs, EErrors.DATABASE_ERROR),
                    message: "Missing documents",
                    code: EErrors.DATABASE_ERROR,
                })
            }
        }

        await userService.updateUserRole(username, role);
        req.logger.info(`User role updated`);
        res.status(200).json({ message: "User role updated" });
    } catch (error) {
        next(error);
    }
}

async function uploadFiles (req, res, next) {
    const { uid } = req.params;
    const files = req.files;

    if (!files || files.length === 0) {
        req.logger.error(`Error uploading files: No files found`);
        CustomError.createError({
            name: "Error uploading files",
            cause: generateSessionErrorInfo(files, EErrors.DATABASE_ERROR),
            message: "No files found",
            code: EErrors.DATABASE_ERROR,
        })
    }

    const documents = files.map(file => ({
        name: file.originalname,
        reference: file.path
    }));

    try {
        const user = await userService.getUserById(uid);
        if (!user || user.length === 0) {
            req.logger.error(`Error uploading files: User not found`);
            CustomError.createError({
                name: "Error uploading files",
                cause: generateSessionErrorInfo(user, EErrors.DATABASE_ERROR),
                message: "User not found",
                code: EErrors.DATABASE_ERROR,
            })
        }
        await userService.updateUserDocuments(uid, documents);
        req.logger.info(`Files uploaded`);
        res.status(200).json({ message: "Files uploaded" });
    } catch (error) {
        next(error);
    }
}


        

export { updateUserRole, uploadFiles }