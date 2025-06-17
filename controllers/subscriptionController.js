import { Subscription } from "../models/subscription.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const toggleSubscription = asyncHandler(async (req, res) => {
  const channelId = req.params._id;
  if (!channelId || channelId?.trim() === "") {
    throw new ApiError(400, "Error : Channel id Is Required");
  }
  const loggedInUser = req.user._id;
  const existingSubscription = await Subscription.findOne({
    channel: channelId,
    subscriber: loggedInUser,
  });
  if (existingSubscription) {
    await Subscription.deleteOne({ _id: existingSubscription._id });
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Subscription Toggled Successfully"));
   } 
  else {
    const userSubscription = await Subscription.create({
      channel: channelId,
      subscriber: loggedInUser,
    })
    if (!userSubscription || userSubscription?.length === 0) {
      throw new ApiError(
        500,
        "Error : Something went wrong while generating and fetching subscription"
      );
    }
    return res
      .status(201)
      .json(
        new ApiResponse(
          200,
          userSubscription,
          "Subscription Generated And Toggled Successfully"
        )
      )
  }
});

const subscriberList = asyncHandler( async(req,res)=>{
const channelId = req.params._id;
if (!channelId || channelId?.trim() === "") {
  throw new ApiError(400, "Error : Channel id Is Required");
}
const subscribers = await Subscription.aggregate([
    {
        $match : {
            channel : new mongoose.Types.ObjectId(channelId),
        }
    },
    {
        $lookup : {
            from : "users",
            localField : "channel",
            foreignField : "_id",
            as : "channelDetails",
        }
    },
    {
        $lookup : {
            from : "users",
            localField : "subscriber",
            foreignField : "_id",
            as : "subscriberDetails"
        }
    },
    {
        $unwind : "$subscriberDetails",
        $unwind : "$channelDetails",
    },
    {
        $project : {
            _id : 1,
            "channelDetails._id" : 1,
            "channelDetails.fullname" : 1,
            "channelDetails.username" : 1,
            "channelDetails.email" : 1,
            "subscriberDetails._id" : 1,
            "subscriberDetails.fullname" : 1,
            "subscriberDetails.username" : 1,
            createdAt : 1,
        }
    }
])

if(subscribers?.length===0){
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No subscribers found for this user."));
}

if(!subscribers){
    throw new ApiError(500,"Error : Some error occured while fetching subscribers");
}

const totalSubscribers = await Subscription.countDocuments({channel : channelId});

return res
    .status(200)
    .json(new ApiResponse(200, {subscribers,totalSubscribers}, "Subscribers Fetched Successfully"));
});

const channelList = asyncHandler( async(req,res)=>{
     const subscriberId = req.params._id;
     if (!subscriberId || subscriberId?.trim() === "") {
       throw new ApiError(400, "Error : Subscriber id Is Required");
     }
     const channels = await Subscription.aggregate([
       {
         $match: {
           subscriber: new mongoose.Types.ObjectId(subscriberId),
         },
       },
       {
         $lookup: {
           from: "users",
           localField: "channel",
           foreignField: "_id",
           as: "channelDetails",
         },
       },
       {
         $lookup: {
           from: "users",
           localField: "subscriber",
           foreignField: "_id",
           as: "subscriberDetails",
         },
       },
       {
         $unwind: "$channelDetails",
         $unwind: "$subscriberDetails",
       },
       {
         $project: {
           _id: 1,
           createdAt: 1,
           "channelDetails._id": 1,
           "channelDetails.fullname": 1,
           "channelDetails.username": 1,
           "channelDetails.email": 1,
           "subscriberDetails._id": 1,
           "subscriberDetails.username": 1,
           "subscriberDetails.fullname": 1,
         },
       },
     ]);

     if (channels?.length === 0) {
       return res
         .status(200)
         .json(new ApiResponse(200, [], "No channels subscribed by this user."));
     }

     if (!channels) {
       throw new ApiError(
         500,
         "Error : Some error occured while fetching channels"
       );
     }

     const totalChannels = await Subscription.countDocuments({
       subscriber : subscriberId,
     });

     return res
       .status(200)
       .json(
         new ApiResponse(
           200,
           { channels, totalChannels },
           "Channels Fetched Successfully"
         )
       )
});

export { 
    toggleSubscription,
    subscriberList,
    channelList,
 };
