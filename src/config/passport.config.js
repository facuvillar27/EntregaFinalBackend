import passport from "passport";
import local from 'passport-local';
import jwt from "passport-jwt";
import config from "./config.js";
import GitHubStrategy from 'passport-github2';
import { userService } from "../repository/index.js";
import { createHash } from "../utils.js";
import CustomError from '../services/errors/CustomError.js'
import EErors from '../services/errors/enum.js';
import { generateAuthErrorInfo } from '../services/errors/info.js';


const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const ADMIN_ID = config.admin.EMAIL;
const ADMIN_PASSWORD = config.admin.PASSWORD;
const JWT_SECRET = config.jwt.SECRET;

const initializeJwtStrategy = () => {
    passport.use(
        "jwt",
        new JWTStrategy(
            {
                secretOrKey: JWT_SECRET,
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
            },
            async (jwt_payload, done) => {
                console.log(jwt_payload)
                try {
                    const user = await userService.getUserById(jwt_payload.user.username);
                    console.log(user)
                    if (!user) {
                        const error = new CustomError({
                            name: "Authentication Error",
                            cause: generateAuthErrorInfo(user, EErors.AUTH_ERROR),
                            message: "User not found",
                            code: EErors.AUTH_ERROR
                        })
                        return done(error)
                    } else {
                        return done(null, jwt_payload);
                    }
                } catch (error) {
                    done(error)
                }
            }
        )
    )
}


const initializeRegisterStrategy = () => {
    passport.use(
        "register",
        new LocalStrategy(
            {
                session: false,
                usernameField: "email",
                passReqToCallback: true
            },
            async (req, email, password, done) => {
                const { first_name, last_name } = req.body;
                const role = email === ADMIN_ID || password === ADMIN_PASSWORD ? "admin" : "user";
                try {
                    const user = await userService.getUserById(email);
                    console.log(user)
                    if (user.length > 0) {
                        req.logger.error("User already exists");
                        CustomError.createError({
                            name: "Authentication Error",
                            cause: generateAuthErrorInfo(user, EErors.AUTH_ERROR),
                            message: "User already exists",
                            code: EErors.AUTH_ERROR
                        })
                        
                    } else {
                        const newUser = {
                            first_name,
                            last_name,
                            email,
                            password: createHash(password),
                            role
                        };
                        const result = await userService.signupUser(newUser);
                        return done(null, result);
                    }
                } catch (error) {
                    done(error)
                }
            }
        )
    )
}

const initializeGithubStrategy = () => {
    passport.use(
        "github",
        new GitHubStrategy(
            {
                session: false,
                clientID: config.github.CLIENT_ID,
                clientSecret: config.github.CLIENT_SECRET,
                callbackURL: config.github.CALLBACK_URL
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const user = await userService.getUserById(profile?.emails[0]?.value);
                    if (user) {
                        return done(null, user);
                    } else {
                        const newUser = {
                            first_name: profile.displayName.split(" ")[0],
                            last_name: profile.displayName.split(" ")[1],
                            email: profile?.emails[0]?.value,
                            password: "123"
                        };
                        const userNew = await userService.signupUser(newUser);
                        return done(null, userNew);
                    }
                } catch (error) {
                    return done(error)
                }
            }
        )
    )
}

export { initializeJwtStrategy, initializeRegisterStrategy, initializeGithubStrategy }