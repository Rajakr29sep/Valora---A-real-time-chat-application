import { genToken } from "../config/token.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { name, username, password, email, img } = req.body;
    const IsExist = await User.findOne({ userName:username });
    if (IsExist) {
      console.log("User Name already Exist");
      return res.status(400).json({ message: "username already exist" });
    }

    const IsexistEmail = await User.findOne({ email });
    if (IsexistEmail) {
      console.log("User Email already Exist");
      return res.status(400).json({ message: "Email already exist" });
    }

    if(password.length<6){
        return res.status(400).json({ message: "Password Must be atleast 6 characters long" });
    }

    const HashPassword = await bcrypt.hash(password,10);

    const user = await  User.create ({
        name :name,
        userName : username,
        password:HashPassword,
        email:email,
    })

    const token = await genToken(user._id);
    if(token){
        res.cookie("token",token,{
            httpOnly:true,
            maxAge:7*24*60*60*1000,
            sameSite:"None",
            secure:true
        })
    }else{
        console.log(`error while generating token : ${error}`);
    }

    return res.status(201).json(user);

  } catch (error) {
    console.log(`error while signup : ${error}`);
    return res.status(501).json({message:"error while signup"});
  }
};


export const login = async (req, res) => {
  try {
    const { name, username, password, email, img } = req.body;
 

    const user = await User.findOne({ email });
    
    if (!user) {
      console.log("User not exist");
      return res.status(400).json({ message: "user not exist" });
    }

    const IsCorrectPassword = await bcrypt.compare(password,user.password);

    if(!IsCorrectPassword){
      console.log("Incorrect password ");
      return res.status(400).json({ message: "Incorrect Password" });
    }
    const token = await genToken(user._id);
    
        res.cookie("token",token,{
            httpOnly:true,
            maxAge:7*24*60*60*1000,
              sameSite:"None",
            secure:true
        })
  

    return res.status(201).json(user);

  } catch (error) {
    console.log(`error while Login : ${error}`);
      return res.status(501).json({message:"error while Login"});
  }
};


export const logout = async(req,res)=>{
  try{
    res.clearCookie("token");
    res.status(200).json({message:"Logout Sucsessfully"});
  }catch(error){
    console.log(`error while logout`,error);
      return res.status(501).json({message:"error while Logout"});
  }
}
