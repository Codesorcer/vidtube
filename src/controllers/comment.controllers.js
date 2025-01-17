import mongoose from "mongoose";
import { Comment } from "../models/comment.models.js";
import { Video } from "../models/video.models.js"
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const video = await Video.findById(videoId);
  if(!video){
    throw new ApiError(404, "Video not found");
  }

  try {
    // paginate comments
    const comments = await Comment.find({ video: videoId})
      .populate("owner", "username") //Include owner details 
      .sort({createdAt: -1}) //sort by latest first
      .skip((page - 1)*limit)
      .limit(Number(limit));

      const totalComments = await Comment.countDocuments({video: videoId});
      const totalPages = Math.ceil(totalComments / limit);

      return res.status(200).json(
        new ApiResponse(200, {
          comments,
          pagination: {
            currentPage: Number(page),
            totalPages,
            totalComments,
          },
        })
      );
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw new ApiError(500, "Failed to fetch comments");
  }
  
});

const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { commentContent } = req.body;
  const userId = req.user._id;

  // Validate video
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (!commentContent) {
    throw new ApiError(400, "Comment content is required");
  }

  try {
    const comment = await Comment.create({
      content: commentContent,
      video: videoId,
      owner: userId,
    });

    return res.status(201).json(
      new ApiResponse(201, {
        comment,
        message: "Comment added successfully",
      })
    );
  } catch (error) {
    console.error("Error adding comment:", error);
    throw new ApiError(500, "Failed to add comment");
  }
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { updatedContent } = req.body;

  if (!updatedContent) {
    throw new ApiError(400, "Updated content is required");
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: { content: updatedContent },
    },
    { new: true }
  );

  if (!updatedComment) {
    throw new ApiError(404, "Comment not found");
  }

  return res.status(200).json(
    new ApiResponse(200, {
      comment: updatedComment,
      message: "Comment updated successfully",
    })
  );
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const deletedComment = await Comment.findByIdAndDelete(commentId);

  if (!deletedComment) {
    throw new ApiError(404, "Comment not found");
  }

  return res.status(200).json(
    new ApiResponse(200, {
      message: "Comment deleted successfully",
    })
  );
});

export { getVideoComments, addComment, updateComment, deleteComment };
