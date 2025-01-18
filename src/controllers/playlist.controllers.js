import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  //TODO: create playlist
  const userId = req.user._id

  if(!name || !description){
    throw new ApiError(400, "Name and Description are required.")
  }

  try {
    const playlist = await Playlist.create(
        {
            name,
            description,
            owner: userId,
        }
    )

    return res
      .status(200)
      .json(new ApiResponse(200, playlist, "Created playlist successfully"));

  } catch (error) {
    console.log("Error creating playlist");

    throw new ApiError(500, "Something went wrong while creating Playlist.");

  }
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  //TODO: get user playlists
    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user Id");
    }

    try {
        const userPlaylists = await Playlist.find(
            {
                owner: userId,
            }
        )

        if (!userPlaylists.length) {
          return res
            .status(404)
            .json(
              new ApiResponse(404, null, "No playlists found for this user.")
            );
        }

        return res
                .status(200)
                .json(new ApiResponse(200, {userPlaylists}))
    } catch (error) {
        console.log("Error getting user's playlist");

        throw new ApiError(500, "Something went wrong while getting user's playlist.")
    }

});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  //TODO: get playlist by id
  if(!isValidObjectId(playlistId)){
    throw new ApiError(400, "Invalid playlist Id");
  }

  try {
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Playlist not found."));
    }

    return res.status(200).json(new ApiResponse(200, { playlist }));
  } catch (error) {
    console.log("Error getting playlist");

    throw new ApiError(
      500,
      "Something went wrong while getting playlist."
    );
  }
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
    throw new ApiError(400, "Invalid Playlist or Video ID");
  }

  try {
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Playlist not found"));
    }

    if (playlist.videos.includes(videoId)) {
      return res
        .status(400)
        .json(
          new ApiResponse(400, null, "Video already exists in the playlist")
        );
    }

    playlist.videos.push(videoId);

    await playlist.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { playlist },
          "Video added to playlist successfully"
        )
      );
  } catch (error) {
    console.error("Error adding video to playlist:", error);
    throw new ApiError(500, "Failed to add video to playlist");
  }
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist

  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Playlist or Video ID");
  }

  try {
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Playlist not found"));
    }

    if (!playlist.videos.includes(videoId)) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Video not found in the playlist"));
    }

    playlist.videos = playlist.videos.filter((id) => id.toString() !== videoId);
    await playlist.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { playlist },
          "Video removed from playlist successfully"
        )
      );
  } catch (error) {
    console.error("Error removing video from playlist:", error);
    throw new ApiError(500, "Failed to remove video from playlist");
  }
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist Id");
  }

  try {
    const playlist = await Playlist.findByIdAndDelete(playlistId);

    if (!playlist) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Playlist not found."));
    }

    return res.status(200).json(new ApiResponse(200, { playlist }));
  } catch (error) {
    console.log("Error deleting playlist");

    throw new ApiError(500, "Something went wrong while deleting playlist.");
  }
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist Id");
  }

  if (!name && !description) {
    throw new ApiError(
      400,
      "At least one field (name or description) must be provided."
    );
  }

  try {
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;

    const playlist = await Playlist.findByIdAndUpdate(
      playlistId,
      { $set: updateData },
      { new: true }
    );

    if (!playlist) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Playlist not found."));
    }

    return res.status(200).json(new ApiResponse(200, { playlist }));
  } catch (error) {
    console.log("Error updating playlist");

    throw new ApiError(500, "Something went wrong while updating playlist.");
  }
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
