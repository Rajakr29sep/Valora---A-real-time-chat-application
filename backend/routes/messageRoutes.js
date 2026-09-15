

import express from "express";
import isAuth from "../middleware/isAuth.js";
import { upload } from "../middleware/multer.js";
import { getMessage, sendMessage } from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.post("/send/:reciever",isAuth,upload.single("image"),sendMessage);
messageRouter.get("/get/:reciever", isAuth,getMessage);

export default messageRouter;