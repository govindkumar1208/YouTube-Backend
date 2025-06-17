import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/videos.models.js";
import { Like } from "../models/like.models.js";
import { Tweet } from "../models/tweet.models.js";
import { Comment } from "../models/comment.models.js";
import mongoose from "mongoose";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const videoId = req.params._id;
  if (videoId?.trim() === "" || !videoId) {
    throw new ApiError(400, "Error : Video id is required for deletion");
  }
  const validVideo = await Video.findById(videoId);
  if (!validVideo) {
    throw new ApiError(404, "Error : Video not found. Enter a valid video id");
  }
  const existingLike = await Like.findOne({
    likedBy: req.user._id,
    video: videoId,
  });
  if (existingLike) {
    await Like.deleteOne({ _id: existingLike._id });
  } else {
    const videoLike = await Like.create({
      video: videoId,
      likedBy: req.user._id,
    });
    if (!videoLike) {
      throw new ApiError(
        500,
        "Error : Something went wrong while registering like on the video"
      );
    }
    return res
      .status(201)
      .json(
        new ApiResponse(200, videoLike, "Video like registered successfully!")
      );
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const tweetId = req.params._id;
  if (!tweetId || tweetId?.trim() === "") {
    throw new ApiError(400, "Error : Tweet ID is required");
  }
  const validTweet = await Tweet.findById(tweetId);
  if (!validTweet) {
    throw new ApiError(400, "Error : Enter a valid tweet");
  }
  const existingLike = await Like.findOne({
    tweet: tweetId,
    likedBy: req.user._id,
  });
  if (existingLike) {
    await Like.deleteOne({ _id: existingLike._id });
  } else {
    const tweetLike = await Like.create({
      tweet: tweetId,
      likedBy: req.user._id,
    });
    if (!tweetLike) {
      throw new ApiError(
        500,
        "Error : Something went wrong while registering like on the tweet"
      );
    }
    return res
      .status(201)
      .json(
        new ApiResponse(200, tweetLike, "Tweet like registered successfully!")
      );
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const commentId = req.params._id;
  if (!commentId || commentId?.trim() === "") {
    throw new ApiError(400, "Error : Comment Id is required");
  }
  const validComment = await Comment.findById(commentId);
  if (!validComment) {
    throw new ApiError(400, "Error : Enter a valid comment id");
  }
  const existingLike = await Like.findOne({
    comment: commentId,
    likedBy: req.user._id,
  });
  if (existingLike) {
    await Like.deleteOne({ _id: existingLike._id });
  } else {
    const commentLike = await Like.create({
      comment: commentId,
      likedBy: req.user._id,
    });
    if (!commentLike) {
      throw new ApiError(
        500,
        "Error : Something went wrong while registering like on the comment"
      );
    }
    return res
      .status(201)
      .json(
        new ApiResponse(
          200,
          commentLike,
          "Comment like registered successfully!"
        )
      );
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const loggedInUser = req.user._id;
  if (!loggedInUser) {
    throw new ApiError(
      400,
      "Error : User needs to be logged in to acess liked videos"
    );
  }
  const likedVideos = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(loggedInUser),
        video: { $exists: true, $ne: null },
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "videoDetails",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "videoDetails.owner",
        foreignField: "_id",
        as: "videoOwner",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "likedBy",
        foreignField: "_id",
        as: "likeOwner",
      },
    },
    {
      $unwind: "$videoDetails",
      $unwind: "$videoOwner",
      $unwind: "$likeOwner",
    },
    {
      $project: {
        _id: 1,
        "likeOwner.fullname": 1,
        "likeOwner.username": 1,
        "videoDetails._id": 1,
        "videoDetails.title": 1,
        "videoDetails.description": 1,
        "videoDetails.duration": 1,
        "videoOwner.fullname": 1,
        "videoOwner.username": 1,
        createdAt: 1,
      },
    },
  ]);

  if (likedVideos?.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "No Videos Liked By This User"));
  }

  if (!likedVideos) {
    throw new ApiError(
      500,
      "Something went wrong while fetching user liked videos"
    );
  }

  const totalCount = await Like.countDocuments({
    likedBy: loggedInUser,
    video: { $exists: true, $ne: null },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { likedVideos, totalCount },
        "Liked Videos Fetched Successfully"
      )
    );
});


export { 
  toggleVideoLike, 
  toggleTweetLike, 
  toggleCommentLike, 
  getLikedVideos };
