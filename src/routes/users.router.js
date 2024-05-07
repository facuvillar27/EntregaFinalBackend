import express from "express";
import { updateUserRole, uploadFiles } from "../controller/users.controller.js";
import { authToken } from "../utils.js";
import upload from "../config/multer.config.js";


const router = express.Router();

router.put("/premium/:uid", authToken, updateUserRole);

router.post("/:uid/documents", upload.array("documents"), uploadFiles);

export default router;