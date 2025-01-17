import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { content } = req.body;

  if(!content){
    throw new ApiError(400, "Tweet content is required")
  }

  const user = req.user._id;

  try {
    const tweet = await Tweet.create({
        content,
        owner: user
    })

    return res
            .status(200)
            .json(new ApiResponse(200, tweet, "Created tweet successfully"))
  } catch (error) {
    console.log("Error creating tweet")

    throw new ApiError(500, "Something went wrong while creating Tweet.")
  }
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const userId = req.params.userId

    try {
        const tweets = await Tweet.find({
          owner: userId,
        }).sort({ createdAt: -1});

        return res
                .status(200)
                .json(new ApiResponse(200, {tweets}))
    } catch (error) {
        console.log("Error fetching user tweets.")

        throw new ApiError(500, "Failed to fetch tweets");
    }

});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const tweetId = req.params.tweetId;
  const { updatedContent } = req.body;

  if(!updatedContent){
    throw new ApiError(400, "Bad Request: Updated content is required.")
  }

  const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
        $set: {
            content: updatedContent,
        },
    },
    {new : true},
  )

  if(!updatedTweet){
    throw new ApiError(404, "Tweet not found")
  }

  return res
            .status(200)
            .json(new ApiResponse(200, updatedTweet))
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const tweetId = req.params.tweetId;
  const deletedTweet = await Tweet.findByIdAndDelete(tweetId); 

  if(!deletedTweet){
    throw new ApiError(404, "Tweet not found.")
  }

  return res.status(200).json(new ApiResponse(200, deletedTweet));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
