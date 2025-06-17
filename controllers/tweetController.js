import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Tweet } from "../models/tweet.models.js";
import mongoose from "mongoose";


const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content || content?.trim() === "") {
    throw new ApiError(400, "Tweet Content is required");
  }
  const user = req.user?._id;
  if (!user) {
    throw new ApiError(404, "User does not exists");
  }
  const tweet = await Tweet.create({
    content,
    owner: user,
  });
  let createdTweet = await Tweet.findById(tweet._id).populate({
    path: "owner",
    select: "fullname username email avatar",
  });

  if (!createdTweet) {
    throw new ApiError(404, "Tweet not found");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdTweet, "Tweet created successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const tweetId = req.params._id;
  if (!tweetId) {
    throw new ApiError(400, "Tweet ID is required");
  }
  const { content } = req.body;
  if (content?.trim() === "") {
    throw new ApiError(400, "New Tweet Content is required");
  }

  const existingTweet = await Tweet.findById(tweetId);
  if (!existingTweet) {
    throw new ApiError(400,"No tweet found with this Id");
  }
  if (existingTweet.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(
      403,
      "Forbidden : You are not the owner of this tweet and cannot update it"
    );
  }
  const newTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
      $set: {
        content: content,
      },
    },
    { new: true }
  );
  if (!newTweet) {
    throw new ApiError(404, "Error updating tweet");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, newTweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const tweetId = req.params._id;
  if (!tweetId) {
    throw new ApiError(400, "Tweet ID is required for deletion");
  }
  const existingTweet = await Tweet.findById(tweetId);
  if (!existingTweet) {
    throw new ApiError(400,"No tweet found with this Id");
  }
  if (existingTweet.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(
      403,
      "Forbidden : You are not the owner of this tweet and cannot delete it"
    );
  }
  await Tweet.findByIdAndDelete(tweetId);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Tweet deleted Successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const userId = req.params._id;
  if (!userId || userId?.trim() === "") {
    throw new ApiError(400, "User id is required");
  }
  const userTweets = await Tweet.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "tweetOwner",
      },
    },
    {
      $unwind: "$tweetOwner",
    },
    {
      $project: {
        _id: 1,
        content: 1,
        createdAt: 1,
        "tweetOwner._id": 1,
        "tweetOwner.username": 1,
        "tweetOwner.fullname": 1,
      },
    },
  ]);

  const totalTweets = await Tweet.countDocuments({ owner: userId });

  if (userTweets?.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "No Tweets By This User"));
  }

  if (!userTweets) {
    throw new ApiError(500, "Something went wrong while fetching user tweets");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { userTweets, totalTweets },
        "User Tweets Fetched Successfuly"
      )
    );
});


export { 
  createTweet,
  updateTweet,
  deleteTweet,
  getUserTweets };
