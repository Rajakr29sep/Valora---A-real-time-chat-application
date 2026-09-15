import jwt from "jsonwebtoken";

export const genToken = async(id)=>{
    try{
        const token = jwt.sign({id},process.env.jwtSECTRET,
            {expiresIn:"7d"}
            )
        return token;
    }catch(error){
        console.log(error);
    }
}