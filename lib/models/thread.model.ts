import mongoose from "mongoose";
import { Original_Surfer } from "next/font/google";

const threadSchema = new mongoose.Schema({
    text:{type:String,require:true},
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true,
    },
    community:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Community',
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    parentId:{
        type:String,
    },
    children:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Thread',
        }
    ]
});

const Thread = mongoose.models.Thread || mongoose.model('Thread',threadSchema);

export default Thread;

// Thread Original 

// -->Comment1
//     -->Comment 2 (Iska Parent Comment1)
//         -->Comment 3