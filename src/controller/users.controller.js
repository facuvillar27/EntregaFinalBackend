import { userService } from "../repository/index.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enum.js";
import { generateSessionErrorInfo } from "../services/errors/info.js";
import MailingService from "../services/mailing.js";
import { ObjectId } from "mongodb";

async function getUsers(req, res, next) {
    try {
        const users = await userService.getAllUsers({}, 'first_name last_name email role');
        const formattedUsers = users.map(user => ({
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            role: user.role
        }));
        req.logger.info(`Users retrieved`);
        res.status(200).json(formattedUsers);
    } catch (error) {
        next(error);
    }
}

async function getPremium(req, res, next) {
    const user = await userService.getUserById(req.user.email);
    try {
        if (!user) {
            req.logger.error(`Error on database: User not found`);
            CustomError.createError({
                name: "Error on database",
                cause: generateSessionErrorInfo(user, EErrors.DATABASE_ERROR),
                message: "User not found",
                code: EErrors.DATABASE_ERROR,
            })
        }
        if (user.role !== "premium") {
            const userUpdated = await userService.updateUserRole(user, "premium");
            req.logger.info(`User role updated`);
        }
        res.redirect("/api/sessions/current");
    } catch (error) {
        next(error);
    }
}


async function updateUserRole(req, res, next){
    const role = req.query.role;
    const uid = req.params.uid;
    const objectId = new ObjectId(uid);
    try {
        if (!role || !uid) {
            const result = [role, uid]
            req.logger.error(`type of data error: Error updating user role`);
            CustomError.createError({
                name: "Type of data error",
                cause: generateSessionErrorInfo(result, EErrors.INVALID_TYPES_ERROR),
                message: "Error updating user role",
                code: EErrors.INVALID_TYPES_ERROR,
            })
        }
        console.log(objectId)
        const user = await userService.getUserByParams({ _id: objectId });
        console.log(user)
        const username = user[0].email;
        if (!user) {
            req.logger.error(`Error on database: User not found`);
            CustomError.createError({
                name: "Error on database",
                cause: generateSessionErrorInfo(user, EErrors.DATABASE_ERROR),
                message: "User not found",
                code: EErrors.DATABASE_ERROR,
            })
        }

        // if (role === "premium" && user.role !== "premium") {
        //     const requiredDocs = ["Identificacion", "Comprobante de domicilio", "Comprobante de estado de cuenta"];
        //     const userDocs = user.documents.map(doc => doc.name);
        //     const hasAllDocs = requiredDocs.every(doc => userDocs.includes(doc));

        //     if (!hasAllDocs) {
        //         req.logger.error(`Error updating user role: Missing documents`);
        //         CustomError.createError({
        //             name: "Error updating user role",
        //             cause: generateSessionErrorInfo(userDocs, EErrors.DATABASE_ERROR),
        //             message: "Missing documents",
        //             code: EErrors.DATABASE_ERROR,
        //         })
        //     }
        // }

        await userService.updateUserRole(user, role);
        req.logger.info(`User role updated`);
        res.redirect(`/admin`);
        
        
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

async function deleteInactiveUsers(req, res, next){
    try {
        const inactiveUsers = await userService.getInactiveUsers(30);
        const mailer = new MailingService();

        const emailPromises = inactiveUsers.map(async user => 
            mailer.sendSimpleMail({
                from: "Ecormerce",
                to: user.email,
                subject: "Cuenta eliminada por inactividad",
                html: `
                <div style="background-color: #ffffff; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);">
                    <h2 style="text-align: center; color: #333;">Cuenta Eliminada por Inactividad</h2>
                    <p>Estimado/a ${user.first_name},</p>
                    <p>Te informamos que tu cuenta ha sido eliminada debido a inactividad en los últimos 30 minutos.</p>
                    <p>Si crees que esto es un error, por favor contacta con nuestro soporte.</p>
                    <p>Atentamente,</p>
                    <p><strong>Ecommerce</strong><br>
                </div>
                `,
            })
        );

        await Promise.all(emailPromises);
        await userService.deleteInactiveUsers(inactiveUsers.map(user => user._id));

        req.logger.info(`Inactive users deleted`);
        res.status(200).json({ message: "Inactive users deleted" });
    } catch (error) {
        next(error);
    }
}


export { getUsers, getPremium, updateUserRole, uploadFiles, deleteInactiveUsers }