"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import { getJsPageSizeInKb } from "next/dist/build/utils";
import { FilterQuery, SortOrder } from "mongoose";

interface Params{
    userId:string,
    username:string,
    name:string,
    bio:string,
    image:string,
    path:string,
}

export async function updateUser({
    userId,
    username,
    name,
    bio,
    image,
    path}:Params):Promise<void>{
    connectToDB();

   try {
    await User.findOneAndUpdate({
        id:userId},{username:username.toLowerCase(),
        name,bio,image,onboarded:true},{upsert:true});

        if(path==='/profile/edit'){
            revalidatePath(path);
        }
   } catch (error:any) {
    throw new Error(`Failed to Create/Update User: ${error.message}`)
   }
}

export async function fetchUser(userId:string){
    try{
        connectToDB();
        return await User.findOne({id:userId})
        //.populate({path:'communities',model:Community});
    }
    catch(error:any){
        throw new Error(`Failed To Fetch User ${error.message}`);
    }
    
}

export async function fetchUserPosts(userId: string) {
    try {
      connectToDB();
  
      // Find all threads authored by the user with the given userId
      console.log(userId);
      const threads = await User.findOne({ id: userId }).populate({
        path: "thread",
        model: Thread,
        populate: [
        //   {
        //     path: "community",
        //     model: Community,
        //     select: "name id image _id", // Select the "name" and "_id" fields from the "Community" model
        //   },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "name image id", // Select the "name" and "_id" fields from the "User" model
            },
          },
        ],
      });
      return threads;
    } catch (error) {
      console.error("Error fetching user threads:", error);
      throw error;
    }
  }

export async function fetchUsers({
  userId,
  searchString="",
  pageNumber=1,
  pageSize=20,
  sortBy="desc",
}:{
  userId:string;
  searchString:string;
  pageNumber:number;
  pageSize:number;
  sortBy?:SortOrder;
}){
  try {
    connectToDB();
    const skipAmount = (pageNumber-1) * pageSize;

    const regex = new RegExp(searchString,"i");
    const query:FilterQuery<typeof User>={
      id:{$ne:userId}
    }
    if(searchString.trim()!==''){
      query.$or=[
        {
          username:{$regex : regex}
        },
        {
          name:{$regex:regex}
        }
      ]
    }

    const sortOption = {createdAt:sortBy};
    const usersQuery = User.find(query)
                          .sort(sortOption)
                          .skip(skipAmount)
                          .limit(pageSize);

    const totalUserCount = await User.countDocuments(query);
    const users = await usersQuery.exec();
    const isNext = totalUserCount > skipAmount + users.length; 
    return { users, isNext  };
  }
 catch (error:any) {
    throw new Error(`Failed To Fetch Users : ${error.message}`);
}
}

export async function getActivity(userId: string) {
  try {
    connectToDB();

    // Find all threads created by the user
    const userThreads = await Thread.find({ author: userId });

    // Collect all the child thread ids (replies) from the 'children' field of each user thread
    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    // Find and return the child threads (replies) excluding the ones created by the same user
    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId }, // Exclude threads authored by the same user
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    });

    return replies;
  } catch (error) {
    console.error("Error fetching replies: ", error);
    throw error;
  }
}