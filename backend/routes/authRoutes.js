import express from "express";
import {logout,login,signup} from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/signup",signup);
authRouter.post("/login",login);
authRouter.get("/logout",logout);

export default authRouter;