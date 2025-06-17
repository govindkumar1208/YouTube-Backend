import { ApiResponse} from "../utils/ApiResponse.js";
import { ApiError} from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.models.js";
import { Video } from "../models/videos.models.js";
import mongoose from "mongoose";

const getVideoComments = asyncHandler(async (req, res) => {
  const videoId = req.params._id;
  if (!videoId || videoId?.trim() === "") {
    throw new ApiError(400, "VideoId Is Required");
  }
  const videoComments = await Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
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
        localField: "owner",
        foreignField: "_id",
        as: "commentOwner",
      },
    },
    {
      $unwind: "$videoDetails",
      $unwind: "$commentOwner",
      $unwind: "$videoOwner",
    },
    {
      $project: {
        content: 1,
        _id: 1,
        "videoDetails.title": 1,
        "videoDetails.owner": 1,
        "videoDetails.description": 1,
        "videoOwner.fullname": 1,
        "videoOwner.username": 1,
        "commentOwner.username": 1,
        "commentOwner.fullname": 1,
        "commentOwner.email": 1,
      },
    },
  ]);

  const totalComments = await Comment.countDocuments({ video: videoId });

  if (videoComments?.length === 0 || !videoComments) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No comments found for this video."));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { videoComments, totalComments },
        "Comments fetched successfully"
      )
    );
});


const addComment = asyncHandler(async (req, res) => {
  const  videoId  = req.params._id;
  const { content } = req.body;
  if (!videoId || videoId?.trim()==="") {
    throw new ApiError(400, "VideoId Is Required");
  }
  if (!content || content?.trim() === "") {
    throw new ApiError(400, "Comment cannot be empty");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found. Enter a valid video id");
  }

  const comment = await Comment.create({
    content,
    video: videoId,
    owner: req.user._id,
  });

  const createdComment = await Comment.findById(comment._id).populate({path : "owner", select : "username email fullname"})

  if (!createdComment) {
    throw new ApiError(404, "Comment not found");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdComment, "Comment addedd successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
     const  commentId  = req.params._id;
     if(!commentId){
        throw  new ApiError(400, "Comment id is required");
     }
     const { updatedContent } = req.body;
     if(!updatedContent || updatedContent?.trim()===""){
     throw new ApiError(400, "Updated Content is required")
     }

     const existingComment = await Comment.findById(commentId)
     if(!existingComment){
        throw new ApiError(404,"No comment found with this Id");
     }
     if(existingComment.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(
          403,
          "Forbidden: You are not the owner of this comment"
        );
     }

     const comment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set : {
                content : updatedContent,
            }
        },
        {
            new : true
        }
     )

     if(!comment){
        throw new ApiError(404, "Comment not found and cannot be updated");
     }

     return res   
       .status(200)
       .json(new ApiResponse(200, comment, "Comment updated successfully"));
});


const deleteComment = asyncHandler( async(req,res)=>{
    const  commentId  = req.params._id;
    if(!commentId){
        throw new ApiError(400, "Comment id is required")
    }
    const existingComment = await Comment.findById(commentId);
    if(!existingComment){
        throw new ApiError(400, "No comment found with this comment id");
    }
    if(existingComment.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(403, "Forbidden : You are not the owner of this comment and cannot delete it")
    }
    await Comment.findByIdAndDelete(commentId);
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Comment deleted successfully"));

})

export { 
  getVideoComments,
  addComment, 
  updateComment, 
  deleteComment };



