import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video
  const userId = req.user._id;

  if(!isValidObjectId(videoId)){
    throw new ApiError(400, "Invalid video ID");
  }

  try {
    // if user has already liked the video
    const existingLike = await Like.findOne({ video: videoId})

    if(existingLike){
      // if already liked, remove the like
      await Like.findByIdAndDelete(existingLike._id);
      return res.status(200).json(
        new ApiResponse(200, {
          message: "Video like removed successfully",
        })
      )
    } else{
      const newLike = await Like.create({
        video: videoId,
        likedBy: userId,
      })

      return res.status(201).json(
        new ApiResponse(201, {
          like: newLike,
          message: "Video liked successfully",
        })
      )
    }

  } catch (error) {
    console.error("Error toggling video like:", error);
    throw new ApiError(500, "Something went wrong while toggling the like");
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment
  const userId = req.user._id;

  if(!isValidObjectId(commentId)){
    throw new ApiError(400, "Invalid comment ID");
  }

  try {
    // if user has already liked the comment
    const existingLike = await Like.findOne({ comment: commentId });

    if (existingLike) {
      // if already liked, remove the like
      await Like.findByIdAndDelete(existingLike._id);
      return res.status(200).json(
        new ApiResponse(200, {
          message: "Comment like removed successfully",
        })
      );
    } else {
      const newLike = await Like.create({
        comment: commentId,
        likedBy: userId,
      });

      return res.status(201).json(
        new ApiResponse(201, {
          like: newLike,
          message: "Comment liked successfully",
        })
      );
    }

  } catch (error) {
    console.error("Error toggling comment like:", error);
    throw new ApiError(500, "Something went wrong while toggling the like");
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet
  const userId = req.user._id;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  try {
    // if user has already liked the tweet
    const existingLike = await Like.findOne({ tweet: tweetId });

    if (existingLike) {
      // if already liked, remove the like
      await Like.findByIdAndDelete(existingLike._id);
      return res.status(200).json(
        new ApiResponse(200, {
          message: "Tweet like removed successfully",
        })
      );
    } else {
      const newLike = await Like.create({
        tweet: tweetId,
        likedBy: userId,
      });

      return res.status(201).json(
        new ApiResponse(201, {
          like: newLike,
          message: "Tweet liked successfully",
        })
      );
    }
  } catch (error) {
    console.error("Error toggling tweet like:", error);
    throw new ApiError(500, "Something went wrong while toggling the like");
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  const userId = req.user._id;

  try {
    const likedVideos = await Like.find({
      likedBy: userId,
    })
    .lean();

    if(!likedVideos){
      return res
        .status(404)
        .json(new ApiResponse(404, null, "No liked videos found"));
    }

    return res.status(200).json(
      new ApiResponse(200, 
        { likedVideos }
      )
    )
  } catch (error) {
    console.log("Error fetching liked Videos: ", error)
    
    throw new ApiError(500, "Something went wrong while fetching Liked Videos.")
  }
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };