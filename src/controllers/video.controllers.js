import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query = "", sortBy = "createdAt", sortType = "desc", userId } = req.query;
  //TODO: get all videos based on query, sort, pagination

  const filter = {};
  if (query) filter.title = { $regex: query, $options: "i" }; // Case-insensitive search
  if (userId) filter.owner = userId; // Filter videos by user

  const sort = { [sortBy]: sortType === "asc" ? 1 : -1 };

  try {
    const videos = await Video.aggregate([
      { $match: filter },
      { $sort: sort },
      { $skip: (page - 1) * limit },
      { $limit: Number(limit) },
    ]);

    const totalVideos = await Video.countDocuments(filter);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { videos, total: totalVideos },
          "Videos fetched successfully."
        )
      );
  } catch (error) {
    console.error("Error fetching videos:", error);
    throw new ApiError(500, "Failed to fetch videos.");
  }
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video

  if (
    [title, description].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }  

  console.warn(req.files);
  const videoLocalPath = req.files?.videoFile?.[0]?.path
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path

  if(!videoLocalPath || !thumbnailLocalPath){
    throw new ApiError(400, "Video file and Thumbnail is required.");
  }

  let video;
  try {
    video = await uploadOnCloudinary(videoLocalPath);
    console.log("Uploaded video", video);
  } catch (error) {
    console.log("Error uploading video", error)

    throw new ApiError(500, "Failed to upload video.")
  }

  let thumbnail;
  try {
    thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    console.log("Uploaded Thumbnail")
  } catch (error) {
    console.log("Error uploading thumbnail", error);

    throw new ApiError(500, "Failed to upload thumbnail.");
  }

  try {
    const publishVideo = await Video.create({
      videoFile: video?.url,
      thumbnail: thumbnail?.url,
      title,
      description
    })

    if(!publishVideo){
      throw new ApiError(500, "Something went wrong while publishing video")
    }

    return res
            .status(201)
            .json(new ApiResponse(200, publishVideo, "Video published successfully."))
  } catch (error) {
    console.log("Publishing video failed")

    if(video){
      await deleteFromCloudinary(video.public_id)
    }

    if(thumbnail){
      await deleteFromCloudinary(thumbnail.public_id)
    }
  }

  throw new ApiError(500, "Something went wrong while uploading video and the video and thumbnail were deleted.")
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id

  if(!isValidObjectId(videoId)){
    throw new ApiError(400, "Invalid video ID.");
  }

  try {
    const video = await Video.findById(videoId).populate("owner", "name email");

    if (!video) {
      throw new ApiError(404, "Video not found.");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, video, "Video fetched successfully."));
  } catch (error) {
    console.error("Error fetching video by ID:", error);
    throw new ApiError(500, "Failed to fetch video.");
  }
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail

  const { title, description } = req.body;
  const thumbnailFile = req.file;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID.");
  }

  const updates = {};
  if (title) updates.title = title;
  if (description) updates.description = description;

  try {
    if (thumbnailFile) {
      const video = await Video.findById(videoId);

      if (!video) {
        throw new ApiError(404, "Video not found.");
      }

      // Delete old thumbnail from Cloudinary
      if (video.thumbnail) {
        await deleteFromCloudinary(video.thumbnail);
      }

      // Upload new thumbnail
      const uploadedThumbnail = await uploadOnCloudinary(thumbnailFile.path);
      updates.thumbnail = uploadedThumbnail.url;
    }

    const updatedVideo = await Video.findByIdAndUpdate(videoId, updates, {
      new: true,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, updatedVideo, "Video updated successfully."));
  } catch (error) {
    console.error("Error updating video:", error);
    throw new ApiError(500, "Failed to update video.");
  }
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID.");
  }

  try {
    const video = await Video.findById(videoId);

    if (!video) {
      throw new ApiError(404, "Video not found.");
    }

    // Delete video and thumbnail from Cloudinary
    await deleteFromCloudinary(video.videoFile);
    await deleteFromCloudinary(video.thumbnail);

    await video.deleteOne();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Video deleted successfully."));
  } catch (error) {
    console.error("Error deleting video:", error);
    throw new ApiError(500, "Failed to delete video.");
  }
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID.");
  }

  try {
    const video = await Video.findById(videoId);

    if (!video) {
      throw new ApiError(404, "Video not found.");
    }

    video.isPublished = !video.isPublished;
    await video.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          video,
          `Video is now ${video.isPublished ? "published" : "unpublished"}.`
        )
      );
  } catch (error) {
    console.error("Error toggling publish status:", error);
    throw new ApiError(500, "Failed to toggle publish status.");
  }
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
