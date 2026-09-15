import express from "express";
import isAuth from "../middleware/isAuth.js";
import { editProfile, getCurrentUser, getOtherUsers, searchUser } from "../controllers/userController.js";
import { upload } from "../middleware/multer.js";
import { logout } from "../controllers/authController.js";

const userRouter = express.Router();

userRouter.get("/current", isAuth, getCurrentUser);
userRouter.get("/others", isAuth,getOtherUsers);
userRouter.get("/logout", logout);
userRouter.get("/search", isAuth,searchUser);
userRouter.put("/profile",isAuth,upload.single("image"),editProfile);

export default userRouter;