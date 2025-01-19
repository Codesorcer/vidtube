import mongoose from "mongoose";
import { Video } from "../models/video.models.js";
import { Subscription } from "../models/subscriptions.model.js";
import { Like } from "../models/like.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  const userId = req.user._id;

  try {
    // Fetch total videos and total views
    const videoStats = await Video.aggregate([
      { $match: { owner: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalVideos: { $sum: 1 },
          totalViews: { $sum: "$views" },
        },
      },
    ]);

    // Fetch total likes for videos owned by the user
    const totalLikes = await Like.countDocuments({
      video: { $in: await Video.find({ owner: userId }).distinct("_id") },
    });

    // Fetch total subscribers
    const totalSubscribers = await Subscription.countDocuments({
      channel: userId,
    });

    // Combine stats into a response
    const stats = {
      totalVideos: videoStats[0]?.totalVideos || 0,
      totalViews: videoStats[0]?.totalViews || 0,
      totalLikes: totalLikes || 0,
      totalSubscribers: totalSubscribers || 0,
    };

    return res
      .status(200)
      .json(
        new ApiResponse(200, stats, "Channel statistics retrieved successfully")
      );
  } catch (error) {
    console.error("Error fetching channel stats:", error);
    throw new ApiError(500, "Failed to retrieve channel statistics.");
  }
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  const userId = req.user._id;

  try {
    // Fetch all videos uploaded by the user
    const videos = await Video.find({ owner: userId });

    if (!videos.length) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "No videos found for this channel."));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, videos, "Channel videos retrieved successfully")
      );
  } catch (error) {
    console.error("Error fetching channel videos:", error);
    throw new ApiError(500, "Failed to retrieve channel videos.");
  }
});


export { getChannelStats, getChannelVideos };
