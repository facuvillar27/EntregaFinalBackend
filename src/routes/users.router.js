import express from "express";
import { deleteInactiveUsers, getUsers, updateUserRole, uploadFiles } from "../controller/users.controller.js";
import { authToken } from "../utils.js";
import upload from "../config/multer.config.js";

const router = express.Router();

router.get("/", getUsers);

router.get("/premium/:uid", updateUserRole);

router.post("/:uid/documents", upload.array("documents"), uploadFiles);

router.delete("/", deleteInactiveUsers)

export default router;