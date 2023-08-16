import mongoose, { mongo } from 'mongoose';

let isConnected = false;

export const connectToDB = async()=>{
    mongoose.set('strictQuery',true);

    if(!process.env.MONGODB_URL)
    return console.log("MONGODB_URL not found");
    
    if(isConnected)
    return console.log("Connection to MongoDb Successfuly made");

    try{
        await mongoose.connect(process.env.MONGODB_URL);
        isConnected =true;
        console.log("Connected to MongoDB")
    }
    catch(error){
        console.log("Connection Error : " + error);
    }
}