import { Router } from "express";
import { passportCall } from "../utils.js";
import { authToken } from "../utils.js";
import { updatePassword, signupUser, failRegister, loginUser, logoutUser, currentUser, forgotPassword, resetUserPassword, updateUser, githubCallback } from "../controller/sessions.controller.js";

const router = Router();

router.post(
    "/signup",
    passportCall("register", { 
        session: false,
        passReqToCallback: true,
        failureMessage: true,
        failureRedirect: "/api/sessions/failedRegister",
    }),
    signupUser
    );
    
router.get("/failedRegister", failRegister);
    
router.post("/login", loginUser);

router.post("/logout", logoutUser);

router.get('/failedLogin',(req,res)=>{
    console.log(req.message);
    res.send("failed Login");
})

router.post("/forgotPassword", forgotPassword);
    
router.put("/updatePassword/:token", updatePassword);

router.get("/current", authToken, currentUser);

router.get(
    "/github",
    passportCall("github", { scope: ["user:email"] }, async (req, res) => {})
);

router.get(
    "/githubcallback",
    passportCall("github", {
        failureRedirect: "/",
        session: false,
        failureMessage: true,
    }),
    githubCallback
);

router.get('/reset/:rid', resetUserPassword);

router.post('/reset/:rid', updateUser)

export default router;
    