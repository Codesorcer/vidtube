import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.models.js";
import { Subscription } from "../models/subscription.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // TODO: toggle subscription
  const userId = req.user._id

  if(!isValidObjectId(channelId)){
    throw new ApiError(400, "Invalid Channel Id")
  }

  try {
    // check if already subscribed
    const alreadySubscribed = await Subscription.findOne({
        subscriber: userId,
        channel: channelId  
    })

    if(alreadySubscribed){
        await Subscription.findByIdAndDelete(alreadySubscribed._id);
        return res.status(200).json(
            new ApiResponse(200, {
                message: "Unsbscribed successfully",
            })
        )
    }
    else{
        const subscribe = await Subscription.create({
            subscriber: userId,
            channel: channelId,
          })
    
          return res.status(201).json(
            new ApiResponse(201, {
                    subscription: subscribe
                },
              "Subscribed successfully",
            )
          )
        }
  } catch (error) {
    console.error("Error toggling subscription:", error);
    throw new ApiError(500, "Something went wrong while toggling the subscription");
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if(!isValidObjectId(channelId)){
    throw new ApiError(400, "Invalid Channel ID");
  }

  try {
    const subscribers = await Subscription.find({
      channel: channelId,
    })
      .populate("subscriber", "name email profileImage") // Populate necessary user fields
      .lean();

    if (!subscribers.length) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "No subscribers found."));
    }

    return res.status(200).json(new ApiResponse(200, { subscribers} , "Subscribers fetched successfully" ));
  } catch (error) {
    console.log("Error fetching channel subscribers: ", error);

    throw new ApiError(
      500,
      "Something went wrong while fetching channel subscribers."
    );
  }
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if(!isValidObjectId(subscriberId)){
    throw new ApiError(400, "Invalid Subscriber's ID");
  }
 
  try {
    const subscribedChannels = await Subscription.find({
      subscriber: subscriberId,
    })
      .populate("channel", "name email profileImage") // Populate necessary channel fields
      .lean();

    if (!subscribedChannels) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "No subscribed channels found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { subscribedChannels },
          "Subscribed channels fetched successfully"
        )
      );
  } catch (error) {
    console.log("Error fetching subscribed channels: ", error);

    throw new ApiError(
      500,
      "Something went wrong while fetching subscribed channel."
    );
  }
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
