import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversationModel.js";
import Message from "../models/Message.js";
import { getUserSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    let sender = req.userId;
    let { reciever } = req.params;
    let { message } = req.body;
    let image;

    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }
    let conversation = await Conversation.findOne({
      participants: { $all: [sender, reciever] },
    });

    let newMessage = await Message.create({
      sender,
      reciever,
      message,
      image,
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [sender, reciever],
        messages: [newMessage._id],
      });
    } else {
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }

    const receiverSocketId = getUserSocketId(reciever);

   if (receiverSocketId) {
  io.to(receiverSocketId).emit("newMessage", newMessage);
}

    return res.status(201).json(newMessage);
  } catch (error) {
    return res.status(500).json({ message: `new Message error ${error} ` });
  }
};

export const getMessage = async (req, res) => {
  try {
    const sender = req.userId;
    const { reciever } = req.params;

    const conversation = await Conversation.findOne({
      participants: { $all: [sender, reciever] },
    }).populate("messages");

    const messages = conversation ? conversation.messages : [];

    return res.status(200).json({
      message: messages,
    });
  } catch (error) {
    console.error("getMessage error:", error);

    return res.status(500).json({
      message: "Failed to get messages",
    });
  }
};
