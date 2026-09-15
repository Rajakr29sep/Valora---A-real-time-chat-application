import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/userModel.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select("-password");

    console.log("CURRENT USER FROM DB:", user);
    console.log("IMAGE FROM DB:", user?.img);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(`error while getting current user: ${error}`);

    return res.status(500).json({
      message: "Error while getting current user",
    });
  }
};

export const editProfile = async (req, res) => {
  try {
    let { name } = req.body;
    let image;

    let user = await User.findById(req.userId);
    if (name) {
      user.name = name;
    }
    if (req.file) {
      let image = await uploadOnCloudinary(req.file.path);
      user.img = image;
    }

    await user.save();

    if (!user) {
      res.status(400).json({ message: `User not found` });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: `profile Error -> ${error}` });
  }
};

export const getOtherUsers = async (req, res) => {
  try {
    let user = await User.find({
      _id: { $ne: req.userId },
    }).select("-password");
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: `Other Users Error -> ${error}` });
  }
};

export const searchUser = async (req, res) => {
  try {
    let query = req.query.query;

    if (!query) {
      return res.status(400).json({
        message: "query is required",
      });
    }

    let users = await User.find({
      _id: { $ne: req.userId }, // don't return logged-in user
      $or: [
        {
          name: {
            $regex: query,
            $options: "i",
          },
        },
        {
          userName: {
            $regex: query,
            $options: "i",
          },
        },
      ],
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: `Search Error -> ${error}`,
    });
  }
};