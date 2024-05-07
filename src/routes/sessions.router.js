// import jwt from 'jsonwebtoken';
// import Users from "../dao/dbManagers/users.js";
// import Products from "../dao/dbManagers/products.js";
// import passport from "passport";

import { Router } from "express";
import { passportCall } from "../utils.js";
import { verifyToken, authToken } from "../utils.js";
import { updatePassword, signupUser, failRegister, loginUser, failLogin, currentUser, forgotPassword, githubCallback } from "../controller/sessions.controller.js";

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

router.post("/forgotPassword", forgotPassword);

router.put("/updatePassword/:token", verifyToken, updatePassword);

router.get("/current", passportCall("jwt"), currentUser);

router.get(
    "/github",
    passportCall("github", { scope: ["user:email"] }, async (req, res) => {})
);

router.get(
    "/githubcallback",
    passportCall("github", {
        failureRedirect: "/login",
        session: false,
        failureMessage: true,
    }),
    githubCallback
);

export default router;
    

// router.post('/register',passport.authenticate('register',{passReqToCallback:true,session:false,failureRedirect:'api/sessions/failedRegister',failureMessage:true}),(req,res)=>{
//     sendEmail(req);
//     res.send({status:"success",message:"User registered, email sent",payload:req.user._id});
// });

// router.get('/failedRegister',(req,res)=>{
//     res.send("failed Register");
// })

// router.post('/login',passport.authenticate('login',{failureRedirect:'/api/sessions/failedLogin',session:false}),(req,res)=>{
//     const { token, serializedUser } = createTokenAndUserDTO(req);
//     res.cookie('coderCookie',token,{maxAge:3600000}).send({status:"success",payload:serializedUser});
// })

// router.get('/failedLogin',(req,res)=>{
//     console.log(req.message);
//     res.send("failed Login");
// })

// router.get('/current', passportCall("jwt"), getProfile);

// router.post('/forgot-password', passwordReset);

// router.get('/reset/:rid', resetUserPassword);

// router.post('/reset/:rid', updateUser)

// export default router;