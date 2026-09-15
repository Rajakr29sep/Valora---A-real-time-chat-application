import mongoose from "mongoose";


const connectDb = async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("DataBase Connected");
    }
    catch(e){
        throw e;
        console.log(`Database error ${e}`);
    }
}


export default connectDb;