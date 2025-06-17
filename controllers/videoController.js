import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/videos.models.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import mongoose from "mongoose";

const publishVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  if ([title, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Video Title And Desrciption Are Required");
  }

  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(404, "User not found or authorised to upload a video");
  }

  let thumbnailLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.thumbnail) &&
    req.files.thumbnail.length > 0
  ) {
    thumbnailLocalPath = req.files.thumbnail[0].path;
  }
  if (!thumbnailLocalPath) {
    throw new ApiError(
      400,
      "Error retriving thumbnail path from multer or thumbnail is required field"
    );
  }
  let watchoVideoLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.watchoVideo) &&
    req.files.watchoVideo.length > 0
  ) {
    watchoVideoLocalPath = req.files.watchoVideo[0].path;
  }
  if (!watchoVideoLocalPath) {
    throw new ApiError(
      400,
      "Error retriving video path from multer or video is required field"
    );
  }
  let thumbnail;
  try {
    thumbnail = await uploadOnCloudinary(thumbnailLocalPath, "image");
    if (!thumbnail || !thumbnail.url) {
      throw new ApiError(
        500,
        "Error : Thumbnail and url not found from cloudinary"
      );
    }
  } catch (error) {
    throw new ApiError(500, "Failed to upload thumbnail on uploadOnCloudinary");
  }

  let watchoVideo;
  try {
    watchoVideo = await uploadOnCloudinary(watchoVideoLocalPath, "video");
    if (!watchoVideo || !watchoVideo.url) {
      throw new ApiError(
        "Error : Watcho video and url not found from cloudinary"
      );
    }
  } catch (error) {
    throw new ApiError(500, "Failed to upload watcho video on cloudinary");
  }

  let video = await Video.create({
    title,
    description,
    thumbnail: thumbnail.url,
    videoFile: watchoVideo.url,
    isPublished: true,
    views: watchoVideo.views,
    duration: watchoVideo.duration,
    owner: userId,
    videoPublicId: watchoVideo.public_id,
    thumbnailPublicId: thumbnail.public_id,
  });

  const videoFile = await Video.findById(video._id);

  if (!videoFile) {
    throw new ApiError(
      500,
      "Error : Something went wrong while saving the video to database"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, videoFile, "Video File Database Upload Succesfull!")
    );
});

const getVideoById = asyncHandler(async (req, res) => {
  const videoId = req.params._id;
  if (videoId?.trim() === "" || !videoId) {
    throw new ApiError(400, "Error : Video id is required");
  }
  const video = await Video.findById(videoId)
    .populate({ path: "owner", select: "-_id fullname" })
    .select("-videoPublicId -thumbnailPublicId");
  if (!video) {
    throw new ApiError(404, "Error : Video not found. Enter a valid video id");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video Fetched Successfully!"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const videoId = req.params._id;
  if (videoId?.trim() === "" || !videoId) {
    throw new ApiError(400, "Error : Video id is required for deletion");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Error : Video not found. Enter a valid video id");
  }
  if (video.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(
      403,
      "Forbidden : You are not the owner of this video and cannot delete it"
    );
  }
  const videoPublicId = video.videoPublicId;
  const thumbnailPublicId = video.thumbnailPublicId;
  try {
    await deleteFromCloudinary(videoPublicId, "video");
    await deleteFromCloudinary(thumbnailPublicId, "image");
    console.log("Deletion successfull from cloudinary");
  } catch (error) {
    console.log("Error occured while cloudinary deletion", error);
    throw new ApiError(500, "failed tp delete from cloduinary");
  }
  await Video.findByIdAndDelete(videoId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video Deleted Successfully!"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const videoId = req.params._id;
  if (videoId?.trim() === "" || !videoId) {
    throw new ApiError(400, "Error : Video id is required for deletion");
  }
  const { title, description } = req.body;
  if ([title, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Video Title And Desrciption Are Required");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found. Enter a valid video id");
  }
  if (video.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(
      403,
      "Forbidden : You are not the owner of this video and cannot update it"
    );
  }

  // old cloudinary deletion logic  :

  const videoPublicId = video.videoPublicId;
  const thumbnailPublicId = video.thumbnailPublicId;

  try {
    await deleteFromCloudinary(videoPublicId, "video");
    await deleteFromCloudinary(thumbnailPublicId, "image");
    console.log("Deletion successfull from cloudinary");
  } catch (error) {
    console.log("Error occured while old cloudinary deletion", error);
    throw new ApiError(500, "failed to delete from cloduinary");
  }

  // new updation logic :

  let newThumbnailLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.thumbnail) &&
    req.files.thumbnail.length > 0
  ) {
    newThumbnailLocalPath = req.files.thumbnail[0].path;
  }
  if (!newThumbnailLocalPath) {
    throw new ApiError(
      400,
      "Error retriving thumbnail path from multer or thumbnail is required field"
    );
  }
  let newWatchoVideoLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.watchoVideo) &&
    req.files.watchoVideo.length > 0
  ) {
    newWatchoVideoLocalPath = req.files.watchoVideo[0].path;
  }
  if (!newWatchoVideoLocalPath) {
    throw new ApiError(
      400,
      "Error retriving video path from multer or video is required field"
    );
  }
  let updatedThumbnail;
  try {
    updatedThumbnail = await uploadOnCloudinary(newThumbnailLocalPath);
    if (!updatedThumbnail || !updatedThumbnail.url) {
      throw new ApiError(
        500,
        "Error : New Thumbnail or url not found from cloudinary"
      );
    }
  } catch (error) {
    throw new ApiError(
      500,
      "Failed to upload new thumbnail on uploadOnCloudinary"
    );
  }
  let updatedWatchoVideo;
  try {
    updatedWatchoVideo = await uploadOnCloudinary(
      newWatchoVideoLocalPath,
      "video"
    );
    if (!updatedWatchoVideo || !updatedWatchoVideo.url) {
      throw new ApiError(
        "Error : Watcho video and url not found from cloudinary"
      );
    }
  } catch (error) {
    throw new ApiError(500, "Failed to upload watcho video on cloudinary");
  }
  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title: title,
        description: description,
        thumbnail: updatedThumbnail.url,
        videoFile: updatedWatchoVideo.url,
        videoPublicId: updatedWatchoVideo.public_id,
        thumbnailPublicId: updatedThumbnail.public_id,
        views: updatedWatchoVideo.views,
        duration: updatedWatchoVideo.duration,
        isPublished: true,
      },
    },
    { new: true }
  ).populate({ path: "owner", select: "-_id fullname email" });
  if (!updatedVideo) {
    throw new ApiError(
      404,
      "Error : Something went wrong while updating the video"
    );
  }
  return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "Video Update Successfull"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const videoId = req.params._id;
  if (!videoId || videoId?.trim() === "") {
    throw new ApiError(400, "Error : Video id is required");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Error : Video not found. Enter a valid video id");
  }
  if (video.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(
      403,
      "Forbidden : You are not the owner of this video and cannot change publish status"
    );
  }
  const videoAfterPublish = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        isPublished: !video.isPublished,
      },
    },
    { new: true }
  );
  if (!videoAfterPublish) {
    throw new ApiError(
      404,
      "Error : Something went wrong while toggling published status"
    );
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        videoAfterPublish,
        "Toggle status changed successfully"
      )
    );
});

const getAllVideos = asyncHandler(async (req, res) => {
  const userId = req.params._id;
  if (!userId || userId?.trim() === "") {
    throw new ApiError(400, "Error : User id is required");
  }
  const userVideos = await Video.aggregate([
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
        as: "videoOwner",
      },
    },
    {
      $unwind: "$videoOwner",
    },
    {
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        duration: 1,
        views: 1,
        "videoOwner.username": 1,
        "videoOwner.fullname": 1,
        "videoOwner.email": 1,
        createdAt: 1,
      },
    },
  ]);

  if (userVideos?.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "No Videos By This User"));
  }

  if (!userVideos) {
    throw new ApiError(500, "Something went wrong while fetching user videos");
  }

  const totalVideos = await Video.countDocuments({ owner: userId });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { userVideos, totalVideos },
        "Videos Fetched Successfully"
      )
    )

});
  

export {
  publishVideo,
  getVideoById,
  deleteVideo,
  updateVideo,
  togglePublishStatus,
  getAllVideos,
};


