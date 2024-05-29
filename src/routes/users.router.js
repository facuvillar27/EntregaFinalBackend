import express from "express";
import { deleteInactiveUsers, getUsers, updateUserRole, uploadFiles, getPremium } from "../controller/users.controller.js";
import { authToken, passportCall } from "../utils.js";
import upload from "../config/multer.config.js";

const router = express.Router();

router.get("/", getUsers);

router.get("/premium/:uid", updateUserRole);

router.get("/getPremium", passportCall("jwt"), getPremium)

router.post("/:uid/documents", upload.array("documents"), uploadFiles);

router.delete("/", deleteInactiveUsers)

export default router;